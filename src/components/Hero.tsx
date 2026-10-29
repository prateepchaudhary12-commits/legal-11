import React from 'react';
import { ShieldCheck, ArrowRight, BookOpen, Scale, Sparkles, Instagram, Mail } from 'lucide-react';
import { Course } from '../types';

interface HeroProps {
  onExploreCourses: () => void;
  onEnrollFirst: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onEnrollFirst }) => {
  return (
    <section className="relative pt-12 pb-20 bg-gradient-to-b from-[#140F24] via-[#17112A] to-[#140F24] overflow-hidden border-b border-[#2E234B]">
      {/* Dark Academia Radial Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#FA527B]/10 via-[#3A1F45]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-[#E5C067]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Kicker: Clean unboxed metadata with separators */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#E5C067] font-semibold tracking-wider uppercase mb-6">
          <span>Advocate-Led Practical Academy</span>
          <span aria-hidden="true">·</span>
          <span>Courtroom & Corporate Masterclasses</span>
          <span aria-hidden="true">·</span>
          <span>BNS / BNSS Ready</span>
        </div>

        {/* 2-Column Split: Headline + Brand Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-bold text-[#F7F2EA] leading-[1.15] text-balance">
              Master Practical Legal Drafting & Courtroom Advocacy.
            </h1>

            <p className="text-base sm:text-lg text-[#C5BAD9] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform from law theory to courtroom mastery. Access 3,500+ court-cleared legal drafts, join rigorous 7-day intensive masterclasses in Family Law and Contract Drafting, and learn directly inside dedicated WhatsApp cohorts.
            </p>

            {/* Official Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#20173A] border border-[#3E2F63] rounded-full text-xs text-[#E5C067] font-serif-title italic">
              <Scale className="w-3.5 h-3.5 text-[#E5C067]" />
              <span>&ldquo;Sweet justice, freshly picked.&rdquo; — Legal Berries</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#courses"
                className="w-full sm:w-auto py-3.5 px-7 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-semibold text-sm rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-[#FA527B]/25"
              >
                <span>Browse All Courses & Vault</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#learning-graph"
                className="w-full sm:w-auto py-3.5 px-6 bg-[#1F1738] hover:bg-[#281E48] text-[#EFEAE1] font-medium text-sm rounded-xl transition-colors border border-[#3A2D5C] flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#E5C067]" />
                <span>View Drafting Impact Curve</span>
              </a>
            </div>

            {/* Social channels preview */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#9E93B5]">
              <a
                href="https://instagram.com/legalberries.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#FA527B] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#FA527B]" />
                <span>@legalberries.in</span>
              </a>
              <span aria-hidden="true" className="text-[#3E2F63]">·</span>
              <a
                href="mailto:legalberries.official@gmail.com"
                className="flex items-center gap-1.5 hover:text-[#E5C067] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#E5C067]" />
                <span>legalberries.official@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor (The Uploaded Brand Asset) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FA527B]/40 to-[#E5C067]/40 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

              <div className="relative bg-[#1A1333] border-2 border-[#3E2F63] rounded-2xl overflow-hidden shadow-2xl p-3">
                <img
                  src="/assets/aistudio/legal-berries-no-name_462d0f0f.jpg"
                  alt="Legal Berries Official Scale of Justice"
                  className="w-full h-auto rounded-xl object-contain shadow-inner bg-[#211B3B]"
                />

                <div className="p-4 bg-[#140F26] rounded-xl mt-3 border border-[#2E234B] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#E5C067] font-semibold block">
                      Limited Time Launch Offer
                    </span>
                    <span className="text-sm font-serif-title font-bold text-[#F7F2EA]">
                      Starting from just ₹200
                    </span>
                  </div>
                  <button
                    onClick={onEnrollFirst}
                    className="py-2 px-4 bg-[#FA527B] hover:bg-[#E13D66] text-white text-xs font-semibold rounded-lg transition-colors shadow-md"
                  >
                    Quick Enroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Proof & Feature Strip Below the Hero */}
        <div className="mt-16 pt-10 border-t border-[#2E234B] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F7F2EA] tabular-nums">
              3,500+
            </div>
            <div className="text-xs text-[#9E93B5] mt-1 font-medium">
              Editable Word (.docx) Drafts
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#FA527B] tabular-nums">
              7 Days
            </div>
            <div className="text-xs text-[#9E93B5] mt-1 font-medium">
              Intensive Live Cohort Format
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#E5C067] tabular-nums">
              ₹200
            </div>
            <div className="text-xs text-[#9E93B5] mt-1 font-medium">
              Affordable Advocate Pricing
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              100%
            </div>
            <div className="text-xs text-[#9E93B5] mt-1 font-medium">
              Direct WhatsApp Cohort Access
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
