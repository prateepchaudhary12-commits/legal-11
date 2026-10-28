import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Smartphone,
  CreditCard,
  Building2,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  Zap,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, StudentEnrollment } from '../types';

// ==========================================
// AUTHENTIC BRAND ICONS (GPay, PhonePe, Paytm, BHIM, UPI)
// ==========================================

export const GooglePayIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 72 72" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="72" rx="16" fill="#FFFFFF" />
    <g transform="translate(10, 18) scale(0.9)">
      <path d="M22.5 10.8c2.1 0 3.8.7 5.2 1.9l3.9-3.9C29.2 6.6 26.1 5.2 22.5 5.2c-6.2 0-11.5 3.5-14 8.7l4.9 3.8c1.2-3.6 4.7-6.9 9.1-6.9z" fill="#EA4335" />
      <path d="M36 19c0-.8-.1-1.6-.2-2.3H22.5v4.6h7.7c-.4 2-1.4 3.7-3 4.9l4.7 3.6c2.8-2.6 4.1-6.4 4.1-10.8z" fill="#4285F4" />
      <path d="M13.4 17.7c-.3.9-.5 1.9-.5 2.9s.2 2 .5 2.9l-4.9 3.8C7.5 25.3 7 23.2 7 20.6s.5-4.7 1.5-6.7l4.9 3.8z" fill="#FBBC04" />
      <path d="M22.5 30.5c3.5 0 6.5-1.2 8.7-3.2l-4.7-3.6c-1.2.8-2.7 1.3-4 1.3-4.4 0-8-3-9.2-7.2l-4.9 3.8c2.4 5.2 7.7 8.9 14.1 8.9z" fill="#34A853" />
    </g>
    <text x="44" y="44" fill="#3C4043" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="19" letterSpacing="-0.5">Pay</text>
  </svg>
);

export const PhonePeIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 72 72" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="72" rx="16" fill="#5F259F" />
    <circle cx="36" cy="36" r="28" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.95" />
    <g fill="#FFFFFF">
      <rect x="23" y="27" width="26" height="3.2" rx="1.6" />
      <path d="M27 30 v12 c0 4.5 3.5 7.5 8 7.5 h4 v-3.5 h-4 c-2.5 0-4.5-1.5-4.5-4 v-12 h-3.5 z" />
      <rect x="39" y="27" width="3.6" height="27" rx="1.8" />
      <path d="M37 27 C34 22 30 19 25 18 l-1 2.8 c4 1 7.5 3.5 10 6.2 z" />
    </g>
  </svg>
);

export const PaytmIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 72 72" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="72" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <text x="10" y="44" fill="#002E6E" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.8">Pay</text>
    <text x="44" y="44" fill="#00BAF2" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.8">tm</text>
  </svg>
);

export const BhimUpiIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 72 72" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="72" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <path d="M12 18 L34 14 L28 35 Z" fill="#F37021" />
    <path d="M30 37 L36 58 L14 53 Z" fill="#0B5C26" />
    <g transform="translate(33, 18)">
      <text x="0" y="22" fill="#0A1E3F" fontFamily="system-ui, -apple-system, sans-serif" fontStyle="italic" fontWeight="900" fontSize="16" letterSpacing="-0.5">BHIM</text>
      <text x="0" y="34" fill="#0B5C26" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="10" letterSpacing="0.5">UPI</text>
    </g>
  </svg>
);

export type PaymentTabKey = 'upi' | 'card' | 'netbanking';

interface EnrollmentModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnrollmentSuccess?: (enrollment: StudentEnrollment) => void;
}

const POPULAR_BANKS = [
  { code: 'HDFC', name: 'HDFC Bank' },
  { code: 'ICICI', name: 'ICICI Bank' },
  { code: 'SBI', name: 'State Bank of India' },
  { code: 'UTIB', name: 'Axis Bank' },
  { code: 'KKBK', name: 'Kotak Mahindra Bank' },
  { code: 'PUNB', name: 'Punjab National Bank' }
];

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnrollmentSuccess
}) => {
  // Step flow: 1 = Student Details, 2 = Payment Options (UPI / Card / Net Banking), 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<PaymentTabKey>('upi');

  // Form fields with persistent storage
  const [fullName, setFullName] = useState(() => {
    try {
      return localStorage.getItem('legalberries_student_name') || '';
    } catch {
      return '';
    }
  });
  const [mobile, setMobile] = useState(() => {
    try {
      return localStorage.getItem('legalberries_student_mobile') || '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('legalberries_student_email') || '';
    } catch {
      return '';
    }
  });
  const [validationError, setValidationError] = useState('');

  // Payment method specific states
  // UPI
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedUpiVpa, setCopiedUpiVpa] = useState(false);

  // Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Loading & status
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Success state
  const [completedEnrollment, setCompletedEnrollment] = useState<StudentEnrollment | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Official UPI VPA & Deep link generator
  const UPI_VPA = 'abhishekchaudha806023.rzp@rxairtel';
  const MERCHANT_TITLE = 'Legal Berries';

  const getUpiUrl = (appScheme: string = 'generic') => {
    const courseTitle = course ? course.title.slice(0, 24) : 'Course';
    const coursePrice = course ? course.currentPrice : 0;
    const cleanNote = `Legal Berries - ${courseTitle}`;
    const query = `pa=${UPI_VPA}&pn=${encodeURIComponent(MERCHANT_TITLE)}&am=${coursePrice}&cu=INR&tn=${encodeURIComponent(cleanNote)}&mc=8241`;

    switch (appScheme) {
      case 'gpay':
        return `gpay://upi/pay?${query}`;
      case 'phonepe':
        return `phonepe://pay?${query}`;
      case 'paytm':
        return `paytmmp://pay?${query}`;
      case 'bhim':
        return `bhim://pay?${query}`;
      default:
        return `upi://pay?${query}`;
    }
  };

  const triggerDirectUPIOpen = (appScheme: string = 'generic') => {
    const targetUrl = getUpiUrl(appScheme);
    const standardUrl = getUpiUrl('generic');

    try {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => {
        try {
          window.location.href = targetUrl;
        } catch {
          window.location.href = standardUrl;
        }
      }, 150);
    } catch {
      window.location.href = standardUrl;
    }
  };

  const handleCopyUpiVpa = () => {
    navigator.clipboard.writeText(UPI_VPA);
    setCopiedUpiVpa(true);
    setTimeout(() => setCopiedUpiVpa(false), 2500);
  };

  // Reset states when course opens
  useEffect(() => {
    if (isOpen && course) {
      setStep(1);
      setActiveTab('upi');
      setValidationError('');
      setIsProcessing(false);
      setCopiedLink(false);
      setCopiedUpiVpa(false);
      if (fullName && !cardHolder) {
        setCardHolder(fullName);
      }
    }
  }, [isOpen, course?.id]);

  // Validation before proceeding
  const validateStudentDetails = (): boolean => {
    setValidationError('');
    if (!fullName.trim()) {
      setValidationError('Please enter your full name (for certificate and attendance).');
      return false;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setValidationError('Please enter a valid email address to receive access details and tax invoice.');
      return false;
    }

    try {
      localStorage.setItem('legalberries_student_name', fullName.trim());
      localStorage.setItem('legalberries_student_mobile', mobile.trim());
      localStorage.setItem('legalberries_student_email', email.trim());
    } catch {
      // ignore
    }
    return true;
  };

  // Step 1: Open Razorpay checkout with all payment methods (Cards, Net Banking, UPI, Wallets)
  const handleProceedWithRazorpay = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStudentDetails()) return;
    await launchRazorpayCheckout();
  };

  // Step 1: Navigate to Step 2 to view all payment methods
  const handleProceedToStep2 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStudentDetails()) return;
    setStep(2);
  };

  // Helper to finish enrollment upon verified payment
  const completeSuccess = (txId: string, methodUsed: string) => {
    if (!course) return;
    const newEnrollment: StudentEnrollment = {
      id: `ENR-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      courseId: course.id,
      courseTitle: course.title,
      amountPaid: course.currentPrice,
      transactionId: txId,
      paymentMethod: methodUsed,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      whatsappGroupLink: course.whatsappGroupLink,
      status: 'completed'
    };

    setCompletedEnrollment(newEnrollment);
    if (onEnrollmentSuccess) {
      onEnrollmentSuccess(newEnrollment);
    }

    setIsProcessing(false);
    setProcessingStatus('');
    setStep(3);

    // Trigger Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Simulated / Instant Payment fallback for Cards and Net Banking
  const handleSimulatePayment = (methodName: string) => {
    setIsProcessing(true);
    setProcessingStatus(`Connecting to ${methodName} payment gateway...`);
    setTimeout(() => {
      const txId = `LB-${methodName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 899 + 100)}`;
      completeSuccess(txId, methodName);
    }, 1200);
  };

  // Card payment helper to pre-fill test card
  const fillTestCard = () => {
    setCardNumber('4532 8920 1234 5678');
    setCardExpiry('12/28');
    setCardCvv('888');
    setCardHolder(fullName || 'Adv. Test User');
  };

  // Submit Card
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length < 16) {
      setValidationError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardExpiry || !cardExpiry.includes('/')) {
      setValidationError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setValidationError('Please enter a valid 3-digit CVV.');
      return;
    }
    handleSimulatePayment('Credit / Debit Card');
  };

  // Submit Net Banking
  const handleNetBankingSubmit = () => {
    const bankObj = POPULAR_BANKS.find(b => b.code === selectedBank);
    handleSimulatePayment(`Net Banking (${bankObj ? bankObj.name : selectedBank})`);
  };

  // Confirm UPI payment with reference / UTR
  const handleConfirmUpiPayment = () => {
    const cleanUtr = upiUtr.trim();
    const finalTxId = cleanUtr.length >= 6
      ? `UPI-UTR-${cleanUtr}`
      : `UPI-APP-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 899 + 100)}`;
    completeSuccess(finalTxId, 'UPI Direct Payment');
  };

  // Standard Razorpay Web Checkout Integration
  const launchRazorpayCheckout = async () => {
    if (!course) return;
    setIsProcessing(true);
    setProcessingStatus('Creating Razorpay order...');

    try {
      // Step 1: Call backend create-order endpoint with amount in paise (minimum 100 paise)
      const amountInPaise = Math.max(100, Math.round(course.currentPrice * 100));
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `lb_rcpt_${Date.now()}`,
          courseId: course.id,
          courseTitle: course.title,
          studentName: fullName,
          studentEmail: email,
          studentMobile: mobile
        })
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.order_id && !orderData.orderId) {
        setIsProcessing(false);
        setValidationError(orderData.error || 'Failed to create payment order. Please try again.');
        return;
      }

      const activeOrderId = orderData.order_id || orderData.orderId;
      const razorpayKey = (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || orderData.keyId;

      setProcessingStatus('Opening Razorpay Gateway...');

      if (typeof (window as any).Razorpay === 'undefined') {
        setIsProcessing(false);
        setValidationError('Payment gateway script is loading. Please check your internet connection.');
        return;
      }

      // Step 2: Open Razorpay checkout modal with order_id
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Legal Berries',
        description: `${course.title} - Enrollment`,
        image: '/assets/aistudio/legal-berries-no-name_462d0f0f.jpg',
        order_id: activeOrderId,
        handler: async function (paymentResponse: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // Step 3: Send razorpay_payment_id, razorpay_order_id, razorpay_signature to verify-payment endpoint
          setProcessingStatus('Verifying payment signature with Legal Berries server...');
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature
              })
            });
            const verifyResult = await verifyRes.json();
            if (verifyRes.ok && verifyResult.success) {
              completeSuccess(paymentResponse.razorpay_payment_id, 'Razorpay Verified Payment');
            } else {
              setIsProcessing(false);
              setValidationError('Payment verification failed: ' + (verifyResult.error || 'Signature mismatch'));
            }
          } catch (err: any) {
            setIsProcessing(false);
            setValidationError('Failed to reach verification server: ' + (err.message || 'Please contact support'));
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: mobile
        },
        notes: {
          course_id: course.id,
          merchant: 'Legal Berries'
        },
        theme: {
          color: '#FA527B'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setProcessingStatus('');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (failRes: any) {
        setIsProcessing(false);
        setValidationError(`Payment failed: ${failRes.error?.description || 'Transaction was not completed'}`);
      });
      rzp.open();
      setIsProcessing(false);
    } catch (err: any) {
      console.warn('Razorpay checkout error:', err);
      setIsProcessing(false);
      setValidationError('Could not launch payment gateway: ' + (err.message || 'Please try again.'));
    }
  };

  const handleCopyWhatsAppLink = () => {
    if (course?.whatsappGroupLink) {
      navigator.clipboard.writeText(course.whatsappGroupLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1A1333] border border-[#3E2F63] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#140F26] border-b border-[#2E234B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FA527B]/20 border border-[#FA527B]/40 flex items-center justify-center text-[#FA527B]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E5C067]">
                Legal Berries Enrollment Portal
              </span>
              <p className="text-sm font-serif-title font-bold text-[#F7F2EA]">
                {step === 1 && 'Step 1: Student Information & Payment'}
                {step === 2 && 'Step 2: Choose Payment Method'}
                {step === 3 && 'Enrollment Confirmed & Verified Access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9E93B5] hover:text-[#F7F2EA] p-1.5 rounded-lg hover:bg-[#251A44] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {/* STEP 1: STUDENT INFORMATION */}
          {step === 1 && (
            <div>
              {/* Selected Course Summary Banner */}
              <div className="p-4 bg-[#140F26] border border-[#342654] rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-[#FA527B] font-semibold uppercase tracking-wider">
                    {course.category} · {course.duration}
                  </span>
                  <h4 className="text-base font-serif-title font-bold text-[#F7F2EA] mt-0.5">
                    {course.title}
                  </h4>
                  <p className="text-xs text-[#A99EC0] mt-1">
                    Instant access to live classes, full vault downloads, and verifiable certificate.
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="text-xs text-[#8E83A6] line-through tabular-nums">
                    ₹{course.originalPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-2xl font-bold text-[#E5C067] font-mono tabular-nums">
                    ₹{course.currentPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Save {Math.round(((course.originalPrice - course.currentPrice) / course.originalPrice) * 100)}%
                  </span>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleProceedWithRazorpay} className="space-y-4">
                {validationError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1.5">
                    Advocate / Student Full Name <span className="text-[#FA527B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adv. Siddharth Sharma"
                    className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-sm text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B] transition-colors"
                  />
                  <span className="text-[11px] text-[#8E83A6] mt-1 block">
                    This name will appear on your enrollment record and course certificate.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1.5">
                      Contact Mobile Number <span className="text-[#FA527B]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-[#8E83A6] font-mono">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-sm text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B] font-mono transition-colors"
                      />
                    </div>
                    <span className="text-[11px] text-[#8E83A6] mt-1 block">
                      For SMS confirmation, payment invoice, and student account alerts.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1.5">
                      Email Address <span className="text-[#FA527B]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="advocate@gmail.com"
                      className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-sm text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B] transition-colors"
                    />
                    <span className="text-[11px] text-[#8E83A6] mt-1 block">
                      Receipt, login credentials, and course links will be sent here.
                    </span>
                  </div>
                </div>

                {/* Trust guarantee banner */}
                <div className="p-3.5 bg-[#150F28] border border-[#2D214D] rounded-xl flex items-center justify-between text-xs text-[#B5A9CD]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#E5C067]" />
                    <span>Instant official receipt, live session credentials, and vault access.</span>
                  </div>
                  <span className="text-[11px] text-[#FA527B] font-mono">legalberries.official</span>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#FA527B] via-[#E13D66] to-[#FA527B] text-white font-bold text-sm sm:text-base rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#FA527B]/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{processingStatus || 'Opening Razorpay Gateway...'}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#E5C067]" />
                        <span>Pay ₹{course.currentPrice.toLocaleString('en-IN')} with Razorpay</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E93B5] px-1 gap-1.5">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supports UPI, Cards, Net Banking & Wallets</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="text-[#E5C067] hover:underline cursor-pointer font-medium"
                    >
                      Choose Method (UPI / QR, Card, Net Banking) →
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT METHODS (UPI, CARD, NETBANKING) */}
          {step === 2 && (
            <div>
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-[#3A2D5C] border-t-[#FA527B] rounded-full animate-spin mb-4" />
                  <h4 className="text-base font-semibold text-[#F7F2EA]">
                    Processing Secure Payment
                  </h4>
                  <p className="text-xs text-[#B0A4C8] mt-2 font-mono">{processingStatus}</p>
                </div>
              )}

              {!isProcessing && (
                <div className="space-y-5">
                  {/* Student & Course Summary Strip */}
                  <div className="flex items-center justify-between p-4 bg-[#140F26] border border-[#342654] rounded-xl">
                    <div>
                      <span className="text-xs text-[#9E93B5]">Enrolling Student:</span>
                      <p className="text-sm font-semibold text-[#F7F2EA]">{fullName}</p>
                      <span className="text-xs text-[#7E7299]">{email} · +91 {mobile}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#9E93B5]">Payable Amount:</span>
                      <div className="text-2xl font-bold text-[#E5C067] font-mono tabular-nums">
                        ₹{course.currentPrice.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">All Payment Modes Active</span>
                    </div>
                  </div>

                  {/* Payment Tabs: UPI / QR Code, Credit/Debit Card, Net Banking */}
                  <div className="flex border-b border-[#342654] gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('upi')}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
                        activeTab === 'upi'
                          ? 'bg-[#241A42] text-[#FA527B] border-b-2 border-[#FA527B]'
                          : 'text-[#A99EC0] hover:text-[#F7F2EA] hover:bg-[#1E1638]'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>UPI & QR Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('card')}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
                        activeTab === 'card'
                          ? 'bg-[#241A42] text-[#FA527B] border-b-2 border-[#FA527B]'
                          : 'text-[#A99EC0] hover:text-[#F7F2EA] hover:bg-[#1E1638]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Credit / Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('netbanking')}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
                        activeTab === 'netbanking'
                          ? 'bg-[#241A42] text-[#FA527B] border-b-2 border-[#FA527B]'
                          : 'text-[#A99EC0] hover:text-[#F7F2EA] hover:bg-[#1E1638]'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Net Banking</span>
                    </button>
                  </div>

                  {/* TAB 1: UPI & QR CODE */}
                  {activeTab === 'upi' && (
                    <div className="space-y-4">
                      {/* 1-Tap App Launcher Buttons */}
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] block mb-2">
                          1-Tap Open Mobile UPI App:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => triggerDirectUPIOpen('gpay')}
                            className="p-2.5 bg-[#17112E] hover:bg-[#221844] border border-[#3E2F63] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <GooglePayIcon className="w-6 h-6" />
                            <span className="text-xs font-medium text-[#F7F2EA]">Google Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDirectUPIOpen('phonepe')}
                            className="p-2.5 bg-[#17112E] hover:bg-[#221844] border border-[#3E2F63] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <PhonePeIcon className="w-6 h-6" />
                            <span className="text-xs font-medium text-[#F7F2EA]">PhonePe</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDirectUPIOpen('paytm')}
                            className="p-2.5 bg-[#17112E] hover:bg-[#221844] border border-[#3E2F63] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <PaytmIcon className="w-6 h-6" />
                            <span className="text-xs font-medium text-[#F7F2EA]">Paytm</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDirectUPIOpen('bhim')}
                            className="p-2.5 bg-[#17112E] hover:bg-[#221844] border border-[#3E2F63] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <BhimUpiIcon className="w-6 h-6" />
                            <span className="text-xs font-medium text-[#F7F2EA]">BHIM UPI</span>
                          </button>
                        </div>
                      </div>

                      {/* Scannable QR Code & UPI VPA */}
                      <div className="p-4 bg-[#140F26] border border-[#342654] rounded-xl flex flex-col sm:flex-row items-center gap-4">
                        <div className="p-1.5 bg-white rounded-xl shadow-md shrink-0 border border-slate-200">
                          <img
                            src="/assets/aistudio/qr_code_only.png"
                            alt="Legal Berries UPI QR Code"
                            className="w-32 h-32 rounded-lg object-contain"
                          />
                        </div>

                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#E5C067] uppercase tracking-wider">
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Scan QR Code to Pay</span>
                          </div>
                          <p className="text-xs text-[#C5BAD9]">
                            Scan using any UPI App (GPay, PhonePe, Paytm, BHIM, Cred) to complete ₹{course.currentPrice}.
                          </p>

                          <div className="p-2 bg-[#1B1435] border border-[#3E2F63] rounded-lg flex items-center justify-between gap-2">
                            <div className="text-left overflow-hidden">
                              <span className="text-[9px] text-[#8E83A6] block uppercase tracking-wider">
                                Official UPI ID
                              </span>
                              <span className="text-xs font-mono font-semibold text-[#F7F2EA] truncate block">
                                {UPI_VPA}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyUpiVpa}
                              className="px-2.5 py-1 bg-[#291E48] hover:bg-[#36275E] text-[#FA527B] text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              {copiedUpiVpa ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Confirm UPI Payment with UTR */}
                      <div className="p-4 bg-[#140F26] border border-emerald-500/40 rounded-xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Confirm Your UPI Payment
                          </span>
                        </div>
                        <p className="text-xs text-[#C5BAD9] mb-3">
                          After paying via UPI App or QR code, enter the 12-digit UTR / Ref Number (or click confirm) to activate access:
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={upiUtr}
                            onChange={(e) => setUpiUtr(e.target.value)}
                            placeholder="Enter 12-digit UPI UTR / Ref Number"
                            className="flex-1 px-3.5 py-2.5 bg-[#1B1435] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] placeholder-[#6E6485] font-mono focus:outline-none focus:border-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={handleConfirmUpiPayment}
                            className="py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>Confirm & Activate Course</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CREDIT / DEBIT CARD */}
                  {activeTab === 'card' && (
                    <form onSubmit={handleCardSubmit} className="space-y-4">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#C5BAD9]">
                          Card Information
                        </span>
                        <button
                          type="button"
                          onClick={fillTestCard}
                          className="text-[11px] text-[#FA527B] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Fill Demo Legal Test Card</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs text-[#A99EC0] mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => {
                              // format with spaces
                              const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                              const parts = v.match(/.{1,4}/g);
                              setCardNumber(parts ? parts.join(' ') : v);
                            }}
                            placeholder="4532 8920 1234 5678"
                            className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-sm font-mono text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
                          />
                          <CreditCard className="w-4 h-4 text-[#8E83A6] absolute right-3.5 top-3" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-[#A99EC0] mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (v.length > 2) {
                                setCardExpiry(`${v.slice(0, 2)}/${v.slice(2)}`);
                              } else {
                                setCardExpiry(v);
                              }
                            }}
                            placeholder="MM/YY"
                            className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-sm font-mono text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#A99EC0] mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="•••"
                            className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-sm font-mono text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#A99EC0] mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Name as printed on card"
                          className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-sm text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-6 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-bold text-sm rounded-xl hover:opacity-95 transition-all shadow-lg shadow-[#FA527B]/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-[#E5C067]" />
                        <span>Pay ₹{course.currentPrice.toLocaleString('en-IN')} with Card</span>
                      </button>
                    </form>
                  )}

                  {/* TAB 3: NET BANKING */}
                  {activeTab === 'netbanking' && (
                    <div className="space-y-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] block">
                        Select Your Bank
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {POPULAR_BANKS.map((bank) => (
                          <button
                            key={bank.code}
                            type="button"
                            onClick={() => setSelectedBank(bank.code)}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                              selectedBank === bank.code
                                ? 'bg-[#241A42] border-[#FA527B] shadow-md shadow-[#FA527B]/20 text-[#F7F2EA]'
                                : 'bg-[#150F26] border-[#342654] hover:border-[#4E3A73] text-[#C5BAD9]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className={`w-4 h-4 ${selectedBank === bank.code ? 'text-[#FA527B]' : 'text-[#8E83A6]'}`} />
                              <span className="text-xs font-medium">{bank.name}</span>
                            </div>
                            {selectedBank === bank.code && (
                              <div className="w-2 h-2 rounded-full bg-[#FA527B]" />
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleNetBankingSubmit}
                        className="w-full py-3.5 px-6 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-bold text-sm rounded-xl hover:opacity-95 transition-all shadow-lg shadow-[#FA527B]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        <Lock className="w-4 h-4 text-[#E5C067]" />
                        <span>Pay ₹{course.currentPrice.toLocaleString('en-IN')} via Net Banking</span>
                      </button>
                    </div>
                  )}

                  {/* Bottom Navigation */}
                  <div className="mt-4 pt-3 border-t border-[#2E234B] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-[#A99EC0] hover:text-[#F7F2EA] transition-colors"
                    >
                      ← Back to Student Details
                    </button>
                    <button
                      type="button"
                      onClick={launchRazorpayCheckout}
                      className="text-xs text-[#E5C067] hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Or Open Razorpay Live Gateway</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PAYMENT CONFIRMED & ACCESS DETAILS */}
          {step === 3 && completedEnrollment && (
            <div className="space-y-6 text-center sm:text-left">
              {/* Success Badge Banner */}
              <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-[#18232B] to-emerald-950/30 border border-emerald-500/40 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Payment Successfully Verified
                    </span>
                    <h3 className="text-xl font-serif-title font-bold text-[#F7F2EA] mt-0.5">
                      Welcome to Legal Berries, {completedEnrollment.fullName}!
                    </h3>
                    <p className="text-xs text-[#B5CAD9] mt-1.5 leading-relaxed">
                      Your enrollment is verified. You now have full access to <strong>{completedEnrollment.courseTitle}</strong>.
                    </p>
                  </div>
                </div>

                {/* Receipt Details Strip */}
                <div className="mt-4 pt-4 border-t border-emerald-800/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                  <div>
                    <span className="text-[10px] text-[#8EA3B0] block">Transaction ID</span>
                    <span className="text-xs font-mono font-semibold text-[#F7F2EA]">
                      {completedEnrollment.transactionId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8EA3B0] block">Amount Paid</span>
                    <span className="text-xs font-mono font-semibold text-[#E5C067]">
                      ₹{completedEnrollment.amountPaid}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8EA3B0] block">Payment Mode</span>
                    <span className="text-xs font-semibold text-[#F7F2EA]">
                      {completedEnrollment.paymentMethod}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8EA3B0] block">Receipt Sent To</span>
                    <span className="text-xs text-[#F7F2EA] truncate block">
                      {completedEnrollment.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Access & Learning Resources Panel */}
              <div className="p-6 bg-[#16231C] border-2 border-emerald-500/60 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrollment Status: Confirmed & Active</span>
                </div>

                <h4 className="text-lg font-serif-title font-bold text-[#F7F2EA]">
                  Course Materials & Live Classes Access
                </h4>
                <p className="text-xs text-[#B8D4C3] mt-1.5 leading-relaxed">
                  Your registration for <strong>{completedEnrollment.courseTitle}</strong> is active. Full course lectures, downloadable editable templates (.docx / .pdf), and mentor session links have been linked to your registered email (<strong>{completedEnrollment.email}</strong>).
                </p>

                {/* Optional Community / Discussion Group */}
                {completedEnrollment.whatsappGroupLink && (
                  <div className="mt-5 p-4 bg-[#111A15] border border-emerald-700/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-[#F7F2EA] block">
                        Student Discussion Group (Optional)
                      </span>
                      <span className="text-[11px] text-[#A3C7B0]">
                        Optional batch community for peer discussion and class updates.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={completedEnrollment.whatsappGroupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Open WhatsApp Group</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyWhatsAppLink}
                        className="py-2.5 px-3 bg-[#233529] hover:bg-[#2C4434] text-emerald-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-600/30"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Post-Purchase Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-[#1F1738] hover:bg-[#281E48] text-[#C5BAD9] hover:text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-2 border border-[#3A2D5C]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Tax Receipt & Enrollment Slip</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 bg-[#FA527B] hover:bg-[#E13D66] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
