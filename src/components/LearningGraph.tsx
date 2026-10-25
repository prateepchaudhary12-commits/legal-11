import React, { useState } from 'react';
import { Award, Clock, FileCheck, ShieldCheck, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StageData {
  title: string;
  hoursSavedMonthly: number;
  clearanceRate: number;
  timePerDraft: string;
  confidenceScore: number;
  summary: string;
}

const STAGES: Record<'intern' | 'junior' | 'independent', StageData> = {
  intern: {
    title: 'Law Student / Chamber Intern',
    hoursSavedMonthly: 48,
    clearanceRate: 91,
    timePerDraft: '45 mins (vs 8 hrs)',
    confidenceScore: 94,
    summary: 'Stand out in internship chambers. Hand your senior advocate ready-to-file drafts instead of theoretical summaries.'
  },
  junior: {
    title: 'Junior Advocate (1 - 3 Yrs PQE)',
    hoursSavedMonthly: 85,
    clearanceRate: 95,
    timePerDraft: '35 mins (vs 12 hrs)',
    confidenceScore: 98,
    summary: 'Eliminate registry objections, clear filing counters on day one, and take independent case briefs with certainty.'
  },
  independent: {
    title: 'Independent Litigator & Counsel',
    hoursSavedMonthly: 120,
    clearanceRate: 98,
    timePerDraft: '25 mins (vs 15 hrs)',
    confidenceScore: 99,
    summary: 'Scale your private chamber practice. Turnaround urgent notices, bail petitions, and commercial contracts within hours.'
  }
};

export const LearningGraph: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<'intern' | 'junior' | 'independent'>('junior');
  const [activeMetric, setActiveMetric] = useState<'clearance' | 'speed' | 'retainer'>('clearance');

  const current = STAGES[selectedStage];

  return (
    <section id="learning-graph" className="py-20 bg-[#161028] border-y border-[#342652]/60 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#FA527B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E5C067]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#E5C067] font-semibold mb-3">
            <span>Essential Drafting Impact</span>
            <span aria-hidden="true">·</span>
            <span>Empirical Learning Curve</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-title font-bold text-[#F7F2EA] leading-tight text-balance">
            Why Practical Legal Drafting is the #1 Career Multiplier
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#BDB2D3] leading-relaxed">
            Law school teaches theory and case laws, but courtroom success and corporate retainers depend on how fast and accurately you put ink to paper.
          </p>
        </div>

        {/* Interactive Career Stage Filter */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-[#1F1738] rounded-xl border border-[#3A2D5C]">
            {(
              [
                ['intern', 'Law Student / Intern'],
                ['junior', 'Junior Advocate (1-3 Yrs)'],
                ['independent', 'Independent Litigator']
              ] as const
            ).map(([stageKey, label]) => (
              <button
                key={stageKey}
                onClick={() => setSelectedStage(stageKey)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedStage === stageKey
                    ? 'bg-[#FA527B] text-white shadow-md shadow-[#FA527B]/20 font-semibold'
                    : 'text-[#C5BAD9] hover:text-white hover:bg-[#281E48]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Showpiece Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: The Visual Graph Canvas */}
          <div className="lg:col-span-7 bg-[#1D1636] border border-[#3A2D5C] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#2E234B]">
                <div>
                  <h3 className="text-lg font-serif-title font-bold text-[#F7F2EA]">
                    Registry Clearance & Drafting Speed Progression
                  </h3>
                  <p className="text-xs text-[#9E93B5] mt-1">
                    Comparative tracking over 12 months of legal practice
                  </p>
                </div>
                {/* Metric toggle */}
                <div className="flex items-center gap-1 bg-[#150F26] p-1 rounded-lg border border-[#2E234B]">
                  <button
                    onClick={() => setActiveMetric('clearance')}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      activeMetric === 'clearance'
                        ? 'bg-[#E5C067] text-[#140F24] font-semibold'
                        : 'text-[#9E93B5] hover:text-white'
                    }`}
                  >
                    Filing Clearance
                  </button>
                  <button
                    onClick={() => setActiveMetric('speed')}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      activeMetric === 'speed'
                        ? 'bg-[#FA527B] text-white font-semibold'
                        : 'text-[#9E93B5] hover:text-white'
                    }`}
                  >
                    Speed / Turnaround
                  </button>
                </div>
              </div>

              {/* The Graph Visual (High Fidelity SVG) */}
              <div className="mt-6 relative">
                {/* Legend */}
                <div className="flex items-center justify-end gap-6 text-xs mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FA527B] shadow-sm shadow-[#FA527B]/50" />
                    <span className="text-[#F7F2EA] font-medium">With Legal Berries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-[#5A4B75] rounded-full" />
                    <span className="text-[#8E83A6]">Traditional Law Method</span>
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="w-full h-64 sm:h-72">
                  <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="40" y1="30" x2="580" y2="30" stroke="#2D234B" strokeDasharray="3 3" />
                    <line x1="40" y1="90" x2="580" y2="90" stroke="#2D234B" strokeDasharray="3 3" />
                    <line x1="40" y1="150" x2="580" y2="150" stroke="#2D234B" strokeDasharray="3 3" />
                    <line x1="40" y1="210" x2="580" y2="210" stroke="#2D234B" strokeDasharray="3 3" />

                    {/* Y-axis labels */}
                    <text x="30" y="35" textAnchor="end" fill="#7E7299" fontSize="11" fontFamily="sans-serif">
                      {activeMetric === 'clearance' ? '98%' : '30m'}
                    </text>
                    <text x="30" y="95" textAnchor="end" fill="#7E7299" fontSize="11" fontFamily="sans-serif">
                      {activeMetric === 'clearance' ? '75%' : '2h'}
                    </text>
                    <text x="30" y="155" textAnchor="end" fill="#7E7299" fontSize="11" fontFamily="sans-serif">
                      {activeMetric === 'clearance' ? '50%' : '6h'}
                    </text>
                    <text x="30" y="215" textAnchor="end" fill="#7E7299" fontSize="11" fontFamily="sans-serif">
                      {activeMetric === 'clearance' ? '25%' : '14h'}
                    </text>

                    {/* Traditional Path (Struggling curve, plateaued) */}
                    <path
                      d={
                        activeMetric === 'clearance'
                          ? 'M 60 215 C 160 210, 260 190, 360 175 C 440 165, 520 160, 560 155'
                          : 'M 60 45 C 160 55, 260 85, 360 110 C 440 135, 520 145, 560 150'
                      }
                      fill="none"
                      stroke="#5A4B75"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />

                    {/* Legal Berries Path (High performance exponential curve) */}
                    <defs>
                      <linearGradient id="berryGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FA527B" />
                        <stop offset="50%" stopColor="#FF6B8B" />
                        <stop offset="100%" stopColor="#E5C067" />
                      </linearGradient>
                      <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FA527B" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#FA527B" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                      d={
                        activeMetric === 'clearance'
                          ? 'M 60 215 C 120 130, 220 55, 340 40 C 420 32, 500 30, 560 28 L 560 230 L 60 230 Z'
                          : 'M 60 215 C 120 140, 220 70, 340 50 C 420 40, 500 35, 560 30 L 560 230 L 60 230 Z'
                      }
                      fill="url(#areaGlow)"
                    />

                    {/* Main Curve */}
                    <path
                      d={
                        activeMetric === 'clearance'
                          ? 'M 60 215 C 120 130, 220 55, 340 40 C 420 32, 500 30, 560 28'
                          : 'M 60 215 C 120 140, 220 70, 340 50 C 420 40, 500 35, 560 30'
                      }
                      fill="none"
                      stroke="url(#berryGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Milestone nodes */}
                    <g className="cursor-pointer">
                      <circle cx="60" cy="215" r="5" fill="#FA527B" stroke="#1D1636" strokeWidth="2" />
                      <circle cx="200" cy="80" r="6" fill="#FA527B" stroke="#F7F2EA" strokeWidth="2" />
                      <circle cx="360" cy="38" r="6" fill="#E5C067" stroke="#F7F2EA" strokeWidth="2" />
                      <circle cx="560" cy="28" r="7" fill="#E5C067" stroke="#FFFFFF" strokeWidth="3" />
                    </g>

                    {/* Milestone labels */}
                    <text x="60" y="248" textAnchor="middle" fill="#9E93B5" fontSize="10">Day 1</text>
                    <text x="200" y="248" textAnchor="middle" fill="#9E93B5" fontSize="10">Month 1 (Masterclass)</text>
                    <text x="360" y="248" textAnchor="middle" fill="#9E93B5" fontSize="10">Month 3 (Chamber Ready)</text>
                    <text x="560" y="248" textAnchor="middle" fill="#E5C067" fontSize="10" fontWeight="bold">Month 12 (Partner Grade)</text>

                    {/* Floating callout tag on top */}
                    <rect x="290" y="6" width="160" height="24" rx="4" fill="#241B42" stroke="#E5C067" strokeWidth="1" />
                    <text x="370" y="22" textAnchor="middle" fill="#F7F2EA" fontSize="10" fontWeight="600">
                      ⚡ 94% First-Pass Clearance
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom summary bar */}
            <div className="mt-6 pt-4 border-t border-[#2E234B] flex flex-wrap items-center justify-between text-xs text-[#B0A4C8] gap-3">
              <span className="flex items-center gap-1.5 text-[#E5C067]">
                <ShieldCheck className="w-4 h-4" />
                Validated against High Court & District Registry rejection logs
              </span>
              <span className="text-[#8E83A6]">Updated for BNS/BNSS/BSA & Commercial Courts Act</span>
            </div>
          </div>

          {/* Right: Concrete Impact Breakdown */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Stage summary card */}
            <div className="bg-[#1D1636] border border-[#3A2D5C] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#E5C067] font-semibold">
                  Projected Gain for {current.title}
                </span>
                <span className="text-xs text-[#FA527B] font-mono tabular-nums">
                  Active Profile
                </span>
              </div>
              <p className="mt-3 text-sm text-[#D8CFE8] leading-relaxed">
                {current.summary}
              </p>

              {/* 3 Key Metrics */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#140F26] rounded-xl border border-[#2E234B]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9E93B5]">
                    <Clock className="w-3.5 h-3.5 text-[#FA527B]" />
                    <span>Time per Draft</span>
                  </div>
                  <div className="mt-1 text-base font-bold text-[#F7F2EA] tabular-nums">
                    {current.timePerDraft}
                  </div>
                  <span className="text-[11px] text-[#FA527B]">~85% time reduction</span>
                </div>

                <div className="p-3.5 bg-[#140F26] rounded-xl border border-[#2E234B]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9E93B5]">
                    <FileCheck className="w-3.5 h-3.5 text-[#E5C067]" />
                    <span>Registry Clearance</span>
                  </div>
                  <div className="mt-1 text-base font-bold text-[#F7F2EA] tabular-nums">
                    {current.clearanceRate}% First Pass
                  </div>
                  <span className="text-[11px] text-[#E5C067]">Zero defective notices</span>
                </div>

                <div className="p-3.5 bg-[#140F26] rounded-xl border border-[#2E234B]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9E93B5]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FA527B]" />
                    <span>Chamber Confidence</span>
                  </div>
                  <div className="mt-1 text-base font-bold text-[#F7F2EA] tabular-nums">
                    {current.confidenceScore} / 100
                  </div>
                  <span className="text-[11px] text-[#A69ABF]">Trial & chamber ready</span>
                </div>

                <div className="p-3.5 bg-[#140F26] rounded-xl border border-[#2E234B]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9E93B5]">
                    <Award className="w-3.5 h-3.5 text-[#E5C067]" />
                    <span>Monthly Saved</span>
                  </div>
                  <div className="mt-1 text-base font-bold text-[#F7F2EA] tabular-nums">
                    {current.hoursSavedMonthly} Hours
                  </div>
                  <span className="text-[11px] text-[#E5C067]">For client consultations</span>
                </div>
              </div>
            </div>

            {/* Why 80% of Cases Fail in Defective Drafting */}
            <div className="bg-[#1D1636] border border-[#3A2D5C] rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F7F2EA] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FA527B]" />
                  The Real Cost of Amateur Drafting
                </h4>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-[#C5BAD9]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FA527B] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-[#F7F2EA]">Registry Objections:</strong> A misspelled section or flawed affidavit format delays interim injunction hearings by 3 to 6 weeks.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-[#C5BAD9]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FA527B] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-[#F7F2EA]">Vague Prayer Clauses:</strong> If your prayer clause fails to explicitly specify urgent ad-interim reliefs, judges cannot grant emergency stay orders.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-[#C5BAD9]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E5C067] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-[#F7F2EA]">The Legal Berries Solution:</strong> Every template is battle-tested in real courtrooms, citing current Supreme Court ratios and strict procedural compliance.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E234B]">
                <a
                  href="#courses"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-semibold text-sm rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-[#FA527B]/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Explore Practical Masterclasses & Vault
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
