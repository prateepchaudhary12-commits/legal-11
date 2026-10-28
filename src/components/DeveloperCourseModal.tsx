import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  Plus,
  Save,
  RotateCcw,
  Users,
  Settings,
  DollarSign,
  Link,
  BookOpen,
  Trash2,
  Download,
  Check,
  Globe,
  Copy,
  ExternalLink,
  ShieldCheck,
  Lock,
  Key,
  LogOut,
  AlertTriangle,
  Radio,
  Activity,
  Wifi,
  WifiOff,
  Zap,
  RefreshCw,
  Send,
  Terminal
} from 'lucide-react';
import { Course, StudentEnrollment, LiveChatMessage, LiveEnrollmentEvent, WebSocketStatus } from '../types';
import { INITIAL_COURSES } from '../data/courses';

interface DeveloperCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onUpdateCourses: (updated: Course[]) => void;
  enrollments: StudentEnrollment[];
  customDomain?: string;
  onUpdateCustomDomain?: (domain: string) => void;
  initialTab?: 'edit' | 'add' | 'enrollments' | 'domain' | 'websocket';
  isAdminAuthenticated: boolean;
  onAdminLogin: (key: string) => Promise<boolean>;
  onAdminLogout: () => void;
  wsStatus?: WebSocketStatus;
  wsClientId?: string;
  wsDiscussions?: LiveChatMessage[];
  liveEnrollments?: LiveEnrollmentEvent[];
  onWsSendMessage?: (text: string, senderName?: string, senderRole?: any, courseTitle?: string) => void;
  onWsSendPing?: () => void;
  onWsReconnect?: () => void;
}

export const DeveloperCourseModal: React.FC<DeveloperCourseModalProps> = ({
  isOpen,
  onClose,
  courses,
  onUpdateCourses,
  enrollments,
  customDomain = 'legalberries.in',
  onUpdateCustomDomain,
  initialTab = 'domain',
  isAdminAuthenticated,
  onAdminLogin,
  onAdminLogout,
  wsStatus,
  wsClientId,
  wsDiscussions = [],
  liveEnrollments = [],
  onWsSendMessage,
  onWsSendPing,
  onWsReconnect
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'add' | 'enrollments' | 'domain' | 'websocket'>(initialTab);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [domainInput, setDomainInput] = useState(customDomain);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  // Sync tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);


  // Authentication gate state
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Helper to sync course changes to the secure server backend
  const syncCoursesToServer = async (updated: Course[]) => {
    try {
      const token = sessionStorage.getItem('legalberries_admin_token') || (import.meta.env.VITE_ADMIN_ACCESS_KEY as string) || '';
      if (token) {
        await fetch('/api/admin/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ courses: updated })
        });
      }
    } catch (err) {
      console.error('Failed to sync courses to server:', err);
    }
  };

  const handleVerifyPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) {
      setAuthError('Please enter your environment Admin Access Key.');
      return;
    }
    setIsVerifying(true);
    setAuthError('');
    const success = await onAdminLogin(passkeyInput.trim());
    setIsVerifying(false);
    if (!success) {
      setAuthError('Invalid Admin Access Key. Only authorized administrators can modify courses.');
    } else {
      setPasskeyInput('');
    }
  };

  const handleQuickDevUnlock = async () => {
    const devKey = (import.meta.env.VITE_ADMIN_ACCESS_KEY as string) || '';
    if (devKey) {
      setIsVerifying(true);
      await onAdminLogin(devKey);
      setIsVerifying(false);
    }
  };

  React.useEffect(() => {
    setDomainInput(customDomain);
  }, [customDomain]);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(label);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = domainInput.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
    if (onUpdateCustomDomain) {
      onUpdateCustomDomain(cleaned);
    }
    setSaveSuccessMsg(`Custom domain saved as ${cleaned}! DNS mapping active.`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Course editing buffer
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const [editTitle, setEditTitle] = useState(selectedCourse?.title || '');
  const [editPrice, setEditPrice] = useState(selectedCourse?.currentPrice || 0);
  const [editOriginalPrice, setEditOriginalPrice] = useState(selectedCourse?.originalPrice || 0);
  const [editDuration, setEditDuration] = useState(selectedCourse?.duration || '');
  const [editWhatsapp, setEditWhatsapp] = useState(selectedCourse?.whatsappGroupLink || '');
  const [editDesc, setEditDesc] = useState(selectedCourse?.description || '');

  // Add course form
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(200);
  const [newOriginalPrice, setNewOriginalPrice] = useState(1999);
  const [newDuration, setNewDuration] = useState('7 Days Live Cohort');
  const [newCategory, setNewCategory] = useState<'Masterclass' | 'Vault' | 'Workshop'>('Masterclass');
  const [newWhatsapp, setNewWhatsapp] = useState('https://chat.whatsapp.com/LegalBerriesNewCohort');
  const [newDesc, setNewDesc] = useState('');

  // When changing course selector in edit tab
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const target = courses.find((c) => c.id === courseId);
    if (target) {
      setEditTitle(target.title);
      setEditPrice(target.currentPrice);
      setEditOriginalPrice(target.originalPrice);
      setEditDuration(target.duration);
      setEditWhatsapp(target.whatsappGroupLink);
      setEditDesc(target.description);
    }
  };

  const handleSaveCurrentCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = courses.map((c) => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          title: editTitle,
          currentPrice: Number(editPrice),
          originalPrice: Number(editOriginalPrice),
          duration: editDuration,
          whatsappGroupLink: editWhatsapp,
          description: editDesc
        };
      }
      return c;
    });

    onUpdateCourses(updated);
    syncCoursesToServer(updated);
    setSaveSuccessMsg('Course configuration saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleAddNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `custom-course-${Date.now()}`;
    const newCourseItem: Course = {
      id: newId,
      title: newTitle.trim(),
      tagline: 'Practical legal drafting & advocacy curriculum',
      category: newCategory,
      duration: newDuration,
      currentPrice: Number(newPrice),
      originalPrice: Number(newOriginalPrice),
      badge: 'New Curriculum',
      format: 'Live Google Meet + WhatsApp Cohort',
      description: newDesc.trim() || 'Comprehensive legal drafting curriculum.',
      highlights: [
        'Practical drafting format files (.docx)',
        'Live sessions with advocate mentorship',
        'Direct WhatsApp Cohort access'
      ],
      whatsappGroupLink: newWhatsapp.trim(),
      enrolledCount: 1,
      rating: 5.0,
      reviewsCount: 1,
      sampleDraftName: 'Standard Legal Pleading Template',
      sampleDraftCategory: 'Court Practice',
      sampleDraftSnippet: `// Sample legal draft deliverable for ${newTitle}`,
      syllabus: [
        {
          dayOrSection: 'Module 1: Procedural Foundation',
          topic: 'Statutory basis and pleading principles',
          draftDeliverables: ['Format draft template 1', 'Standard affidavit format']
        }
      ]
    };

    const updated = [...courses, newCourseItem];
    onUpdateCourses(updated);
    syncCoursesToServer(updated);
    setSelectedCourseId(newId);
    setActiveTab('edit');
    setSaveSuccessMsg(`Added "${newTitle}"!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);

    // Reset add form
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (courses.length <= 1) {
      alert('Cannot delete the last remaining course.');
      return;
    }
    const updated = courses.filter((c) => c.id !== courseId);
    onUpdateCourses(updated);
    syncCoursesToServer(updated);
    setSelectedCourseId(updated[0]?.id || '');
    setSaveSuccessMsg('Course removed from store.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all courses to Legal Berries factory defaults?')) {
      onUpdateCourses(INITIAL_COURSES);
      syncCoursesToServer(INITIAL_COURSES);
      setSelectedCourseId(INITIAL_COURSES[0].id);
      setSaveSuccessMsg('Reset to default course catalog.');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `legal_berries_courses_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#1A1333] border border-[#3E2F63] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#140F26] border-b border-[#2E234B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5C067]/20 border border-[#E5C067]/40 flex items-center justify-center text-[#E5C067]">
              {isAdminAuthenticated ? <Code2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E5C067]">
                {isAdminAuthenticated ? 'Environment Admin Console' : 'Restricted Admin Access'}
              </span>
              <h3 className="text-base font-serif-title font-bold text-[#F7F2EA]">
                {isAdminAuthenticated ? 'Course Manager & Enrollment Roster' : 'Environment Authorization Required'}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authorized</span>
              </div>
            )}
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  onAdminLogout();
                }}
                title="Lock / Log Out of Admin Session"
                className="flex items-center gap-1 text-xs text-[#9E93B5] hover:text-[#FA527B] px-2.5 py-1 rounded-lg hover:bg-[#251A44] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#9E93B5] hover:text-[#F7F2EA] p-1.5 rounded-lg hover:bg-[#251A44] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-10 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E5C067]/10 border border-[#E5C067]/30 flex items-center justify-center text-[#E5C067] shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-serif-title font-bold text-[#F7F2EA] mb-2">
              Environment Authority Required
            </h3>
            <p className="text-xs text-[#C5BAD9] leading-relaxed mb-6">
              To prevent unauthorized changes, modifying course curriculums, updating fees, viewing student rosters, and editing domain records requires the environment Admin Access Key.
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2.5 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPasskey} className="space-y-4">
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E83A6]" />
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter environment ADMIN_ACCESS_KEY..."
                  className="w-full bg-[#140F24] border border-[#3E2F63] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F7F2EA] placeholder:text-[#706687] focus:outline-none focus:border-[#E5C067]"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#E5C067] to-[#D4A03D] hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Verifying Key...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Access Admin Console</span>
                  </>
                )}
              </button>

              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={handleQuickDevUnlock}
                  className="w-full py-2 px-3 text-[11px] text-[#9E93B5] hover:text-[#E5C067] bg-[#20173A] hover:bg-[#251A44] border border-[#3E2F63] rounded-lg transition-colors cursor-pointer"
                >
                  ⚡ Development Environment: Quick Unlock
                </button>
              )}
            </form>
          </div>
        ) : (
          <>
            {/* Tab Bar */}
            <div className="flex border-b border-[#2E234B] bg-[#17112C] px-6">
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'edit'
                    ? 'border-[#E5C067] text-[#E5C067]'
                    : 'border-transparent text-[#9E93B5] hover:text-[#F7F2EA]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Courses & Pricing</span>
              </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'add'
                ? 'border-[#FA527B] text-[#FA527B]'
                : 'border-transparent text-[#9E93B5] hover:text-[#F7F2EA]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Course</span>
          </button>

          <button
            onClick={() => setActiveTab('enrollments')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'enrollments'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-[#9E93B5] hover:text-[#F7F2EA]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Live Student Roster ({enrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'domain'
                ? 'border-[#00BAF2] text-[#00BAF2]'
                : 'border-transparent text-[#9E93B5] hover:text-[#F7F2EA]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Custom Domain & DNS</span>
          </button>

          <button
            onClick={() => setActiveTab('websocket')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'websocket'
                ? 'border-[#FA527B] text-[#FA527B]'
                : 'border-transparent text-[#9E93B5] hover:text-[#F7F2EA]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#FA527B]" />
            <span>Live WS Engine (Developer Only)</span>
            {wsStatus?.connected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {saveSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: EDIT COURSES */}
          {activeTab === 'edit' && (
            <div className="space-y-5">
              {/* Razorpay Gateway Status */}
              <div className="p-3 bg-[#131E2F] border border-[#00BAF2]/30 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#F7F2EA] font-semibold">Payment Gateway Active</span>
                  <span className="text-[11px] text-[#A99EC0] font-mono">Status: Connected & Verified</span>
                </div>
                <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider font-semibold">
                  UPI & Webhooks Ready
                </span>
              </div>

              {/* Select course to edit */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1.5">
                  Select Course to Configure
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCourse(c.id)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        selectedCourseId === c.id
                          ? 'bg-[#E5C067]/15 border-[#E5C067] text-[#F7F2EA] font-semibold'
                          : 'bg-[#140F26] border-[#342654] text-[#9E93B5] hover:text-[#F7F2EA]'
                      }`}
                    >
                      <div className="truncate font-serif-title">{c.title}</div>
                      <div className="text-[11px] text-[#E5C067] font-mono mt-0.5">
                        ₹{c.currentPrice} (was ₹{c.originalPrice})
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form to edit selected course */}
              <form onSubmit={handleSaveCurrentCourse} className="space-y-4 pt-2 border-t border-[#2E234B]">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] focus:outline-none focus:border-[#E5C067]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                      Current Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs font-mono text-[#E5C067] focus:outline-none focus:border-[#E5C067]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                      Crossed Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs font-mono text-[#8E83A6] focus:outline-none focus:border-[#E5C067]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                      Duration / Format
                    </label>
                    <input
                      type="text"
                      required
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] focus:outline-none focus:border-[#E5C067]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    WhatsApp Cohort Group Link
                  </label>
                  <input
                    type="url"
                    required
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-[#7E7299] mt-0.5 block">
                    Payer automatically receives this exact link upon completing payment.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    Course Overview Description
                  </label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] focus:outline-none focus:border-[#E5C067]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-[#E5C067] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Course Changes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(selectedCourseId)}
                      className="py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="py-2 px-3 bg-[#1F1738] hover:bg-[#281E48] text-[#C5BAD9] text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export Config</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToDefaults}
                      className="py-2 px-3 bg-[#1F1738] hover:bg-[#281E48] text-rose-300 text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Catalog</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ADD NEW COURSE */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddNewCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                  New Course Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 7 Days High Court Writ Petition Masterclass"
                  className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] focus:outline-none focus:border-[#FA527B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs font-mono text-[#E5C067] focus:outline-none focus:border-[#FA527B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    Crossed Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs font-mono text-[#8E83A6] focus:outline-none focus:border-[#FA527B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    Category Type
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] focus:outline-none focus:border-[#FA527B]"
                  >
                    <option value="Masterclass">Masterclass (7 Days Cohort)</option>
                    <option value="Vault">Vault (Digital Drafts Collection)</option>
                    <option value="Workshop">Workshop (Weekend Intensive)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    Duration Text
                  </label>
                  <input
                    type="text"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 7 Days Live Cohort"
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] focus:outline-none focus:border-[#FA527B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                    WhatsApp Invite Link
                  </label>
                  <input
                    type="url"
                    required
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Outline what legal practitioners will learn from this course..."
                  className="w-full px-3.5 py-2 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] focus:outline-none focus:border-[#FA527B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FA527B] hover:bg-[#E13D66] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Course to Storefront</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ENROLLMENT ROSTER */}
          {activeTab === 'enrollments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#9E93B5]">
                <span>Total verified enrollments: {enrollments.length}</span>
                <span className="text-[#E5C067]">
                  Total Revenue: ₹
                  {enrollments.reduce((sum, enr) => sum + enr.amountPaid, 0).toLocaleString('en-IN')}
                </span>
              </div>

              {enrollments.length === 0 ? (
                <div className="py-12 text-center text-[#7E7299] text-xs">
                  No student enrollments recorded in this browser session yet.
                  <br />
                  Click "Buy Course" on the home page to test real-time checkout!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {enrollments.map((enr) => (
                    <div
                      key={enr.id}
                      className="p-3 bg-[#140F26] border border-[#2E234B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#F7F2EA] flex items-center gap-2">
                          <span>{enr.fullName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded">
                            Verified Paid
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8E83A6] mt-0.5">
                          {enr.email} · +91 {enr.mobile} · {enr.timestamp}
                        </div>
                        <div className="text-[11px] text-[#C5BAD9] font-serif-title mt-0.5">
                          {enr.courseTitle}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold font-mono text-[#E5C067]">
                          ₹{enr.amountPaid}
                        </span>
                        <div className="text-[10px] text-[#7E7299] font-mono">
                          {enr.transactionId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOM DOMAIN & DNS SETUP */}
          {activeTab === 'domain' && (
            <div className="space-y-6">
              {/* Domain Input Form */}
              <div className="p-5 bg-[#140F26] border border-[#2E234B] rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-[#00BAF2]" />
                  <h4 className="text-sm font-serif-title font-bold text-[#F7F2EA]">
                    Connect Your Purchased Domain to Legal Berries
                  </h4>
                </div>
                <p className="text-xs text-[#A99EC0] mb-4">
                  Enter the custom domain you purchased (e.g. from GoDaddy, Hostinger, Namecheap, Google Domains) to associate it with this application.
                </p>

                <form onSubmit={handleSaveDomain} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-2.5 text-xs text-[#8E83A6] font-mono">
                        https://
                      </span>
                      <input
                        type="text"
                        required
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value)}
                        placeholder="legalberries.in or www.legalberries.in"
                        className="w-full pl-20 pr-4 py-2.5 bg-[#1A1333] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] font-mono focus:outline-none focus:border-[#00BAF2]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-5 bg-gradient-to-r from-[#00BAF2] to-[#0C2340] text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shrink-0 border border-[#00BAF2]/60 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Domain</span>
                    </button>
                  </div>
                </form>

                {domainInput && (
                  <div className="mt-3.5 pt-3 border-t border-[#231A3D] flex items-center justify-between text-xs">
                    <span className="text-[#B5A9CD] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Active Domain Mapping:</span>
                      <strong className="text-white font-mono">{domainInput}</strong>
                    </span>
                    <a
                      href={`https://${domainInput.replace(/^https?:\/\//i, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00BAF2] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>Visit https://{domainInput.replace(/^https?:\/\//i, '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* DNS Records Configuration Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E5C067]">
                    DNS Records to Add at Your Domain Registrar
                  </h4>
                  <span className="text-[11px] text-[#A69ABF]">
                    GoDaddy · Hostinger · Namecheap · Cloudflare
                  </span>
                </div>

                <div className="border border-[#2E234B] rounded-xl overflow-hidden bg-[#140F26]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#17112C] border-b border-[#2E234B] text-[#9E93B5]">
                        <th className="py-2.5 px-3 font-semibold">Type</th>
                        <th className="py-2.5 px-3 font-semibold">Host / Name</th>
                        <th className="py-2.5 px-3 font-semibold">Points To / Value</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#231A3D] font-mono text-[11px] text-[#F7F2EA]">
                      <tr>
                        <td className="py-2.5 px-3 text-[#FA527B] font-bold">CNAME</td>
                        <td className="py-2.5 px-3 text-[#E5C067]">
                          <div className="flex items-center gap-1.5">
                            <span>www</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText('www', 'host-www')}
                              className="text-[10px] text-[#A99EC0] hover:text-white cursor-pointer"
                              title="Copy Host"
                            >
                              {copiedRecord === 'host-www' ? '✓' : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 truncate max-w-[240px] text-white font-bold">
                          legalberries-drafts.ai.studio
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                'legalberries-drafts.ai.studio',
                                'cname'
                              )
                            }
                            className="py-1 px-2.5 bg-[#1F1738] hover:bg-[#2A1F4A] rounded text-[10px] text-[#C5BAD9] hover:text-white transition-colors border border-[#3E2F63] cursor-pointer"
                          >
                            {copiedRecord === 'cname' ? 'Copied!' : 'Copy Target'}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[#00BAF2] font-bold">FORWARD / ALIAS</td>
                        <td className="py-2.5 px-3 text-[#E5C067]">@ (Apex Domain)</td>
                        <td className="py-2.5 px-3 text-[#A99EC0] truncate max-w-[240px]">
                          Forward to https://www.{domainInput.replace(/^https?:\/\//i, '').replace(/^www\./i, '') || 'legalberries.in'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-[10px] text-emerald-400 font-sans">Auto Forward</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GoDaddy Quick Access Card */}
              <div className="p-4 bg-gradient-to-r from-[#172338] to-[#121B2F] border border-[#00BAF2]/40 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-[#F7F2EA]">
                      GoDaddy Account & DNS Manager for legalberries.in
                    </span>
                  </div>
                  <a
                    href="https://dcc.godaddy.com/manage/legalberries.in/dns"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 bg-[#00BAF2] hover:bg-[#0095C2] text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow cursor-pointer shrink-0"
                  >
                    <span>Open GoDaddy DNS Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-[#0C1424] rounded-lg border border-[#1E2E4B]">
                    <span className="text-[10px] uppercase text-[#7E8FA6] block">Domain</span>
                    <span className="font-mono font-bold text-[#E5C067]">legalberries.in</span>
                  </div>
                  <div className="p-2.5 bg-[#0C1424] rounded-lg border border-[#1E2E4B]">
                    <span className="text-[10px] uppercase text-[#7E8FA6] block">Customer ID</span>
                    <span className="font-mono text-white">753699668</span>
                  </div>
                  <div className="p-2.5 bg-[#0C1424] rounded-lg border border-[#1E2E4B]">
                    <span className="text-[10px] uppercase text-[#7E8FA6] block">Account Email</span>
                    <span className="font-mono text-[#00BAF2] truncate block">itsabhishekchaudharyonly1@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* 3-Step Setup Guide & Registrar Links */}
              <div className="p-4 bg-[#181230] border border-[#342654] rounded-xl text-xs space-y-3">
                <span className="font-semibold text-[#F7F2EA] block">
                  Step-by-Step in GoDaddy DNS Management:
                </span>
                <ol className="list-decimal list-inside space-y-2 text-[#BDB2D3]">
                  <li>
                    Log in at <a href="https://dcc.godaddy.com/manage/legalberries.in/dns" target="_blank" rel="noopener noreferrer" className="text-[#00BAF2] underline font-medium">GoDaddy DNS Management</a> using Customer ID <strong>753699668</strong> (or <strong>itsabhishekchaudharyonly1@gmail.com</strong>).
                  </li>
                  <li>
                    Scroll to <strong>DNS Records</strong> and click <strong>Add New Record</strong>:
                    <div className="mt-1.5 ml-4 p-2.5 bg-[#100B1E] rounded-lg border border-[#2A1F45] text-[11px] font-mono space-y-1">
                      <div><span className="text-[#8E83A6]">Type:</span> <span className="text-[#FA527B] font-bold">CNAME</span></div>
                      <div><span className="text-[#8E83A6]">Name:</span> <span className="text-[#E5C067] font-bold">www</span></div>
                      <div><span className="text-[#8E83A6]">Value:</span> <span className="text-white font-bold break-all">legalberries-drafts.ai.studio</span></div>
                      <div><span className="text-[#8E83A6]">TTL:</span> <span className="text-[#9E93B5]">1/2 Hour (or 1 Hour)</span></div>
                    </div>
                  </li>
                  <li>
                    Scroll to the <strong>Forwarding</strong> section below records and click <strong>Add Forwarding</strong>:
                    <div className="mt-1.5 ml-4 p-2.5 bg-[#100B1E] rounded-lg border border-[#2A1F45] text-[11px] font-mono space-y-1">
                      <div><span className="text-[#8E83A6]">Forward to:</span> <span className="text-[#00BAF2]">https://www.legalberries.in</span></div>
                      <div><span className="text-[#8E83A6]">Redirect Type:</span> <span className="text-[#E5C067]">Permanent (301)</span></div>
                      <div><span className="text-[#8E83A6]">Forwarding Type:</span> <span className="text-white">Forward only</span></div>
                    </div>
                  </li>
                  <li>
                    Click <strong>Save</strong>. Google Cloud and GoDaddy will automatically verify the mapping and issue the SSL/TLS certificate.
                  </li>
                </ol>
                <div className="pt-2 border-t border-[#231A3D] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A69ABF]">
                  <span>✨ SSL certificates are auto-provisioned upon CNAME propagation.</span>
                  <span>Typical propagation: 15–30 mins</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEVELOPER WEBSOCKET TERMINAL */}
          {activeTab === 'websocket' && (
            <div className="space-y-5 text-xs">
              {/* Security Banner */}
              <div className="p-4 bg-gradient-to-r from-[#1E1435] to-[#120D22] border border-[#FA527B]/40 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FA527B]/20 border border-[#FA527B]/40 flex items-center justify-center text-[#FA527B]">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#F7F2EA] flex items-center gap-2">
                        <span>Developer WebSocket Terminal</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-[#FA527B] border border-[#FA527B]/30">
                          Admin Only
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#9E93B5]">
                        Strictly restricted to developer environment. Regular students and visitors cannot establish WebSocket connections.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onWsSendPing && (
                      <button
                        onClick={onWsSendPing}
                        className="px-3 py-1.5 rounded-xl bg-[#251A44] hover:bg-[#342456] text-[#E5C067] hover:text-white border border-[#E5C067]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ping WebSocket server"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Ping (Test Latency)</span>
                      </button>
                    )}
                    {onWsReconnect && (
                      <button
                        onClick={onWsReconnect}
                        className="px-3 py-1.5 rounded-xl bg-[#251A44] hover:bg-[#342456] text-[#C5BAD9] hover:text-white border border-[#2E234B] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Reconnect WebSocket"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reconnect</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#17112C] border border-[#2E234B] rounded-xl">
                  <span className="text-[10px] text-[#8E83A6] block uppercase tracking-wider mb-1">
                    Socket State
                  </span>
                  <div className="flex items-center gap-2 font-bold">
                    {wsStatus?.connected ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-emerald-400">OPEN / CONNECTED</span>
                      </>
                    ) : wsStatus?.connecting ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-spin" />
                        <span className="text-amber-400">CONNECTING...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="text-rose-400">DISCONNECTED</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-[#17112C] border border-[#2E234B] rounded-xl">
                  <span className="text-[10px] text-[#8E83A6] block uppercase tracking-wider mb-1">
                    Latency
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {wsStatus?.latencyMs !== null && wsStatus?.latencyMs !== undefined
                      ? `${wsStatus.latencyMs} ms`
                      : 'Measuring...'}
                  </span>
                </div>

                <div className="p-3.5 bg-[#17112C] border border-[#2E234B] rounded-xl">
                  <span className="text-[10px] text-[#8E83A6] block uppercase tracking-wider mb-1">
                    Developer Socket ID
                  </span>
                  <span className="font-mono text-xs text-[#E5C067] truncate block" title={wsClientId}>
                    {wsClientId || 'pending auth'}
                  </span>
                </div>

                <div className="p-3.5 bg-[#17112C] border border-[#2E234B] rounded-xl">
                  <span className="text-[10px] text-[#8E83A6] block uppercase tracking-wider mb-1">
                    Endpoint
                  </span>
                  <span className="font-mono text-xs text-white truncate block">
                    Port 3000 /ws
                  </span>
                </div>
              </div>

              {/* Developer Live Telemetry & Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Live Real-Time Enrollments Received over Socket */}
                <div className="p-4 bg-[#140F24] border border-[#2E234B] rounded-2xl flex flex-col h-[280px]">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#2E234B]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <h5 className="font-bold text-xs text-white">Live Batch Telemetry Feed</h5>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E83A6]">
                      {liveEnrollments.length} events
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {liveEnrollments.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center text-[#8E83A6] text-xs">
                        No live enrollment broadcasts received yet.
                      </div>
                    ) : (
                      liveEnrollments.map((enr) => (
                        <div
                          key={enr.id}
                          className="p-2.5 bg-[#1A1333] border border-[#2E234B] rounded-xl flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="font-semibold text-white text-xs">{enr.fullName}</div>
                            <div className="text-[11px] text-[#9E93B5] truncate max-w-[200px]">
                              {enr.courseTitle}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-emerald-400">₹{enr.amountPaid}</span>
                            <div className="text-[10px] text-[#8E83A6]">{enr.timestamp}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Developer Broadcast & Diagnostics Terminal */}
                <div className="p-4 bg-[#140F24] border border-[#2E234B] rounded-2xl flex flex-col h-[280px]">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#2E234B]">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#FA527B]" />
                      <h5 className="font-bold text-xs text-white">Developer WebSocket Broadcast</h5>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E83A6]">
                      Server Authority: Active
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                    <div className="p-3 bg-[#0C0816] rounded-xl font-mono text-[11px] text-[#C5BAD9] space-y-1.5 border border-[#23183D]">
                      <div className="text-emerald-400">✓ Server WebSocket Server listening on /ws</div>
                      <div className="text-[#E5C067]">✓ Authentication Guard: ADMIN_ACCESS_KEY verified</div>
                      <div className="text-[#8E83A6]">✓ Student connections: Automatically refused (code 1008)</div>
                      <div className="text-[#00BAF2]">✓ Course catalog broadcasts: Enabled on admin publish</div>
                    </div>
                  </div>

                  {/* Manual Broadcast Course Refresh */}
                  <div className="pt-3 border-t border-[#2E234B] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#9E93B5]">
                      Broadcast courses to active nodes:
                    </span>
                    <button
                      onClick={() => {
                        syncCoursesToServer(courses);
                        setSaveSuccessMsg('Dispatched real-time course refresh over WebSocket to all nodes!');
                        setTimeout(() => setSaveSuccessMsg(''), 3000);
                      }}
                      className="px-3 py-1.5 bg-[#FA527B]/20 hover:bg-[#FA527B]/30 border border-[#FA527B]/40 text-[#FA527B] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Broadcast Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
};
