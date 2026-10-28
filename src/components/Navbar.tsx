import React from 'react';
import { ShieldCheck, Code2, Globe, Lock, Radio } from 'lucide-react';

interface NavbarProps {
  onOpenDeveloperModal: () => void;
  onOpenDomainModal?: () => void;
  onOpenEnrollDefault: () => void;
  customDomain?: string;
  isAdminAuthorized?: boolean;
  onAdminLogout?: () => void;
  onOpenLiveHub?: () => void;
  onlineCount?: number;
  isConnected?: boolean;
  latencyMs?: number | null;
}


export const Navbar: React.FC<NavbarProps> = ({
  onOpenDeveloperModal,
  onOpenDomainModal,
  onOpenEnrollDefault,
  customDomain = 'legalberries.in',
  isAdminAuthorized = false,
  onAdminLogout,
  onOpenLiveHub,
  onlineCount = 1,
  isConnected = false,
  latencyMs = null
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#140F24]/90 backdrop-blur-md border-b border-[#2E234B]">
      {/* Top Bar 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean element) */}
        <a
          href="#"
          className="flex items-center gap-3 text-xl sm:text-2xl font-serif-title font-bold tracking-tight text-[#F7F2EA] whitespace-nowrap shrink-0 group"
        >
          <img
            src="/assets/aistudio/legal-berries-no-name_462d0f0f.jpg"
            alt="Legal Berries Emblem"
            className="w-10 h-10 rounded-lg object-cover border border-[#E5C067]/40 shadow-sm"
          />
          <span className="flex items-center">
            <span>Legal</span>
            <span className="text-[#FA527B] ml-1.5 font-cinzel">Berries</span>
          </span>
        </a>

        {/* Zone 2: 4–5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C5BAD9]">
          <a
            href="#courses"
            className="hover:text-[#FA527B] transition-colors whitespace-nowrap shrink-0"
          >
            Courses & Vault
          </a>
          <a
            href="#curriculum"
            className="hover:text-[#FA527B] transition-colors whitespace-nowrap shrink-0"
          >
            Curriculum
          </a>
          <a
            href="#learning-graph"
            className="hover:text-[#FA527B] transition-colors whitespace-nowrap shrink-0"
          >
            Impact Curve
          </a>
          <a
            href="#reviews"
            className="hover:text-[#FA527B] transition-colors whitespace-nowrap shrink-0"
          >
            Advocate Reviews
          </a>
          <a
            href="#contact"
            className="hover:text-[#FA527B] transition-colors whitespace-nowrap shrink-0"
          >
            Official Channels
          </a>
        </nav>

        {/* Zone 3: Admin controls (Only in authorized environment) & Primary enrollment CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Admin badge - only visible when environment admin authorization is active */}
          {isAdminAuthorized && (
            <div className="flex items-center gap-2 bg-[#E5C067]/10 border border-[#E5C067]/30 rounded-xl px-2.5 py-1">
              <button
                onClick={onOpenDeveloperModal}
                title="Environment Admin Suite Active"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#E5C067] hover:text-white transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E5C067]" />
                <span className="hidden sm:inline">Admin Mode</span>
              </button>

              {/* Developer WebSocket Live Link - only visible to admin */}
              {onOpenLiveHub && (
                <button
                  onClick={onOpenLiveHub}
                  className="hidden md:flex items-center gap-1.5 pl-2 border-l border-[#E5C067]/30 text-[11px] text-[#C5BAD9] hover:text-white transition-colors cursor-pointer"
                  title="Developer WebSocket Engine Monitor"
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">
                    {isConnected ? (latencyMs !== null ? `WS ${latencyMs}ms` : 'WS Live') : 'WS Connecting'}
                  </span>
                </button>
              )}

              {onAdminLogout && (
                <button
                  onClick={onAdminLogout}
                  title="Lock Admin Session"
                  className="text-[10px] text-[#9E93B5] hover:text-[#FA527B] ml-1 pl-1.5 border-l border-[#E5C067]/30 transition-colors cursor-pointer"
                >
                  Lock
                </button>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onOpenEnrollDefault}
            className="py-2.5 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FA527B] to-[#E13D66] rounded-xl hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 shadow-md shadow-[#FA527B]/20 cursor-pointer"
          >
            Enroll in Masterclass
          </button>
        </div>
      </div>
    </header>
  );
};
