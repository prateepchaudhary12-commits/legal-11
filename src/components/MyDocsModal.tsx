import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Search,
  Check,
  Copy,
  FolderOpen,
  Filter,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface LegalDocItem {
  id: string;
  title: string;
  category: 'Civil' | 'Criminal' | 'Family' | 'Corporate' | 'Writs' | 'Deeds';
  court: string;
  statute: string;
  format: string;
  description: string;
  snippet: string;
}

const VAULT_DOCUMENTS: LegalDocItem[] = [
  {
    id: 'doc-1',
    title: 'Statutory Demand Notice under Section 138 NI Act',
    category: 'Criminal',
    court: 'Metropolitan Magistrate / Judicial Magistrate First Class',
    statute: 'Sec 138 read with Sec 142 Negotiable Instruments Act, 1881',
    format: 'Word (.docx) + PDF',
    description: 'Mandatory 15-day statutory demand notice for dishonoured cheque with tracking proof template.',
    snippet: `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

TO: [Respondent Name / Firm], Through its Authorized Signatory, [Address]

UNDER INSTRUCTIONS FROM MY CLIENT Mr. [Client Name], I serve upon you this Statutory Demand Notice:
1. That in discharge of your legally enforceable debt, you issued Cheque No. [000000] for INR [Amount] drawn on [Bank Name].
2. That upon presentation, said cheque was dishonoured with remark "FUNDS INSUFFICIENT".
3. You are hereby called upon to pay the outstanding sum within 15 days of receipt of this notice, failing which criminal proceedings under Section 138 NI Act will be instituted.`
  },
  {
    id: 'doc-2',
    title: 'Regular Bail Application under Section 439 CrPC (Sec 483 BNSS)',
    category: 'Criminal',
    court: 'Hon\'ble High Court / Sessions Court',
    statute: 'Section 439 CrPC, 1973 / Section 483 Bharatiya Nagarik Suraksha Sanhita, 2023',
    format: 'Word (.docx) + PDF',
    description: 'Comprehensive regular bail petition citing parity grounds, lack of custodial necessity, and landmark SC judgments.',
    snippet: `IN THE COURT OF SESSIONS JUDGE AT [DISTRICT]
BAIL APPLICATION NO. _____ OF 2026

IN THE MATTER OF:
[Applicant / Accused Name] ... APPLICANT
VERSUS
STATE OF [State Name] ... RESPONDENT / PROSECUTION

APPLICATION UNDER SECTION 439 CrPC (SEC 483 BNSS) FOR GRANT OF REGULAR BAIL IN FIR NO. [00/2026] U/S [Sections IPC/BNS]
1. That the Applicant is an innocent and law-abiding citizen falsely implicated in the present FIR.
2. That investigation is substantially complete, charge-sheet has been submitted, and no custodial interrogation is warranted.
PRAYER: Graciously release the Applicant on regular bail upon furnishing reasonable solvent sureties.`
  },
  {
    id: 'doc-3',
    title: 'Mutual Consent Divorce Petition under Section 13B(1) HMA',
    category: 'Family',
    court: 'Principal Judge, Family Court',
    statute: 'Section 13B(1) Hindu Marriage Act, 1955',
    format: 'Word (.docx) + PDF',
    description: 'First Motion joint divorce petition with full settlement of alimony, Stridhan, and cooling-period waiver grounds.',
    snippet: `IN THE COURT OF THE PRINCIPAL JUDGE, FAMILY COURT AT [CITY]
JOINT PETITION UNDER SECTION 13B(1) OF THE HINDU MARRIAGE ACT, 1955 FOR DISSOLUTION OF MARRIAGE BY MUTUAL CONSENT

1. Marriage solemnized on [Date] at [Place] as per Hindu rites.
2. Parties living separately and apart since [Date - min 1 year] due to irreconcilable differences.
3. All claims regarding permanent alimony, Stridhan, and joint properties stand fully satisfied as per MoU annexed.`
  },
  {
    id: 'doc-4',
    title: 'Maintenance Application under Section 125 CrPC with Asset Affidavit',
    category: 'Family',
    court: 'Family Court / Principal Judicial Magistrate',
    statute: 'Section 125 CrPC / Section 144 BNSS & Rajnesh v. Neha SC directives',
    format: 'Word (.docx) + PDF',
    description: 'Maintenance claim petition for wife and minor children with mandatory Rajnesh v. Neha disclosure affidavit.',
    snippet: `APPLICATION UNDER SECTION 125 CrPC FOR INTERIM AND FINAL MAINTENANCE
1. That the Respondent has deserted the Applicant without reasonable cause despite having monthly income exceeding INR [Amount].
2. Accompanied by standardized Affidavit of Assets & Liabilities strictly compliant with Rajnesh v. Neha (2020) SC ruling.`
  },
  {
    id: 'doc-5',
    title: 'Commercial Suit for Recovery of Money under Order XXXVII CPC',
    category: 'Civil',
    court: 'Commercial Court / District Judge (Commercial)',
    statute: 'Order XXXVII Rule 1 & 2 read with Section 26 Code of Civil Procedure, 1908',
    format: 'Word (.docx) + PDF',
    description: 'Summary suit based on written contracts and unpaid invoices with verification affidavit.',
    snippet: `IN THE COMMERCIAL COURT AT [CITY]
COMMERCIAL SUIT NO. _____ OF 2026

SUMMARY SUIT UNDER ORDER XXXVII CPC FOR RECOVERY OF INR [Amount] ALONG WITH PENDENTE LITE & FUTURE INTEREST
1. That the suit is instituted for recovery of a liquidated debt arising out of a written commercial agreement.`
  },
  {
    id: 'doc-6',
    title: 'Writ Petition under Article 226 of Constitution of India (Mandamus)',
    category: 'Writs',
    court: 'Hon\'ble High Court of Delhi / Respective State High Courts',
    statute: 'Article 226 of the Constitution of India',
    format: 'Word (.docx) + PDF',
    description: 'Writ of Mandamus compelling administrative municipal authorities to perform statutory duties.',
    snippet: `IN THE HIGH COURT OF DELHI AT NEW DELHI
WRIT PETITION (CIVIL) NO. _____ OF 2026

IN THE MATTER OF:
[Petitioner Name] ... PETITIONER
VERSUS
MUNICIPAL CORPORATION / STATE OF NCT OF DELHI ... RESPONDENT

WRIT PETITION UNDER ARTICLE 226 FOR ISSUANCE OF A WRIT OF MANDAMUS
1. Petitioner has made statutory representations dated [Date] which remain arbitrarily unaddressed by Respondent.`
  },
  {
    id: 'doc-7',
    title: 'Comprehensive Master Services Agreement (MSA) with IP Assignment',
    category: 'Corporate',
    court: 'Commercial & Corporate Arbitration',
    statute: 'Indian Contract Act, 1872 & Arbitration & Conciliation Act, 1996',
    format: 'Word (.docx) + PDF',
    description: 'Corporate client agreement detailing SOW deliverables, indemnity procedures, and limitation of liability caps.',
    snippet: `MASTER SERVICES AGREEMENT (MSA)
Between [Client Company] and [Service Provider Pvt Ltd]
1. Services & SOW: Provider shall deliver services specified in attached Statement of Work.
2. Intellectual Property: All deliverables created hereunder shall be Work-For-Hire assigned exclusively to Client.
3. Limitation of Liability: Total liability of either party shall not exceed the aggregate fees paid in the preceding 6 months.`
  },
  {
    id: 'doc-8',
    title: 'General Power of Attorney (GPA) with Special Litigation Powers',
    category: 'Deeds',
    court: 'Sub-Registrar / Court Registry',
    statute: 'Powers of Attorney Act, 1882 & Registration Act, 1908',
    format: 'Word (.docx) + PDF',
    description: 'Bilingual GPA format for appointing attorney in property transactions, court filings, and banking operations.',
    snippet: `GENERAL POWER OF ATTORNEY
KNOW ALL MEN BY THESE PRESENTS that I, [Principal Name], appoint [Attorney Name] as my true and lawful Attorney to represent me before all Courts, Tribunals, Sub-Registrars, and Revenue Authorities.`
  }
];

interface MyDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnrollPrompt: () => void;
}

export const MyDocsModal: React.FC<MyDocsModalProps> = ({ isOpen, onClose, onEnrollPrompt }) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingSnippetDoc, setViewingSnippetDoc] = useState<LegalDocItem | null>(null);

  const categories = ['All', 'Civil', 'Criminal', 'Family', 'Corporate', 'Writs', 'Deeds'];

  const filteredDocs = VAULT_DOCUMENTS.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.statute.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopySnippet = (doc: LegalDocItem) => {
    navigator.clipboard.writeText(doc.snippet);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDoc = (doc: LegalDocItem) => {
    // Generate text blob for instant real download
    const blob = new Blob([`${doc.title}\n${doc.statute}\n${doc.court}\n\n${doc.snippet}\n\n[Provided by Legal Berries - legalberries.official@gmail.com]`], {
      type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_LegalBerries.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1A1333] border border-[#3E2F63] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#140F26] border-b border-[#2E234B]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FA527B]/20 border border-[#FA527B]/40 flex items-center justify-center text-[#FA527B]">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E5C067]">
                Legal Berries Vault
              </span>
              <h3 className="text-base font-serif-title font-bold text-[#F7F2EA]">
                My Docs & Practical Drafts Library
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

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Top Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8E83A6] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, section, or court (e.g. 138, Bail, Divorce, Injunction, MSA)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#140F26] border border-[#3E2F63] rounded-xl text-xs text-[#F7F2EA] placeholder-[#6E6485] focus:outline-none focus:border-[#FA527B]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#E5C067] text-slate-950 font-bold'
                      : 'bg-[#140F26] text-[#A69ABF] hover:text-white border border-[#3E2F63]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Docs Count Banner */}
          <div className="p-3 bg-[#140F26] border border-[#2E234B] rounded-xl flex items-center justify-between text-xs text-[#B5A9CD]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E5C067]" />
              Showing {filteredDocs.length} curated court-tested draft formats
            </span>
            <span className="text-[11px] text-[#FA527B] font-mono">Word (.docx) Ready</span>
          </div>

          {/* Documents Grid / List */}
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-[#140F26] border border-[#2E234B] hover:border-[#3E2F63] rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C067] bg-[#E5C067]/15 px-2 py-0.5 rounded border border-[#E5C067]/30">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-[#8E83A6] font-mono">{doc.statute}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F7F2EA]">{doc.title}</h4>
                  <p className="text-xs text-[#9E93B5] line-clamp-1">{doc.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewingSnippetDoc(doc)}
                    className="py-2 px-3 bg-[#1F1738] hover:bg-[#281E48] text-xs font-medium text-[#C5BAD9] hover:text-white rounded-lg transition-colors border border-[#3A2D5C] flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Text</span>
                  </button>

                  <button
                    onClick={() => handleCopySnippet(doc)}
                    className="py-2 px-3 bg-[#1F1738] hover:bg-[#281E48] text-xs font-medium text-[#C5BAD9] hover:text-white rounded-lg transition-colors border border-[#3A2D5C] flex items-center gap-1"
                  >
                    {copiedId === doc.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadDoc(doc)}
                    className="py-2 px-3.5 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-semibold text-xs rounded-lg hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .docx</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Snippet Preview Drawer / Modal */}
          {viewingSnippetDoc && (
            <div className="p-5 bg-[#0F0B1C] border border-[#342654] rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E234B]">
                <h4 className="text-xs font-bold text-[#E5C067] uppercase tracking-wider">
                  Draft Preview: {viewingSnippetDoc.title}
                </h4>
                <button
                  onClick={() => setViewingSnippetDoc(null)}
                  className="text-xs text-[#8E83A6] hover:text-white"
                >
                  Close Preview
                </button>
              </div>
              <pre className="font-mono text-xs text-[#D8CFE6] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {viewingSnippetDoc.snippet}
              </pre>
            </div>
          )}

          {/* Full Vault Promotion */}
          <div className="p-4 bg-gradient-to-r from-[#21173D] to-[#140F26] border border-[#FA527B]/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FA527B]">
                Need All 3,500+ Categorized Drafts?
              </span>
              <h4 className="text-sm font-serif-title font-bold text-[#F7F2EA] mt-0.5">
                Unlock Complete Legal Drafts Vault @ ₹799
              </h4>
              <p className="text-xs text-[#A99EC0]">
                Civil Suits, Criminal Petitions, High Court Writs, RTI & Conveyancing Deeds.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onEnrollPrompt();
              }}
              className="py-2.5 px-5 bg-gradient-to-r from-[#FA527B] to-[#E13D66] text-white font-bold text-xs rounded-xl hover:opacity-95 transition-opacity shrink-0 shadow-lg shadow-[#FA527B]/20"
            >
              Get Full Vault Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
