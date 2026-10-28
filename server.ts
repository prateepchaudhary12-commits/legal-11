import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Razorpay conditionally from environment variables (Never crash if unconfigured)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || '';

const razorpay = (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET)
  ? new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    })
  : null;

app.use(express.json());

// CORS configuration supporting custom domain legalberries.in
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://legalberries.in',
    'https://www.legalberries.in',
    'https://legalberries-drafts.ai.studio',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.run.app') || origin.endsWith('.github.io'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Public Razorpay Key & Config endpoint (never exposes key_secret)
app.get('/api/razorpay-config', (_req, res) => {
  res.json({
    keyId: RAZORPAY_KEY_ID,
    merchantName: 'Legal Berries',
    currency: 'INR'
  });
});

// Server-side courses cache for authorized modifications
let serverCourses: any[] | null = null;

// Server-side live state for WebSockets
interface LiveEnrollmentEvent {
  id: string;
  fullName: string;
  courseTitle: string;
  courseId: string;
  amountPaid: number;
  timestamp: string;
}

interface LiveChatMessage {
  id: string;
  senderName: string;
  senderRole: 'Advocate' | 'Law Student' | 'Faculty' | 'Admin';
  text: string;
  courseTitle?: string;
  timestamp: string;
}

const recentEnrollments: LiveEnrollmentEvent[] = [
  {
    id: 'ENR-LIVE-01',
    fullName: 'Adv. Rajesh Kumar',
    courseTitle: '7 Days Family Court: Cases & Drafts Masterclass',
    courseId: 'family-court-7-days',
    amountPaid: 200,
    timestamp: 'Yesterday at 4:30 PM'
  },
  {
    id: 'ENR-LIVE-02',
    fullName: 'Adv. Arnish Singh',
    courseTitle: 'All Legal Drafts: Every Type Master Vault',
    courseId: 'all-legal-drafts-vault',
    amountPaid: 799,
    timestamp: '2 days ago'
  }
];

const recentDiscussions: LiveChatMessage[] = [
  {
    id: 'MSG-01',
    senderName: 'Adv. Rajesh Kumar',
    senderRole: 'Advocate',
    text: 'The Section 125 CrPC maintenance petition structure with interim application grounds saved hours of research.',
    courseTitle: '7 Days Family Court: Cases & Drafts Masterclass',
    timestamp: 'Yesterday at 5:10 PM'
  },
  {
    id: 'MSG-02',
    senderName: 'Adv. Arnish Singh',
    senderRole: 'Advocate',
    text: 'Commercial contract indemnity and dispute escalation clauses in the Master Vault are meticulously vetted for Indian jurisdiction.',
    courseTitle: 'All Legal Drafts: Every Type Master Vault',
    timestamp: 'Yesterday at 6:45 PM'
  },
  {
    id: 'MSG-03',
    senderName: 'Legal Berries Academic Cell',
    senderRole: 'Faculty',
    text: 'Welcome advocates! Real-time sync is now open for live batch updates and peer drafting discussions.',
    courseTitle: 'Cohort Announcement',
    timestamp: 'Just now'
  }
];

// Setup WebSocket Server attached to HTTP server on path '/ws'
const wss = new WebSocketServer({ server, path: '/ws' });

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  clientId?: string;
}

// Broadcast helper function (with optional sender exclusion)
export const broadcast = (data: any, excludeWs?: WebSocket) => {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      try {
        client.send(payload);
      } catch (err) {
        console.error('WebSocket send error:', err);
      }
    }
  });
};

// WebSocket connection lifecycle - Strictly restricted to Developer / Admin Only
wss.on('connection', (ws: ExtendedWebSocket, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const queryToken = url.searchParams.get('adminKey') || url.searchParams.get('token') || url.searchParams.get('key');
  const role = url.searchParams.get('role');

  const authHeader = req.headers['authorization'];
  let headerToken = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    headerToken = authHeader.substring(7).trim();
  }

  const token = (queryToken || headerToken || '').trim();

  // Validate admin authority:
  // In development, allow developer role or matching admin token.
  // In production, strictly require matching ADMIN_ACCESS_KEY.
  const isDev = process.env.NODE_ENV !== 'production';
  const isAuthorized = ADMIN_ACCESS_KEY
    ? (token === ADMIN_ACCESS_KEY || (isDev && role === 'admin'))
    : (isDev && (role === 'admin' || Boolean(token)));

  if (!isAuthorized) {
    console.log(`[WebSocket] Blocked non-admin connection from ${req.socket.remoteAddress}. WebSocket is strictly for Developer only.`);
    try {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Forbidden: WebSocket connection is restricted strictly to Developer/Admin.'
      }));
      ws.close(1008, 'Admin authentication required');
    } catch {
      // ignore
    }
    return;
  }

  const clientId = `dev_${crypto.randomBytes(4).toString('hex')}`;
  ws.clientId = clientId;
  ws.isAlive = true;

  console.log(`[WebSocket] Developer connected: ${clientId} from ${req.socket.remoteAddress}`);

  // 1. Send initial state payload to developer
  const initPayload = {
    type: 'init',
    clientId,
    role: 'developer',
    onlineCount: wss.clients.size,
    courses: serverCourses,
    recentEnrollments: recentEnrollments.slice(0, 15),
    recentDiscussions: recentDiscussions.slice(-30),
    serverTime: new Date().toISOString()
  };
  ws.send(JSON.stringify(initPayload));

  // 2. Broadcast presence update to active developer clients
  broadcast({
    type: 'presence:update',
    onlineCount: wss.clients.size,
    timestamp: new Date().toISOString()
  });

  // 3. Keep-alive heartbeat response
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // 4. Handle incoming messages from client
  ws.on('message', (messageBuffer) => {
    try {
      const messageStr = messageBuffer.toString();
      const parsed = JSON.parse(messageStr);

      switch (parsed.type) {
        case 'ping': {
          ws.send(JSON.stringify({
            type: 'pong',
            clientTime: parsed.clientTime || Date.now(),
            serverTime: Date.now()
          }));
          break;
        }

        case 'chat:send': {
          const rawText = String(parsed.text || '').trim();
          if (!rawText) return;

          const newMsg: LiveChatMessage = {
            id: `MSG-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
            senderName: String(parsed.senderName || 'Advocate').slice(0, 50),
            senderRole: (['Advocate', 'Law Student', 'Faculty', 'Admin'].includes(parsed.senderRole)
              ? parsed.senderRole
              : 'Advocate') as any,
            text: rawText.slice(0, 500),
            courseTitle: parsed.courseTitle ? String(parsed.courseTitle).slice(0, 80) : undefined,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          recentDiscussions.push(newMsg);
          if (recentDiscussions.length > 60) {
            recentDiscussions.shift();
          }

          // Broadcast to all clients
          broadcast({
            type: 'chat:message',
            message: newMsg
          });
          break;
        }

        case 'enrollment:broadcast': {
          // Client announces local enrollment completion
          const enroll = parsed.enrollment;
          if (enroll && enroll.fullName) {
            const liveEnroll: LiveEnrollmentEvent = {
              id: enroll.id || `ENR-${Date.now()}`,
              fullName: String(enroll.fullName).slice(0, 50),
              courseTitle: String(enroll.courseTitle || 'Legal Berries Cohort').slice(0, 80),
              courseId: String(enroll.courseId || ''),
              amountPaid: Number(enroll.amountPaid) || 200,
              timestamp: 'Just now'
            };

            // Idempotent check
            const alreadyExists = recentEnrollments.some(e => e.id === liveEnroll.id);
            if (!alreadyExists) {
              recentEnrollments.unshift(liveEnroll);
              if (recentEnrollments.length > 20) {
                recentEnrollments.pop();
              }
              broadcast({
                type: 'enrollment:broadcast',
                enrollment: liveEnroll
              });
            }
          }
          break;
        }

        default:
          console.log(`[WebSocket] Unhandled message type: ${parsed.type}`);
      }
    } catch (err) {
      console.error('[WebSocket] Failed to parse message:', err);
    }
  });

  // 5. Handle disconnection
  ws.on('close', () => {
    console.log(`[WebSocket] Client disconnected: ${ws.clientId}`);
    broadcast({
      type: 'presence:update',
      onlineCount: wss.clients.size,
      timestamp: new Date().toISOString()
    });
  });

  ws.on('error', (err) => {
    console.error(`[WebSocket] Error on ${ws.clientId}:`, err);
  });
});

// Periodic heartbeat interval to drop dead sockets
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((client) => {
    const extWs = client as ExtendedWebSocket;
    if (extWs.isAlive === false) {
      console.log(`[WebSocket] Terminating inactive socket: ${extWs.clientId}`);
      return extWs.terminate();
    }
    extWs.isAlive = false;
    extWs.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

// WebSocket REST health & stats endpoint
app.get('/api/ws/status', (_req, res) => {
  res.json({
    status: 'open',
    path: '/ws',
    onlineClients: wss.clients.size,
    uptimeSeconds: Math.floor(process.uptime()),
    recentDiscussionsCount: recentDiscussions.length,
    recentEnrollmentsCount: recentEnrollments.length
  });
});

// Admin verification helper
const verifyAdminAuth = (req: express.Request): boolean => {
  if (!ADMIN_ACCESS_KEY) return false;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_ACCESS_KEY) return true;
  }
  const bodyKey = req.body?.adminKey;
  if (bodyKey && String(bodyKey).trim() === ADMIN_ACCESS_KEY) return true;
  const queryKey = req.query?.adminKey;
  if (queryKey && String(queryKey).trim() === ADMIN_ACCESS_KEY) return true;
  return false;
};

// Admin authentication verification endpoint
app.post('/api/admin/verify', (req, res) => {
  const { adminKey } = req.body || {};
  if (!ADMIN_ACCESS_KEY) {
    return res.status(500).json({
      success: false,
      error: 'ADMIN_ACCESS_KEY is not configured in server environment'
    });
  }
  if (adminKey && String(adminKey).trim() === ADMIN_ACCESS_KEY) {
    return res.json({
      success: true,
      authorized: true,
      message: 'Admin environment access verified'
    });
  }
  return res.status(403).json({
    success: false,
    authorized: false,
    error: 'Invalid admin credentials. Access denied.'
  });
});

// Admin status check (returns environment status without leaking secret)
app.get('/api/admin/status', (_req, res) => {
  res.json({
    hasAdminKeyConfigured: !!ADMIN_ACCESS_KEY,
    isDevEnvironment: process.env.NODE_ENV !== 'production'
  });
});

// Public GET courses endpoint
app.get('/api/courses', (_req, res) => {
  res.json({
    courses: serverCourses,
    hasServerOverrides: serverCourses !== null
  });
});

// Protected POST courses endpoint - only authorized environment admins can modify courses
app.post('/api/admin/courses', (req, res) => {
  if (!verifyAdminAuth(req)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: You do not have authority to modify courses or pricing. Admin environment key required.'
    });
  }

  const { courses } = req.body;
  if (!Array.isArray(courses)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid courses format. Must be an array.'
    });
  }

  serverCourses = courses;

  // Broadcast course update to all active WebSocket clients in real-time
  broadcast({
    type: 'courses:updated',
    courses: serverCourses,
    updatedBy: 'Administrator',
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: 'Course catalog updated and locked by environment administrator.',
    coursesCount: serverCourses.length
  });
});

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order (and alias /api/create-razorpay-order)
 */
const handleCreateOrder = async (req: express.Request, res: express.Response) => {
  try {
    if (!razorpay || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(401).json({
        error: 'Razorpay API credentials not configured in environment (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).'
      });
    }

    const { amount, currency = 'INR', receipt, notes, courseId, courseTitle, studentName, studentEmail, studentMobile } = req.body;

    const numAmount = Number(amount);
    // Validate minimum 100 paise (1 INR)
    if (isNaN(numAmount) || numAmount < 100) {
      return res.status(400).json({
        error: 'Invalid amount. Minimum amount must be at least 100 paise (₹1.00).'
      });
    }

    const orderOptions = {
      amount: Math.round(numAmount), // Amount in paise
      currency: currency || 'INR',
      receipt: receipt || `lb_rcpt_${Date.now()}`,
      notes: {
        ...(notes || {}),
        courseId: courseId || 'legal-berries-course',
        courseTitle: courseTitle ? String(courseTitle).slice(0, 30) : 'Legal Berries Course',
        studentName: studentName || 'Student',
        studentEmail: studentEmail || '',
        studentMobile: studentMobile || ''
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    return res.json({
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      success: true
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);

    if (error?.statusCode === 401 || (error?.error?.code === 'BAD_REQUEST_ERROR' && String(error?.message).toLowerCase().includes('auth'))) {
      return res.status(401).json({
        error: 'Razorpay authentication failed. Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      });
    }

    return res.status(500).json({
      error: 'Failed to create Razorpay order',
      details: error?.error?.description || error?.message || String(error)
    });
  }
};

app.post('/api/create-order', handleCreateOrder);
app.post('/api/create-razorpay-order', handleCreateOrder);

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment (and alias /api/verify-razorpay-payment)
 */
const handleVerifyPayment = (req: express.Request, res: express.Response) => {
  try {
    const order_id = req.body.razorpay_order_id || req.body.order_id;
    const payment_id = req.body.razorpay_payment_id || req.body.payment_id;
    const razorpay_signature = req.body.razorpay_signature || req.body.signature;

    if (!order_id || !payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields (order_id, payment_id, razorpay_signature)'
      });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Razorpay secret key is not configured on server'
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(`${order_id}|${payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isMatch = generatedSignature === razorpay_signature;

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Signature verification failed. Potential tampering detected.'
      });
    }

    // Broadcast live enrollment event via WebSocket
    if (req.body.studentName || req.body.courseTitle) {
      const liveEnroll: LiveEnrollmentEvent = {
        id: `ENR-${payment_id.slice(-6)}`,
        fullName: req.body.studentName || 'Advocate',
        courseTitle: req.body.courseTitle || 'Masterclass Cohort',
        courseId: req.body.courseId || '',
        amountPaid: Number(req.body.amount) || 200,
        timestamp: 'Just now'
      };

      recentEnrollments.unshift(liveEnroll);
      if (recentEnrollments.length > 20) recentEnrollments.pop();

      broadcast({
        type: 'enrollment:broadcast',
        enrollment: liveEnroll
      });
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      order_id,
      payment_id,
      transactionId: payment_id
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal error verifying payment signature',
      details: error.message || String(error)
    });
  }
};

app.post('/api/verify-payment', handleVerifyPayment);
app.post('/api/verify-razorpay-payment', handleVerifyPayment);

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Legal Berries server + WebSocket running on http://0.0.0.0:${PORT} (WS path: /ws)`);
    console.log(`Razorpay Key ID active: ${RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.slice(0, 10) + '...' : 'NOT_SET'}`);
  });
}

startServer();
