import { Course } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'all-legal-drafts-vault',
    title: 'All Legal Drafts: Every Type Master Vault',
    tagline: '3,500+ Court-Ready, Word (.docx) & PDF Drafts for Litigators, Corporate Counsels & Students',
    category: 'Vault',
    duration: 'Lifetime Instant Access & Future Updates',
    currentPrice: 799,
    originalPrice: 4999,
    badge: 'Most Popular · Complete Collection',
    format: 'Instant Digital Download (.DOCX + .PDF) + VIP WhatsApp Vault Group',
    description:
      'The definitive repository of Indian litigation and non-litigation drafting. Contains battle-tested formats used in District Courts, High Courts, and the Supreme Court of India. Fully editable Word documents drafted by senior advocates with precise statutory citations.',
    highlights: [
      '3,500+ 100% editable Microsoft Word (.docx) formats',
      'Civil, Criminal, Matrimonial, High Court Writs & Corporate templates',
      'Updated as per new Criminal Laws (BNS, BNSS, BSA) & procedural rules',
      'Ready-to-use Legal Notices, Affidavits & Vakalatnamas',
      'Immediate access to Legal Berries Draft Vault WhatsApp Group'
    ],
    whatsappGroupLink: 'https://chat.whatsapp.com/LegalBerriesAllDraftsVIPCohort',
    enrolledCount: 1420,
    rating: 4.9,
    reviewsCount: 318,
    sampleDraftName: 'Demand Notice Under Section 138 Negotiable Instruments Act',
    sampleDraftCategory: 'Commercial & Criminal Practice',
    sampleDraftSnippet: `BEFORE THE HON'BLE DISTRICT & SESSIONS COURT / METROPOLITAN MAGISTRATE

LEGAL NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

TO:
M/s [Respondent Name / Firm],
Through its Managing Director / Authorized Signatory,
Address: [Complete Official Address]

UNDER INSTRUCTIONS FROM AND ON BEHALF OF MY CLIENT:
Mr. [Client Name], S/o [Father Name], Residing at [Address] (hereinafter referred to as "My Client"), I hereby serve upon you this Statutory Legal Demand Notice:

1. That you, the Noticee, in discharge of your legally enforceable debt and liability arising out of [Transaction Details / Invoice No. XYZ], issued a Cheque bearing No. [000000] dated [DD/MM/YYYY] for an amount of INR [Amount] drawn on [Bank Name, Branch].

2. That upon presentation by My Client through their banker [Client Bank], the aforementioned cheque was returned unpaid vide Bank Return Memo dated [DD/MM/YYYY] with the remark "FUNDS INSUFFICIENT" / "EXCEEDS ARRANGEMENT".

3. NOW THEREFORE, through this statutory notice, My Client hereby calls upon you to pay the entire outstanding sum of INR [Amount] within FIFTEEN (15) DAYS from the receipt of this notice, failing which My Client shall initiate criminal proceedings under Section 138 of the Negotiable Instruments Act, 1881, along with appropriate civil recovery remedies at your sole risk, cost, and consequence.

DATED: [Date of Issue]
PLACE: [City, State]

[ADV. ADVOCATE NAME]
Advocate, High Court & District Courts
Enrolment No: [D/XXXX/YYYY]`,
    syllabus: [
      {
        dayOrSection: 'Module 01: Civil Pleadings & Injunctions',
        topic: 'Plaints, Written Statements, and Interlocutory Applications under CPC',
        draftDeliverables: [
          'Suit for Recovery of Money under Order XXXVII CPC',
          'Application for Temporary Injunction under Order XXXIX Rule 1 & 2',
          'Written Statement with Counter-Claim and Set-Off pleadings',
          'Execution Petition under Order XXI Rule 11 CPC'
        ],
        keySkill: 'Factual Matrix formulation, Cause of Action articulation & Prayer Clause structuring'
      },
      {
        dayOrSection: 'Module 02: Criminal Complaints & Bail Petitions',
        topic: 'CrPC / BNSS Bail applications, Section 156(3) Petitions & Quashing',
        draftDeliverables: [
          'Regular Bail Application under Sec 437/439 CrPC (Sec 480/483 BNSS)',
          'Anticipatory Bail Application with landmark citation grounds',
          'Application for Registration of FIR under Section 156(3) CrPC',
          'Quashing Petition under Section 482 CrPC before the High Court'
        ],
        keySkill: 'Establishing prima facie case, Liberty arguments & Parity jurisprudence'
      },
      {
        dayOrSection: 'Module 03: Matrimonial & Family Petitions',
        topic: 'Divorce, Maintenance, Domestic Violence & Child Custody',
        draftDeliverables: [
          'Mutual Consent Divorce Petition under Sec 13B Hindu Marriage Act',
          'Contested Divorce Petition citing Cruelty & Desertion (Sec 13)',
          'Maintenance Application under Sec 125 CrPC with Rajnesh v. Neha Affidavit',
          'Domestic Violence Application under Section 12 DV Act 2005'
        ],
        keySkill: 'Standard of proof, Asset disclosure compliance & Urgent interim relief prayers'
      },
      {
        dayOrSection: 'Module 04: High Court Writs & Appeals',
        topic: 'Constitutional Petitions under Article 226 & 227',
        draftDeliverables: [
          'Writ of Mandamus against statutory municipal authority inaction',
          'Writ of Certiorari for quashing arbitrary administrative order',
          'Writ of Habeas Corpus for illegal detention',
          'First Appeal against Decree (RFA) and Second Appeal grounds'
        ],
        keySkill: 'Locus standi, Fundamental rights violation nexus & Alternative remedy exhaustion'
      },
      {
        dayOrSection: 'Module 05: Practical Conveyancing & Deeds',
        topic: 'Agreements, Wills, Power of Attorney & Leases',
        draftDeliverables: [
          'Sale Deed, Gift Deed and Relinquishment Deed formats',
          'General Power of Attorney (GPA) and Special Power of Attorney (SPA)',
          'Last Will and Testament with Codicil templates',
          'Commercial Lease and Residential Rent Agreement with escalation clauses'
        ],
        keySkill: 'Stamp duty calculation, Registration compliance & Title warranty verification'
      }
    ]
  },
  {
    id: 'family-court-7-days',
    title: '7 Days Family Court: Cases & Drafts Masterclass',
    tagline: 'Master Family Law Litigation, Maintenance Calculations, Custody & Quashing in 7 Days',
    category: 'Masterclass',
    duration: '7 Days Live Cohort + Lifetime Recordings',
    currentPrice: 200,
    originalPrice: 1999,
    badge: 'Live Interactive Masterclass',
    format: 'Daily 8:00 PM Live Sessions + Q&A + WhatsApp Cohort Support',
    nextCohortDate: 'Next Batch Starts This Monday',
    description:
      'A practical, case-study-driven masterclass for young litigators, law students, and chamber juniors. Learn to draft bulletproof matrimonial petitions, compute maintenance with statutory asset disclosures, argue child custody, and navigate mediation and settlement deeds.',
    highlights: [
      '7 evening live masterclass sessions with courtroom advocates',
      'Daily practical drafting assignments reviewed by mentors',
      'Ready-to-file family court templates provided after every lecture',
      'Special module on Supreme Court guidelines (Rajnesh v. Neha & Aditi v. Jitesh)',
      'Direct admission into the 7 Days Family Court WhatsApp Cohort'
    ],
    whatsappGroupLink: 'https://chat.whatsapp.com/LegalBerriesFamilyLawBatch7Days',
    enrolledCount: 890,
    rating: 4.95,
    reviewsCount: 204,
    sampleDraftName: 'Mutual Consent Divorce Petition under Section 13B(1) HMA, 1955',
    sampleDraftCategory: 'Family Law Practice',
    sampleDraftSnippet: `IN THE COURT OF THE PRINCIPAL JUDGE, FAMILY COURT AT [DISTRICT / CITY]

PETITION NO. _______ OF 2026

IN THE MATTER OF:
MR. [PETITIONER NO. 1 NAME]
S/o [Father Name], Aged about [XX] Years,
Residing at: [Permanent Address]                    ... PETITIONER NO. 1 / HUSBAND

AND

MS. [PETITIONER NO. 2 NAME]
D/o [Father Name], Aged about [XX] Years,
Residing at: [Permanent Address]                    ... PETITIONER NO. 2 / WIFE

JOINT PETITION UNDER SECTION 13B(1) OF THE HINDU MARRIAGE ACT, 1955 FOR DISSOLUTION OF MARRIAGE BY MUTUAL CONSENT

MOST RESPECTFULLY SHOWETH:
1. That the marriage between Petitioner No. 1 and Petitioner No. 2 was solemnized according to Hindu Rites and Ceremonies on [Date of Marriage] at [Place of Marriage].

2. That the status, age, and place of residence of the parties at the time of marriage and at the time of filing the present petition were as set out in Paragraph 2 herein.

3. That due to temperamental differences, incompatible habits, and mutually irreconcilable lifestyles, the Petitioners have been living separately and apart since [Date of Separation - minimum 1 year], and have not cohabited as husband and wife ever since.

4. That all efforts made by relatives, friends, and independent mediators to reconcile the disputes and effect cohabitation have proved completely futile.

5. That the Petitioners have amicably settled all their claims regarding Stridhan, permanent alimony, maintenance (past, present, and future), and joint properties as detailed in the Memorandum of Understanding dated [DD/MM/YYYY] annexed herewith as ANNEXURE P-3.

PRAYER:
It is therefore respectfully prayed that this Hon'ble Court may graciously be pleased to pass a decree of dissolution of marriage by mutual consent under Section 13B(1) of the Hindu Marriage Act, 1955 in the interest of justice.

PETITIONER NO. 1                                      PETITIONER NO. 2
Through Counsel: [ADV. ADVOCATE NAME]`,
    syllabus: [
      {
        dayOrSection: 'Day 1: Conjugal Rights & Restitution Strategy',
        topic: 'Section 9 HMA Petitions & Framing Effective Defense in Family Court',
        draftDeliverables: [
          'Petition for Restitution of Conjugal Rights (RCR)',
          'Written Statement to Sec 9 highlighting reasonable excuse/cruelty'
        ],
        keySkill: 'Balancing reconciliation defense versus admitting matrimonial desertion'
      },
      {
        dayOrSection: 'Day 2: Divorce Drafting (Mutual Consent vs Contested)',
        topic: 'Section 13B (First & Second Motion) & Section 13 Cruelty grounds',
        draftDeliverables: [
          'Joint Petition under Sec 13B(1) HMA & Application for Waiver of 6-Month Cooling Period (Amardeep Singh ratio)',
          'Contested Divorce Petition under Sec 13(1)(ia) for mental & physical cruelty'
        ],
        keySkill: 'Drafting specific incidents with corroborative WhatsApp/medical records'
      },
      {
        dayOrSection: 'Day 3: Maintenance & Asset Disclosure Affidavits',
        topic: 'Sec 125 CrPC & Sec 24 HMA: Calculating Alimony and Interim Reliefs',
        draftDeliverables: [
          'Application for Interim Maintenance under Sec 125 CrPC',
          'Standardized Comprehensive Affidavit of Assets & Liabilities (Rajnesh v. Neha compliance)'
        ],
        keySkill: 'Unearthing concealed income, bank statements, ITRs, and lifestyle proof'
      },
      {
        dayOrSection: 'Day 4: Protection of Women from Domestic Violence',
        topic: 'Sec 12 DV Act Petitions: Residence, Monetary & Protection Orders',
        draftDeliverables: [
          'Comprehensive Complaint under Sec 12 DV Act 2005',
          'Interim Relief Application under Section 23 DV Act with DIR format'
        ],
        keySkill: 'Drafting shared household rights and domestic incident reports'
      },
      {
        dayOrSection: 'Day 5: Child Custody, Visitation & Guardianship',
        topic: 'Guardians and Wards Act (GWA) & Section 26 HMA',
        draftDeliverables: [
          'Custody Petition under Section 7 & 10 of Guardians and Wards Act, 1890',
          'Interim Application for Weekend Visitation and Video-Call Access'
        ],
        keySkill: 'Formulating "Welfare of the Child is Paramount" factual narratives'
      },
      {
        dayOrSection: 'Day 6: Settlement Deeds & Criminal Quashing',
        topic: 'Drafting Full & Final MoUs, Mediation Agreements & Sec 482 CrPC',
        draftDeliverables: [
          'Master Matrimonial Settlement Agreement & MoU with Indemnity',
          'High Court Petition under Sec 482 CrPC for Quashing Section 498A IPC/BNS'
        ],
        keySkill: 'Ensuring irrevocable mutual waiver of all pending civil & criminal cases'
      },
      {
        dayOrSection: 'Day 7: Courtroom Advocacy & Family Court Procedures',
        topic: 'Cross-Examination Tactics, Registry Scrutiny Checklist & Mock Hearing',
        draftDeliverables: [
          'Family Court Registry Scrutiny Checklist & Index formatting',
          'Standard Cross-Examination Question Matrix for Maintenance & Cruelty'
        ],
        keySkill: 'Passing court scrutiny in first attempt without office objections'
      }
    ]
  },
  {
    id: 'contracts-drafting-7-days',
    title: '7 Days Contract Drafting Masterclass',
    tagline: 'Learn Commercial Contracts Drafting, Risk Allocation, Redlining & Negotiation in 7 Days',
    category: 'Masterclass',
    duration: '7 Days Live Cohort + Daily Teardowns',
    currentPrice: 200,
    originalPrice: 1999,
    badge: 'High Demand · Corporate Practical',
    format: 'Daily 7:00 PM Live Workshop + Clause Library + WhatsApp Cohort',
    nextCohortDate: 'Next Batch Starts This Thursday',
    description:
      'Step into the shoes of a corporate legal counsel. Demystify commercial agreements, Master Service Agreements (MSAs), NDAs, IP Assignment, Indemnities, and Limitation of Liability. Learn real-world contract anatomy, redlining in Word, and risk mitigation.',
    highlights: [
      '7 evening live drafting workshops with corporate legal counsels',
      'Daily hands-on clause redlining and negotiation exercises',
      '50+ editable commercial clause library (Indemnity, IP, Non-Compete)',
      'Practical compliance with Indian Contract Act, 1872 & Specific Relief Act',
      'Direct admission into the 7 Days Contract Drafting WhatsApp Cohort'
    ],
    whatsappGroupLink: 'https://chat.whatsapp.com/LegalBerriesContractDraftingCohort',
    enrolledCount: 1150,
    rating: 4.92,
    reviewsCount: 260,
    sampleDraftName: 'Mutual Non-Disclosure & Confidentiality Agreement (NDA)',
    sampleDraftCategory: 'Corporate Commercial Drafting',
    sampleDraftSnippet: `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS MUTUAL NON-DISCLOSURE AGREEMENT (the "Agreement") is entered into on this ____ day of __________, 2026, by and between:

PARTY A: [Company Name A], a private limited company incorporated under the Companies Act, 2013, having its registered office at [Address] (hereinafter referred to as the "Disclosing Party" / "Receiving Party");
AND
PARTY B: [Company Name B / Individual], having its registered office/residence at [Address] (hereinafter referred to as the "Receiving Party" / "Disclosing Party").

WHEREAS, the Parties wish to explore a potential business relationship concerning [State Purpose, e.g. software development & legal advisory services] (the "Authorized Purpose").

NOW, THEREFORE, IN CONSIDERATION OF THE MUTUAL COVENANTS CONTAINED HEREIN:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" shall mean all non-public, proprietary information disclosed directly or indirectly by either Party, whether oral, written, visual, or digital, including but not limited to business plans, financial projections, software source code, customer lists, and contractual terms.

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees:
(a) To hold the Confidential Information in strict confidence, applying at least the same degree of care as it uses for its own confidential material, but in no event less than reasonable care;
(b) Not to use the Confidential Information for any purpose other than the Authorized Purpose;
(c) Not to disclose such information to any third party without prior written consent, except to its employees, legal advisors, and consultants on a need-to-know basis who are bound by confidentiality obligations.

3. INDEMNIFICATION & EQUITABLE RELIEF
The Receiving Party acknowledges that monetary damages may be inadequate in the event of an unauthorized disclosure, and the Disclosing Party shall be entitled to seek injunctive relief before courts of competent jurisdiction in [City, State] without the necessity of posting a bond.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.

FOR PARTY A:                              FOR PARTY B:
Name: ____________________                 Name: ____________________
Title: Authorized Signatory                Title: Authorized Signatory`,
    syllabus: [
      {
        dayOrSection: 'Day 1: Anatomy of Commercial Contracts',
        topic: 'Preamble, Recitals, Definitions, Operative Clauses & Boilerplate',
        draftDeliverables: [
          'Master Preamble & Recitals Architecture Framework',
          'Standard Interpretation & Definition Clause Matrix'
        ],
        keySkill: 'Translating business handshake terms into precise legal enforceability'
      },
      {
        dayOrSection: 'Day 2: Non-Disclosure & Confidentiality Mastery',
        topic: 'Unilateral vs Mutual NDAs, Residual Knowledge & Non-Circumvention',
        draftDeliverables: [
          'Comprehensive Mutual Non-Disclosure Agreement (MNDA)',
          'Non-Circumvention and Non-Solicitation Covenants'
        ],
        keySkill: 'Carving out standard exclusions (public knowledge, court orders) safely'
      },
      {
        dayOrSection: 'Day 3: Employment, Freelancer & IP Assignment',
        topic: 'Work for Hire, Section 27 Indian Contract Act (Non-Compete Limits)',
        draftDeliverables: [
          'Consultancy & Independent Contractor Agreement with IP Assignment',
          'Employment Offer Agreement with Confidentiality & Non-Poaching covenants'
        ],
        keySkill: 'Navigating statutory void covenants under Sec 27 ICA and protecting trade secrets'
      },
      {
        dayOrSection: 'Day 4: Master Service Agreements (MSA) & SOWs',
        topic: 'Service Level Agreements (SLAs), Milestone Deliverables & Change Orders',
        draftDeliverables: [
          'Full-length Master Services Agreement (MSA) template',
          'Statement of Work (SOW) with acceptance testing and milestone payment schedule'
        ],
        keySkill: 'Structuring cure periods, termination for convenience vs cause'
      },
      {
        dayOrSection: 'Day 5: Risk Clauses: Indemnity, Liability & Damages',
        topic: 'Indemnification Procedures, Limitation of Liability Caps, Liquidated Damages',
        draftDeliverables: [
          'Bilateral Indemnification & Defense Procedure Clause',
          'Aggregate Limitation of Liability Cap & Consequential Damages Exclusion'
        ],
        keySkill: 'Negotiating unlimited liability carve-outs (gross negligence, IP infringement)'
      },
      {
        dayOrSection: 'Day 6: Vendor, Lease & IP Licensing Contracts',
        topic: 'License Grants, Royalty Calculations, Representations & Warranties',
        draftDeliverables: [
          'Software / IP Commercial License Agreement',
          'Commercial Vendor & Supply Procurement Agreement'
        ],
        keySkill: 'Structuring audit rights, breach notices, and survival clauses'
      },
      {
        dayOrSection: 'Day 7: Live Redlining & Clause Negotiation Workshop',
        topic: 'Contract Markups in Word (Track Changes), Clause Battles & Execution',
        draftDeliverables: [
          'Live Negotiation Playbook (Vendor vs Buyer positions)',
          'E-Stamping, Digital Signature (IT Act 2000) & Execution Checklist'
        ],
        keySkill: 'Real-time clause redlining, countering unfavorable terms under pressure'
      }
    ]
  }
];
