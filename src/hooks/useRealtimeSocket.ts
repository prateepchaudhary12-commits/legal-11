import { useEffect, useRef, useState, useCallback } from 'react';
import { Course, LiveChatMessage, LiveEnrollmentEvent, WebSocketStatus } from '../types';

interface RealtimeSocketOptions {
  enabled?: boolean;
  adminKey?: string;
  onCoursesUpdated?: (courses: Course[]) => void;
  onNewEnrollment?: (enrollment: LiveEnrollmentEvent) => void;
}

export function useRealtimeSocket(options: RealtimeSocketOptions = {}) {
  const { enabled = false, adminKey = '' } = options;

  const [status, setStatus] = useState<WebSocketStatus>({
    connected: false,
    connecting: false,
    onlineCount: 0,
    latencyMs: null,
    lastPingTime: null,
    error: null,
  });

  const [liveEnrollments, setLiveEnrollments] = useState<LiveEnrollmentEvent[]>([]);
  const [discussions, setDiscussions] = useState<LiveChatMessage[]>([]);
  const [clientId, setClientId] = useState<string>('');

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimestampRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Stable references for options callbacks
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      try {
        socketRef.current.close(1000, 'Developer session closed');
      } catch {
        // ignore
      }
      socketRef.current = null;
    }
    setStatus({
      connected: false,
      connecting: false,
      onlineCount: 0,
      latencyMs: null,
      lastPingTime: null,
      error: null,
    });
  }, []);

  const connect = useCallback(() => {
    // Strictly Developer/Admin only: do not connect if not enabled
    if (!optionsRef.current.enabled || typeof window === 'undefined') {
      return;
    }

    // Determine WS protocol & endpoint
    const isHttps = window.location.protocol === 'https:';
    const wsProtocol = isHttps ? 'wss:' : 'ws:';
    const host = window.location.host;

    // Attach admin credentials in query params for authentication
    const params = new URLSearchParams();
    params.set('role', 'admin');
    const token = optionsRef.current.adminKey || sessionStorage.getItem('legalberries_admin_token') || '';
    if (token) {
      params.set('adminKey', token);
    }

    const wsUrl = `${wsProtocol}//${host}/ws?${params.toString()}`;

    setStatus((prev) => ({ ...prev, connecting: true, error: null }));

    try {
      if (socketRef.current) {
        socketRef.current.close();
      }

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) return;
        setStatus((prev) => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
        }));

        // Measure initial ping latency
        pingTimestampRef.current = Date.now();
        ws.send(JSON.stringify({ type: 'ping', clientTime: pingTimestampRef.current }));
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'init': {
              if (data.clientId) setClientId(data.clientId);
              if (typeof data.onlineCount === 'number') {
                setStatus((prev) => ({ ...prev, onlineCount: Math.max(1, data.onlineCount) }));
              }
              if (Array.isArray(data.recentEnrollments)) {
                setLiveEnrollments(data.recentEnrollments);
              }
              if (Array.isArray(data.recentDiscussions)) {
                setDiscussions(data.recentDiscussions);
              }
              if (Array.isArray(data.courses) && data.courses.length > 0 && optionsRef.current.onCoursesUpdated) {
                optionsRef.current.onCoursesUpdated(data.courses);
              }
              break;
            }

            case 'presence:update': {
              if (typeof data.onlineCount === 'number') {
                setStatus((prev) => ({ ...prev, onlineCount: Math.max(1, data.onlineCount) }));
              }
              break;
            }

            case 'pong': {
              if (pingTimestampRef.current) {
                const latency = Date.now() - pingTimestampRef.current;
                setStatus((prev) => ({
                  ...prev,
                  latencyMs: latency,
                  lastPingTime: Date.now(),
                }));
                pingTimestampRef.current = null;
              }
              break;
            }

            case 'chat:message': {
              const msg: LiveChatMessage = data.message;
              if (msg && msg.id) {
                setDiscussions((prev) => {
                  if (prev.some((m) => m.id === msg.id)) return prev;
                  return [...prev, msg].slice(-60);
                });
              }
              break;
            }

            case 'enrollment:broadcast': {
              const enrollment: LiveEnrollmentEvent = data.enrollment;
              if (enrollment && enrollment.id) {
                setLiveEnrollments((prev) => {
                  if (prev.some((e) => e.id === enrollment.id)) return prev;
                  return [enrollment, ...prev].slice(0, 25);
                });
                if (optionsRef.current.onNewEnrollment) {
                  optionsRef.current.onNewEnrollment(enrollment);
                }
              }
              break;
            }

            case 'courses:updated': {
              if (Array.isArray(data.courses) && optionsRef.current.onCoursesUpdated) {
                optionsRef.current.onCoursesUpdated(data.courses);
              }
              break;
            }

            case 'error': {
              setStatus((prev) => ({
                ...prev,
                error: data.message || 'Access Denied',
                connected: false,
                connecting: false,
              }));
              break;
            }

            default:
              break;
          }
        } catch (err) {
          console.error('[WebSocket] Failed to parse message', err);
        }
      };

      ws.onerror = () => {
        if (!isMountedRef.current) return;
        setStatus((prev) => ({
          ...prev,
          error: 'Connection interrupted. Developer reconnect scheduled.',
          connecting: false,
        }));
      };

      ws.onclose = (e) => {
        if (!isMountedRef.current) return;
        const wasForbidden = e.code === 1008;

        setStatus((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
          error: wasForbidden ? 'Access Denied: Admin authorization required' : prev.error,
        }));

        // Only auto-reconnect if enabled and not intentionally rejected for bad auth
        if (optionsRef.current.enabled && !wasForbidden) {
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current && optionsRef.current.enabled) {
              connect();
            }
          }, 4000);
        }
      };
    } catch (err: any) {
      setStatus((prev) => ({
        ...prev,
        connected: false,
        connecting: false,
        error: err.message || 'WebSocket initialization failed',
      }));
    }
  }, []);

  // Effect: Connect only when enabled (admin authorized); disconnect if disabled
  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      connect();
      // Periodic ping every 25 seconds for developer console
      const interval = setInterval(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          pingTimestampRef.current = Date.now();
          socketRef.current.send(JSON.stringify({ type: 'ping', clientTime: pingTimestampRef.current }));
        }
      }, 25000);

      return () => {
        clearInterval(interval);
        disconnect();
      };
    } else {
      disconnect();
    }

    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [enabled, adminKey, connect, disconnect]);

  // Send a chat/announcement message over the WebSocket
  const sendChatMessage = useCallback((
    text: string,
    senderName: string = 'Legal Berries Administrator',
    senderRole: 'Advocate' | 'Law Student' | 'Faculty' | 'Admin' = 'Admin',
    courseTitle?: string
  ) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send message: socket not open');
      return false;
    }

    socketRef.current.send(JSON.stringify({
      type: 'chat:send',
      text,
      senderName,
      senderRole,
      courseTitle,
    }));
    return true;
  }, []);

  // Broadcast an enrollment locally & to server
  const broadcastEnrollment = useCallback((enrollment: Partial<LiveEnrollmentEvent>) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    socketRef.current.send(JSON.stringify({
      type: 'enrollment:broadcast',
      enrollment: {
        id: enrollment.id || `ENR-${Date.now()}`,
        fullName: enrollment.fullName || 'Advocate',
        courseTitle: enrollment.courseTitle || 'Legal Berries Cohort',
        courseId: enrollment.courseId || '',
        amountPaid: enrollment.amountPaid || 200,
      }
    }));
  }, []);

  // Manual ping trigger
  const sendPing = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      pingTimestampRef.current = Date.now();
      socketRef.current.send(JSON.stringify({ type: 'ping', clientTime: pingTimestampRef.current }));
    }
  }, []);

  return {
    status,
    clientId,
    liveEnrollments,
    discussions,
    sendChatMessage,
    broadcastEnrollment,
    sendPing,
    reconnect: connect,
    disconnect,
  };
}
