import React, { useState, useEffect } from 'react';
import { INITIAL_COURSES } from './data/courses';
import { Course, StudentEnrollment } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LearningGraph } from './components/LearningGraph';
import { CourseCard } from './components/CourseCard';
import { CourseCurriculum } from './components/CourseCurriculum';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { EnrollmentModal } from './components/EnrollmentModal';
import { DraftPreviewModal } from './components/DraftPreviewModal';
import { DeveloperCourseModal } from './components/DeveloperCourseModal';
import { ShieldCheck, Sparkles, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  // Courses state with local storage persistence and server sync
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('legalberries_courses_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COURSES;
  });

  // Enrollments record
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>(() => {
    try {
      const saved = localStorage.getItem('legalberries_enrollments_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ENR-DEMO-01',
        fullName: 'Adv. Radhika Dhangar',
        email: 'radhika.dhangar@delhibar.in',
        mobile: '9827011223',
        courseId: 'family-court-7-days',
        courseTitle: '7 Days Family Court: Cases & Drafts Masterclass',
        amountPaid: 200,
        transactionId: 'LB-TXN-89211-540',
        paymentMethod: 'UPI (PhonePe)',
        timestamp: 'Yesterday at 4:30 PM',
        whatsappGroupLink: 'https://chat.whatsapp.com/LegalBerriesFamilyLawBatch7Days',
        status: 'completed'
      },
      {
        id: 'ENR-DEMO-02',
        fullName: 'Adv. Abhishek Chaudhary',
        email: 'abhishek.c@delhibar.org',
        mobile: '9811443322',
        courseId: 'all-legal-drafts-vault',
        courseTitle: 'All Legal Drafts: Every Type Master Vault',
        amountPaid: 799,
        transactionId: 'LB-TXN-90412-881',
        paymentMethod: 'Net Banking (HDFC)',
        timestamp: '2 days ago',
        whatsappGroupLink: 'https://chat.whatsapp.com/LegalBerriesAllDraftsVIPCohort',
        status: 'completed'
      }
    ];
  });

  // Admin authorization state: only true in authorized environment or with valid token
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(() => {
    try {
      const savedToken = sessionStorage.getItem('legalberries_admin_token');
      const envKey = (import.meta.env.VITE_ADMIN_ACCESS_KEY as string) || '';
      if (savedToken && envKey && savedToken === envKey) return true;
      if (import.meta.env.DEV && import.meta.env.VITE_SHOW_ADMIN_IN_ENV === 'true') {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Filter state
  const [activeCategory, setActiveCategory] = useState<'All' | 'Vault' | 'Masterclass'>('All');

  // Modals state
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [devModalInitialTab, setDevModalInitialTab] = useState<'edit' | 'add' | 'enrollments' | 'domain'>('edit');
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>(courses[0]?.id || '');

  // Custom Domain state (persisted)
  const [customDomain, setCustomDomain] = useState<string>(() => {
    try {
      return localStorage.getItem('legalberries_custom_domain') || 'legalberries.in';
    } catch {
      return 'legalberries.in';
    }
  });

  // Load server-side courses if available
  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasServerOverrides && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => {
        // use local defaults
      });
  }, []);

  // Check URL parameters for direct admin login (?admin_key=... or ?admin=true)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get('admin');
      const adminKeyParam = params.get('admin_key');
      const envAdminKey = (import.meta.env.VITE_ADMIN_ACCESS_KEY as string) || '';

      if (adminKeyParam && envAdminKey && adminKeyParam.trim() === envAdminKey.trim()) {
        sessionStorage.setItem('legalberries_admin_token', adminKeyParam.trim());
        setIsAdminAuthorized(true);
        setIsDevModalOpen(true);
        setDevModalInitialTab('edit');
      } else if (adminParam === 'true' || adminParam === 'login') {
        setIsDevModalOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Keyboard shortcut: Alt+A or Ctrl+Shift+A opens the Admin Suite
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsDevModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminLogin = async (key: string): Promise<boolean> => {
    const envKey = (import.meta.env.VITE_ADMIN_ACCESS_KEY as string) || '';
    if (envKey && key.trim() === envKey.trim()) {
      sessionStorage.setItem('legalberries_admin_token', key.trim());
      setIsAdminAuthorized(true);
      return true;
    }
    // Also verify against server endpoint
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: key.trim() })
      });
      const data = await res.json();
      if (res.ok && data.authorized) {
        sessionStorage.setItem('legalberries_admin_token', key.trim());
        setIsAdminAuthorized(true);
        return true;
      }
    } catch (err) {
      console.error('Server admin verification error:', err);
    }
    return false;
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('legalberries_admin_token');
    setIsAdminAuthorized(false);
    setIsDevModalOpen(false);
  };

  const handleUpdateCustomDomain = (domain: string) => {
    setCustomDomain(domain);
    try {
      localStorage.setItem('legalberries_custom_domain', domain);
    } catch {
      // ignore
    }
  };

  // Persist courses when modified by authorized environment administrator
  const handleUpdateCourses = (updated: Course[]) => {
    setCourses(updated);
    try {
      localStorage.setItem('legalberries_courses_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Add new verified enrollment
  const handleEnrollmentSuccess = (newEnrollment: StudentEnrollment) => {
    const updated = [newEnrollment, ...enrollments];
    setEnrollments(updated);
    try {
      localStorage.setItem('legalberries_enrollments_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenEnroll = (course: Course) => {
    setEnrollCourse(course);
    setIsEnrollOpen(true);
  };

  const handleOpenPreview = (course: Course) => {
    setPreviewCourse(course);
    setIsPreviewOpen(true);
  };

  const handleViewSyllabus = (course: Course) => {
    setSelectedCurriculumId(course.id);
    const element = document.getElementById('curriculum');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredCourses =
    activeCategory === 'All'
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#140F24] text-[#EFEAE1] flex flex-col font-sans-body selection:bg-[#FA527B]/30 selection:text-[#FFFFFF]">
      {/* Universal 3-Zone Navbar with environment-gated admin suite */}
      <Navbar
        isAdminAuthorized={isAdminAuthorized}
        onAdminLogout={handleAdminLogout}
        onOpenDeveloperModal={() => {
          setDevModalInitialTab('edit');
          setIsDevModalOpen(true);
        }}
        onOpenDomainModal={() => {
          setDevModalInitialTab('domain');
          setIsDevModalOpen(true);
        }}
        onOpenEnrollDefault={() => handleOpenEnroll(courses[0])}
        customDomain={customDomain}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCourses={() => {
            const el = document.getElementById('courses');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onEnrollFirst={() => handleOpenEnroll(courses[0])}
        />

        {/* Courses Section */}
        <section id="courses" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#E5C067] font-semibold mb-3">
              <span>Signature Legal Berries Catalog</span>
              <span aria-hidden="true">·</span>
              <span>Direct WhatsApp Cohort Enrollment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#F7F2EA]">
              Practical Courses & Comprehensive Vault
            </h2>
            <p className="mt-4 text-base text-[#BDB2D3]">
              Choose from our complete 3,500+ court draft vault or intensive 7-day live masterclasses led by seasoned advocates.
            </p>

            {/* Interactive Category Filter (Tabbed control, no pills) */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex p-1 bg-[#1A1333] rounded-xl border border-[#3E2F63]">
                {(['All', 'Vault', 'Masterclass'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      activeCategory === cat
                        ? 'bg-[#FA527B] text-white shadow-md'
                        : 'text-[#9E93B5] hover:text-[#F7F2EA] hover:bg-[#251A44]'
                    }`}
                  >
                    {cat === 'All' ? 'All 3 Curricula' : cat === 'Vault' ? 'Draft Vault (₹799)' : '7 Days Masterclasses (₹200)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleOpenEnroll}
                onPreviewDraft={handleOpenPreview}
                onViewSyllabus={handleViewSyllabus}
              />
            ))}
          </div>

          {/* Quick Notice about WhatsApp Group */}
          <div className="mt-12 p-4 bg-[#1A1333] border border-[#3E2F63] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C5BAD9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#F7F2EA]">Instant Class WhatsApp Group:</strong> Once you complete payment on our secure gateway, you will immediately be provided the invite token to join your official batch WhatsApp group.
              </div>
            </div>
            <button
              onClick={() => handleOpenEnroll(courses[0])}
              className="py-2 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap"
            >
              Enroll Now & Join Batch
            </button>
          </div>
        </section>

        {/* Interactive Learning Graph / Showpiece */}
        <LearningGraph />

        {/* Detailed Curriculum Section */}
        <CourseCurriculum
          courses={courses}
          onEnroll={handleOpenEnroll}
          selectedCourseId={selectedCurriculumId}
        />

        {/* Verified Reviews Section (Adv. Radhika Dhangar, Adv. Abhishek Chaudhary, Manoj, Satyam) */}
        <Testimonials />

        {/* Contact Section (Instagram legalberries.official & Email legalberries.official@gmail.com) */}
        <ContactSection />
      </main>

      {/* Footer with subtle environment admin portal trigger */}
      <Footer
        customDomain={customDomain}
        onOpenAdminLogin={() => {
          setDevModalInitialTab('edit');
          setIsDevModalOpen(true);
        }}
      />

      {/* MODALS */}
      {/* 1. Student Enrollment & Payment Gateway Modal */}
      <EnrollmentModal
        course={enrollCourse}
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        onEnrollmentSuccess={handleEnrollmentSuccess}
      />

      {/* 2. Sample Legal Draft Preview Modal */}
      <DraftPreviewModal
        course={previewCourse}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onEnrollClick={handleOpenEnroll}
      />

      {/* 3. Developer & Course Manager Modal with strict Admin Authority Gate */}
      <DeveloperCourseModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
        courses={courses}
        onUpdateCourses={handleUpdateCourses}
        enrollments={enrollments}
        customDomain={customDomain}
        onUpdateCustomDomain={handleUpdateCustomDomain}
        initialTab={devModalInitialTab}
        isAdminAuthenticated={isAdminAuthorized}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />
    </div>
  );
}
