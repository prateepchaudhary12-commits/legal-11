export interface SyllabusItem {
  dayOrSection: string;
  topic: string;
  draftDeliverables: string[];
  keySkill?: string;
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  category: 'Vault' | 'Masterclass' | 'Workshop';
  duration: string;
  currentPrice: number;
  originalPrice: number;
  badge: string;
  format: string;
  description: string;
  highlights: string[];
  syllabus: SyllabusItem[];
  sampleDraftName: string;
  sampleDraftCategory: string;
  sampleDraftSnippet: string;
  whatsappGroupLink: string;
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  nextCohortDate?: string;
}

export interface StudentEnrollment {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  courseId: string;
  courseTitle: string;
  amountPaid: number;
  transactionId: string;
  paymentMethod: string;
  timestamp: string;
  whatsappGroupLink: string;
  status: 'completed' | 'pending';
}

export interface Review {
  id: string;
  name: string;
  designation: string;
  chamberOrCourt: string;
  avatarText: string;
  rating: number;
  comment: string;
  courseTaken: string;
  highlightMetric: string;
}
