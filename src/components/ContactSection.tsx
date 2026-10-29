import React, { useState } from 'react';
import { Mail, Instagram, MessageCircle, Send, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !query) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setQuery('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-[#140F24] border-b border-[#2E234B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#E5C067] font-semibold mb-3">
            <span>Official Communications</span>
            <span aria-hidden="true">·</span>
            <span>Reach Out Anytime</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#F7F2EA]">
            Connect with Legal Berries
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#BDB2D3]">
            Have a question regarding course syllabus, offline batch schedules, or institutional law college partnerships?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Direct Official Contact Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Instagram Card */}
            <a
              href="https://instagram.com/legalberries.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-[#1A1333] border border-[#3E2F63] hover:border-[#FA527B] rounded-2xl transition-all group shadow-xl flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FA527B] to-[#FF7B90] flex items-center justify-center text-white shrink-0 shadow-md">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#FA527B] font-semibold block">
                  Official Instagram Channel
                </span>
                <span className="text-base font-bold text-[#F7F2EA] group-hover:text-[#FA527B] transition-colors">
                  @legalberries.in
                </span>
                <p className="text-xs text-[#9E93B5] mt-1">
                  Follow for daily drafting teardowns, landmark High Court citations, and live cohort announcements.
                </p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:legalberries.official@gmail.com"
              className="p-6 bg-[#1A1333] border border-[#3E2F63] hover:border-[#E5C067] rounded-2xl transition-all group shadow-xl flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E5C067] to-[#C7A250] flex items-center justify-center text-slate-950 shrink-0 shadow-md">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#E5C067] font-semibold block">
                  Official Inquiries & Support Email
                </span>
                <span className="text-base font-bold text-[#F7F2EA] group-hover:text-[#E5C067] transition-colors break-all">
                  legalberries.official@gmail.com
                </span>
                <p className="text-xs text-[#9E93B5] mt-1">
                  Tax invoices, bulk chamber licenses, and curriculum collaboration.
                </p>
              </div>
            </a>

            {/* WhatsApp Cohort Support */}
            <div className="p-6 bg-[#16231C] border border-emerald-500/40 rounded-2xl shadow-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-slate-950 shrink-0 shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                  Instant WhatsApp Admission
                </span>
                <span className="text-base font-bold text-[#F7F2EA]">
                  Automated Cohort Invitation
                </span>
                <p className="text-xs text-[#B5CAD9] mt-1">
                  Every enrolled advocate immediately receives a direct WhatsApp group invite token on the checkout screen.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Helpdesk Query Form */}
          <div className="lg:col-span-7 bg-[#1A1333] border border-[#3E2F63] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-serif-title font-bold text-[#F7F2EA]">
                Send an Inquiry to Legal Berries Academic Team
              </h3>
              <p className="text-xs text-[#A99EC0] mt-1">
                Responses typically dispatched within 2 hours by our advocate counseling desk.
              </p>

              {submitted ? (
                <div className="mt-8 p-6 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-base font-serif-title font-bold text-[#F7F2EA]">
                    Inquiry Dispatched!
                  </h4>
                  <p className="text-xs text-emerald-200 mt-1">
                    Thank you. Our academic coordinator will contact you at {email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Adv. Priya Nair"
                        className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@lawchambers.in"
                        className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5BAD9] mb-1">
                      Query or Course Question
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask about batch timings, language mode, Word format compatibility, or customized corporate training..."
                      className="w-full px-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#FA527B] hover:bg-[#E13D66] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FA527B]/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Academic Inquiry</span>
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#2E234B] flex items-center justify-between text-[11px] text-[#7E7299]">
              <span>Direct Hotline: legalberries.official@gmail.com</span>
              <span>Instagram: @legalberries.in</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
