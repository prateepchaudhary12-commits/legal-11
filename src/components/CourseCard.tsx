import React from 'react';
import { Check, FileText, ArrowRight, Clock, Users, Shield, Sparkles, Zap } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
  onPreviewDraft: (course: Course) => void;
  onViewSyllabus: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onPreviewDraft,
  onViewSyllabus
}) => {
  const discountPercent = Math.round(
    ((course.originalPrice - course.currentPrice) / course.originalPrice) * 100
  );

  const isVault = course.category === 'Vault';

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all duration-300 border ${
      isVault
        ? 'bg-gradient-to-b from-[#21173D] to-[#1A1233] border-[#FA527B]/50 shadow-2xl shadow-[#FA527B]/10 hover:border-[#FA527B]'
        : 'bg-[#1A1333] border-[#3E2F63] hover:border-[#E5C067]/60 shadow-xl'
    }`}>
      {/* Top Banner Tag if Vault or High Demand */}
      {isVault && (
        <div className="absolute -top-3.5 left-8 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
          {course.badge}
        </div>
      )}

      <div>
        {/* Course Category & Duration Metadata (Unboxed typography) */}
        <div className="flex items-center gap-2 text-xs text-[#E5C067] font-semibold uppercase tracking-wider mb-2">
          <span>{course.category}</span>
          <span aria-hidden="true">·</span>
          <span>{course.duration}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-[#F7F2EA] leading-snug">
          {course.title}
        </h3>

        {/* Short Tagline */}
        <p className="text-xs sm:text-sm text-[#C5BAD9] mt-2.5 leading-relaxed">
          {course.tagline}
        </p>

        {/* Pricing Box */}
        <div className="my-6 p-4 bg-[#140F26] rounded-xl border border-[#2E234B] flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold font-mono text-[#E5C067] tabular-nums">
                ₹{course.currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-mono text-[#8E83A6] line-through tabular-nums">
                ₹{course.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              Save {discountPercent}% · Special Launch Enrollment
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#A69ABF] block">Access</span>
            <span className="text-xs font-semibold text-[#F7F2EA]">
              Instant Live + Vault
            </span>
          </div>
        </div>

        {/* Highlights List */}
        <div className="space-y-2.5 mb-6">
          {course.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#D8CFE6]">
              <div className="w-4 h-4 rounded-full bg-[#FA527B]/15 text-[#FA527B] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="leading-tight">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-4 border-t border-[#2E234B] space-y-2.5">
        <button
          onClick={() => onEnroll(course)}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FA527B] to-[#E13D66] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-[#FA527B]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4 text-[#E5C067]" />
          <span>Enroll & Pay ₹{course.currentPrice} (Razorpay)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onPreviewDraft(course)}
            className="py-2.5 px-3 bg-[#150F28] hover:bg-[#20173A] text-[#E5C067] text-xs font-medium rounded-lg transition-colors border border-[#3E2F63] flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sample Draft</span>
          </button>

          <button
            onClick={() => onViewSyllabus(course)}
            className="py-2.5 px-3 bg-[#150F28] hover:bg-[#20173A] text-[#C5BAD9] hover:text-white text-xs font-medium rounded-lg transition-colors border border-[#3E2F63] flex items-center justify-center gap-1.5"
          >
            <span>View Syllabus ({course.syllabus.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
