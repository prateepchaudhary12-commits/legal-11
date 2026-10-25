import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { REVIEWS } from '../data/reviews';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-[#17112A] border-b border-[#2E234B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#E5C067] font-semibold mb-3">
            <span>Verified Practitioner Feedback</span>
            <span aria-hidden="true">·</span>
            <span>Litigators & Interns</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#F7F2EA]">
            Advocate & Student Reviews
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#BDB2D3]">
            Read how young advocates and legal associates transformed their drafting turnaround and courtroom confidence with Legal Berries.
          </p>
        </div>

        {/* 4 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#1D1636] border border-[#3A2D5C] hover:border-[#E5C067]/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-xl"
            >
              <div>
                {/* Top Row: Stars and Highlight Metric */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2E234B] mb-5">
                  <div className="flex items-center gap-1 text-[#E5C067]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#FA527B] bg-[#FA527B]/10 px-2.5 py-1 rounded-md border border-[#FA527B]/20">
                    {review.highlightMetric}
                  </span>
                </div>

                {/* Review Text */}
                <blockquote className="text-sm text-[#D8CFE8] leading-relaxed relative">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
              </div>

              {/* Reviewer Details */}
              <div className="mt-6 pt-5 border-t border-[#2E234B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FA527B] to-[#7B2C45] text-white font-serif-title font-bold flex items-center justify-center text-sm shadow-md">
                    {review.avatarText}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F7F2EA] flex items-center gap-1.5">
                      <span>{review.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E5C067]" />
                    </h4>
                    <p className="text-xs text-[#9E93B5]">{review.designation}</p>
                    <p className="text-[11px] text-[#7E7299]">{review.chamberOrCourt}</p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-[#7E7299] uppercase block tracking-wider">
                    Completed Program
                  </span>
                  <span className="text-[11px] text-[#C5BAD9] font-medium font-serif-title max-w-[140px] truncate block">
                    {review.courseTaken}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
