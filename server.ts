import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Razorpay strictly from environment variables (Never hardcode secrets in source files)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || '';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

app.use(express.json());

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
  return res.json({
    success: true,
    message: 'Course catalog updated and locked by environment administrator.',
    coursesCount: serverCourses.length
  });
});

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order (and alias /api/create-razorpay-order)
 * Calls Razorpay orders API, validates amount >= 100 paise, returns { order_id, amount, currency }
 */
const handleCreateOrder = async (req: express.Request, res: express.Response) => {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
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

    // Handle authentication failures with 401
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
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature.
 * Return success only if signatures match.
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
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Legal Berries server running on http://0.0.0.0:${PORT}`);
    console.log(`Razorpay Key ID active: ${RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.slice(0, 10) + '...' : 'NOT_SET'}`);
  });
}

startServer();
