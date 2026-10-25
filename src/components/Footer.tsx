import React from 'react';
import { Instagram, Mail, Lock } from 'lucide-react';

interface FooterProps {
  customDomain?: string;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  customDomain = 'legalberries.in',
  onOpenAdminLogin
}) => {
  return (
    <footer className="bg-[#0F0B1C] border-t border-[#2E234B] text-[#9E93B5] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#231A3B]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/legal-berries-no-name_462d0f0f.jpg"
                alt="Legal Berries"
                className="w-9 h-9 rounded-lg object-cover border border-[#E5C067]/40"
              />
              <span className="text-xl font-serif-title font-bold text-[#F7F2EA]">
                Legal <span className="text-[#FA527B] font-cinzel">Berries</span>
              </span>
            </div>
            <p className="text-xs text-[#E5C067] font-serif-title italic">
              &ldquo;Sweet justice, freshly picked.&rdquo;
            </p>
            <p className="text-xs text-[#8E83A6] leading-relaxed max-w-sm">
              The premier practical drafting academy for Indian advocates, chamber juniors, and law students. Eliminating filing rejections through precision drafting.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F7F2EA]">
              Programs & Vault
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#courses" className="hover:text-[#FA527B] transition-colors">
                  All Legal Drafts Vault (₹799)
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-[#FA527B] transition-colors">
                  7 Days Family Court Masterclass (₹200)
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-[#courses] transition-colors">
                  7 Days Contract Drafting Masterclass (₹200)
                </a>
              </li>
              <li>
                <a href="#learning-graph" className="hover:text-[#FA527B] transition-colors">
                  Registry Clearance Curve
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F7F2EA]">
              Official Channels
            </h4>
            <div className="space-y-2">
              <a
                href="https://instagram.com/legalberries.official"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FA527B] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#FA527B]" />
                <span className="font-mono">legalberries.official</span>
              </a>

              <a
                href="mailto:legalberries.official@gmail.com"
                className="flex items-center gap-2 hover:text-[#E5C067] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E5C067]" />
                <span className="font-mono">legalberries.official@gmail.com</span>
              </a>
            </div>
            <p className="text-[11px] text-[#706687] pt-2">
              Support hours: Mon – Sat, 9:00 AM – 9:00 PM IST
            </p>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright with subtle Admin trigger */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#706687]">
          <p className="max-w-xl text-center md:text-left">
            Disclaimer: Legal Berries provides legal drafting masterclasses and professional educational formats. All templates should be tailored to specific facts and statutory requirements under applicable High Court and District Court rules.
          </p>

          <div className="flex items-center gap-4 shrink-0">
            <p>© {new Date().getFullYear()} Legal Berries. All rights reserved.</p>
            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="text-[#4E4366] hover:text-[#9E93B5] transition-colors flex items-center gap-1 cursor-pointer"
                title="Environment Admin Access"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
