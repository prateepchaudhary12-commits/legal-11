import React, { useState } from 'react';
import { X, FileText, Copy, Check, Download, ShieldCheck } from 'lucide-react';
import { Course } from '../types';

interface DraftPreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnrollClick: (course: Course) => void;
}

export const DraftPreviewModal: React.FC<DraftPreviewModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnrollClick
}) => {
  if (!isOpen || !course) return null;

  const [copied, setCopied] = useState(false);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(course.sampleDraftSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#1A1333] border border-[#3E2F63] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#140F26] border-b border-[#2E234B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FA527B]/20 border border-[#FA527B]/40 flex items-center justify-center text-[#FA527B]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E5C067]">
                Live Draft Sample Preview
              </span>
              <h3 className="text-sm font-serif-title font-bold text-[#F7F2EA] truncate max-w-md">
                {course.sampleDraftName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9E93B5] hover:text-[#F7F2EA] p-1.5 rounded-lg hover:bg-[#251A44] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#B5A9CD] pb-2 border-b border-[#2E234B]">
            <span className="flex items-center gap-1.5 text-[#E5C067]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified format compliant with Indian procedural laws & high court registries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySnippet}
                className="px-3 py-1.5 bg-[#251A44] hover:bg-[#322359] text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5 border border-[#3E2F63]"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Parchment Styled Legal Draft Box */}
          <div className="p-6 bg-[#0F0B1C] border border-[#342654] rounded-xl font-mono text-xs text-[#D8CFE6] whitespace-pre-wrap leading-relaxed shadow-inner overflow-x-auto select-all">
            {course.sampleDraftSnippet}
          </div>

          <div className="p-4 bg-[#140F26] border border-[#2E234B] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-semibold text-[#F7F2EA]">
                Unlock this complete editable .DOCX format + 3,500 more court drafts
              </p>
              <p className="text-[11px] text-[#8E83A6] mt-0.5">
                Included in <strong>{course.title}</strong> with full statutory annotations.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onEnrollClick(course);
              }}
              className="py-2.5 px-5 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-bold text-xs rounded-xl hover:opacity-95 transition-opacity shrink-0 shadow-lg shadow-[#FA527B]/20"
            >
              Enroll & Get All Drafts @ ₹{course.currentPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
