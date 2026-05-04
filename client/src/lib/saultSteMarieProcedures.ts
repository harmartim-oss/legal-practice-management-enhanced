/**
 * Sault Ste. Marie Court Procedures Module
 * Specific procedures, filing requirements, and local rules for Sault Ste. Marie Superior Court
 */

export interface SaultSteMarieProcedure {
  id: string;
  name: string;
  description: string;
  procedureType: 'civil' | 'family' | 'criminal';
  requirements: string[];
  filingDeadline?: number; // in days
  estimatedDuration?: string;
  localRules?: string[];
  forms?: string[];
  fees?: number;
  notes?: string;
}

export interface FilingRequirement {
  id: string;
  name: string;
  description: string;
  requiredDocuments: string[];
  filingMethod: 'in-person' | 'mail' | 'email' | 'efile';
  deadline?: string;
  notes?: string;
}

export interface LocalRule {
  id: string;
  title: string;
  description: string;
  applicableTo: 'civil' | 'family' | 'criminal' | 'all';
  details: string[];
}

// Sault Ste. Marie Civil Procedures
export const SAULT_CIVIL_PROCEDURES: SaultSteMarieProcedure[] = [
  {
    id: 'mortgage-commencement',
    name: 'Mortgage Proceeding Commencement',
    description: 'Starting a mortgage enforcement action in Sault Ste. Marie',
    procedureType: 'civil',
    requirements: [
      'Sault Ste. Marie is a designated place for commencement of mortgage proceedings',
      'Applies to property anywhere in Northeast Region',
      'File statement of claim with court',
      'Serve defendant in accordance with Rules',
    ],
    filingDeadline: 0,
    estimatedDuration: '6-12 months',
    localRules: [
      'File original and 2 copies of statement of claim',
      'Include certificate of pending litigation if applicable',
      'Provide proof of service',
    ],
    forms: ['Statement of Claim', 'Affidavit of Service'],
    notes: 'Sault Ste. Marie is one of seven designated locations for mortgage proceedings in Northeast Region',
  },
  {
    id: 'short-motion-practice',
    name: 'Short Motion Practice',
    description: 'Bringing a motion expected to take one hour or less',
    procedureType: 'civil',
    requirements: [
      'Motion scheduled on regular motions days',
      'Materials served and filed within Rules timelines',
      'Factums optional (subject to court direction)',
      'Associate judges have jurisdiction',
    ],
    filingDeadline: 7,
    estimatedDuration: '1 hour or less',
    localRules: [
      'Contact trial coordinator for scheduling',
      'Provide motion materials at least 7 days before hearing',
      'Appear in person unless otherwise directed',
    ],
    forms: ['Notice of Motion', 'Factum (optional)'],
  },
  {
    id: 'long-motion-practice',
    name: 'Long Motion Practice',
    description: 'Bringing a motion expected to take more than one hour',
    procedureType: 'civil',
    requirements: [
      'Initially made returnable on regular motions list',
      'Parties attend first return date to set timetable',
      'Contact trial coordinator to canvass dates',
      'Judge confirms hearing date at second return date',
      'Factums required',
      'Books of authority required',
    ],
    filingDeadline: 14,
    estimatedDuration: 'More than 1 hour',
    localRules: [
      'Factums limited to 15 pages',
      'Provide motion materials at least 14 days before hearing',
      'Contact trial coordinator: SaultSteMarie.scj.tc@ontario.ca',
      'May only be adjourned by order of judge',
    ],
    forms: ['Notice of Motion', 'Factum (15 pages max)', 'Book of Authorities'],
  },
  {
    id: 'case-conference',
    name: 'Case Conference',
    description: 'Case management conference for civil proceedings',
    procedureType: 'civil',
    requirements: [
      'Scheduled via Calendly',
      'Presumptive mode: Zoom',
      'Associate judges authorized to convene',
      'Associate judges authorized to make orders',
    ],
    estimatedDuration: '30-60 minutes',
    localRules: [
      'Use Calendly: https://calendly.com/saultstemarie-scj',
      'Prepare case summary',
      'Bring client if possible',
      'Discuss resolution opportunities',
    ],
    notes: 'Except construction lien cases (Rule 50.13)',
  },
  {
    id: 'pre-trial-conference',
    name: 'Judicial Pre-Trial Conference',
    description: 'Pre-trial conference to discuss settlement and trial preparation',
    procedureType: 'civil',
    requirements: [
      'Scheduled via Calendly',
      'Presumptive mode: In-person',
      'Counsel and clients should attend',
      'Pre-trial brief (15 pages max) required',
      'Judge/associate judge makes orders if settlement not achieved',
    ],
    filingDeadline: 14,
    estimatedDuration: '1-2 hours',
    localRules: [
      'Use Calendly: https://calendly.com/saultstemarie-scj',
      'File pre-trial brief at least 14 days before hearing',
      'Prepare settlement authority',
      'Bring trial materials',
    ],
    forms: ['Pre-Trial Brief (15 pages max)'],
  },
  {
    id: 'construction-lien',
    name: 'Construction Lien Matter',
    description: 'Construction lien proceedings in Sault Ste. Marie',
    procedureType: 'civil',
    requirements: [
      'Associate judges hear construction lien matters (except exclusive judge jurisdiction)',
      'Motions with reference to associate judge heard by associate judge',
      'Case conferences not subject to associate judge authorization (Rule 50.13)',
    ],
    localRules: [
      'File lien with court',
      'Serve all parties',
      'Comply with Construction Lien Act requirements',
    ],
    notes: 'Special procedures apply - consult local rules',
  },
];

// Sault Ste. Marie Family Procedures
export const SAULT_FAMILY_PROCEDURES: SaultSteMarieProcedure[] = [
  {
    id: 'family-case-conference',
    name: 'Family Case Conference',
    description: 'Case management conference for family proceedings',
    procedureType: 'family',
    requirements: [
      'Scheduled via Calendly',
      'Presumptive mode: Zoom',
      'Discuss resolution opportunities',
      'Establish timetable for next steps',
    ],
    estimatedDuration: '30-45 minutes',
    localRules: [
      'Use Calendly: https://calendly.com/saultstemarie-scj',
      'Prepare family law summary',
      'Bring client',
      'Discuss settlement options',
    ],
  },
  {
    id: 'family-settlement-conference',
    name: 'Family Settlement Conference',
    description: 'Settlement-focused conference for family matters',
    procedureType: 'family',
    requirements: [
      'Scheduled via Calendly',
      'Presumptive mode: In-person',
      'Focus on settlement',
      'Judge facilitates discussion',
    ],
    estimatedDuration: '1-2 hours',
    localRules: [
      'Use Calendly: https://calendly.com/saultstemarie-scj',
      'Prepare settlement proposals',
      'Bring client with settlement authority',
      'Prepare financial disclosure',
    ],
  },
  {
    id: 'family-trial-management',
    name: 'Family Trial Management Conference',
    description: 'Trial preparation conference for family proceedings',
    procedureType: 'family',
    requirements: [
      'Scheduled via Calendly',
      'Presumptive mode: Zoom',
      'Prepare for trial',
      'Confirm trial readiness',
    ],
    estimatedDuration: '30-60 minutes',
    localRules: [
      'Use Calendly: https://calendly.com/saultstemarie-scj',
      'Prepare trial materials',
      'Confirm witness availability',
      'Provide trial brief',
    ],
  },
  {
    id: 'family-bjdr',
    name: 'Binding Judicial Dispute Resolution',
    description: 'Binding resolution process for family matters',
    procedureType: 'family',
    requirements: [
      'Presumptive mode: In-person',
      'Mandatory attendance',
      'Judge makes binding decision',
      'Final resolution mechanism',
    ],
    estimatedDuration: '2-4 hours',
    localRules: [
      'Contact trial coordinator for scheduling',
      'Prepare comprehensive materials',
      'Bring client with settlement authority',
      'Prepare for binding decision',
    ],
  },
];

// Sault Ste. Marie Criminal Procedures
export const SAULT_CRIMINAL_PROCEDURES: SaultSteMarieProcedure[] = [
  {
    id: 'bail-hearing',
    name: 'Bail Hearing',
    description: 'Bail hearing for criminal matters',
    procedureType: 'criminal',
    requirements: [
      'Presumptive mode: In-person',
      'Mandatory attendance',
      'Prepare bail materials',
      'Secure surety if applicable',
    ],
    estimatedDuration: '30-60 minutes',
    localRules: [
      'Appear in person',
      'Bring client',
      'Prepare bail plan',
      'Secure surety if needed',
    ],
  },
  {
    id: 'bail-review',
    name: 'Bail Review/Detention Review',
    description: 'Review of bail conditions or detention order',
    procedureType: 'criminal',
    requirements: [
      'Presumptive mode: In-person',
      'Mandatory attendance',
      'Prepare review materials',
      'Provide new evidence if applicable',
    ],
    estimatedDuration: '30-60 minutes',
    localRules: [
      'Appear in person',
      'Bring client',
      'Prepare review arguments',
      'Provide supporting documentation',
    ],
  },
  {
    id: 'pre-trial-application',
    name: 'Pre-Trial Application',
    description: 'Pre-trial applications in criminal proceedings',
    procedureType: 'criminal',
    requirements: [
      'Presumptive mode: In-person',
      'Mandatory attendance',
      'Prepare application materials',
      'Follow Criminal Procedure Rules',
    ],
    estimatedDuration: '30-90 minutes',
    localRules: [
      'Appear in person',
      'Bring client',
      'Prepare legal arguments',
      'Provide supporting documentation',
    ],
  },
  {
    id: 'trial-readiness',
    name: 'Trial Readiness Hearing',
    description: 'Confirmation of trial readiness',
    procedureType: 'criminal',
    requirements: [
      'Confirm trial readiness',
      'Provide trial brief (15 pages max)',
      'Confirm witness availability',
      'Prepare for trial',
    ],
    filingDeadline: 7,
    estimatedDuration: '15-30 minutes',
    localRules: [
      'File trial brief at least 7 days before hearing',
      'Confirm witness availability',
      'Prepare trial materials',
      'Appear in person',
    ],
    forms: ['Trial Brief (15 pages max)'],
  },
];

// Sault Ste. Marie Filing Requirements
export const SAULT_FILING_REQUIREMENTS: FilingRequirement[] = [
  {
    id: 'statement-of-claim',
    name: 'Statement of Claim',
    description: 'Filing a statement of claim to commence a civil action',
    requiredDocuments: [
      'Original statement of claim',
      '2 copies of statement of claim',
      'Proof of service',
      'Filing fee',
    ],
    filingMethod: 'in-person',
    deadline: 'Within 4 years of cause of action',
    notes: 'File at Sault Ste. Marie Superior Court office',
  },
  {
    id: 'notice-of-motion',
    name: 'Notice of Motion',
    description: 'Filing a notice of motion for court application',
    requiredDocuments: [
      'Notice of motion',
      'Factum (if required)',
      'Book of authorities',
      'Affidavits and exhibits',
      'Proof of service',
    ],
    filingMethod: 'in-person',
    deadline: 'At least 7 days before motion hearing',
    notes: 'Contact trial coordinator for scheduling',
  },
  {
    id: 'factum-filing',
    name: 'Factum Filing',
    description: 'Filing a factum for motion or appeal',
    requiredDocuments: [
      'Factum (15 pages maximum)',
      'Table of contents',
      'Table of authorities',
      'Proof of service',
    ],
    filingMethod: 'in-person',
    deadline: 'At least 7 days before hearing',
    notes: 'Page limit strictly enforced - 15 pages maximum',
  },
  {
    id: 'affidavit-filing',
    name: 'Affidavit Filing',
    description: 'Filing affidavits as evidence',
    requiredDocuments: [
      'Affidavit',
      'Exhibits (if applicable)',
      'Proof of service',
    ],
    filingMethod: 'in-person',
    deadline: 'As required by rules or court order',
    notes: 'Must be sworn before commissioner',
  },
  {
    id: 'pretrial-brief',
    name: 'Pre-Trial Brief Filing',
    description: 'Filing a pre-trial brief before pre-trial conference',
    requiredDocuments: [
      'Pre-trial brief (15 pages maximum)',
      'Proof of service',
    ],
    filingMethod: 'in-person',
    deadline: 'At least 14 days before conference',
    notes: 'Page limit strictly enforced - 15 pages maximum',
  },
];

// Sault Ste. Marie Local Rules
export const SAULT_LOCAL_RULES: LocalRule[] = [
  {
    id: 'page-limits',
    title: 'Document Page Limits',
    description: 'Strict page limits for court documents',
    applicableTo: 'all',
    details: [
      'Factums: 15 pages maximum',
      'Pre-trial briefs: 15 pages maximum',
      'Motion briefs: 15 pages maximum',
      'Trial briefs: 15 pages maximum',
      'Page limit includes table of contents and table of authorities',
      'Failure to comply may result in document not being heard',
    ],
  },
  {
    id: 'calendly-scheduling',
    title: 'Calendly Scheduling System',
    description: 'Use of Calendly for scheduling appearances',
    applicableTo: 'all',
    details: [
      'Calendly link: https://calendly.com/saultstemarie-scj',
      'Used for family case conferences',
      'Used for family settlement conferences',
      'Used for family trial management conferences',
      'Used for civil pre-trial conferences',
      'Scheduling available during business hours',
    ],
  },
  {
    id: 'trial-coordinator-contact',
    title: 'Trial Coordinator Contact',
    description: 'Contact information for trial coordinator',
    applicableTo: 'all',
    details: [
      'Email: SaultSteMarie.scj.tc@ontario.ca',
      'Use for scheduling long motions',
      'Use for special scheduling requests',
      'Use for appearance mode changes',
      'Respond within 2 business days',
    ],
  },
  {
    id: 'appearance-modes',
    title: 'Presumptive Modes of Appearance',
    description: 'Default appearance methods for different proceeding types',
    applicableTo: 'all',
    details: [
      'Family case conferences: Zoom',
      'Family settlement conferences: In-person',
      'Family trial management conferences: Zoom',
      'Family BJDR: In-person',
      'Civil case conferences: Zoom',
      'Civil pre-trial conferences: In-person',
      'Criminal bail hearings: In-person',
      'Criminal pre-trial applications: In-person',
      'Request mode changes by writing to trial coordinator',
    ],
  },
  {
    id: 'motion-practice',
    title: 'Motion Practice Requirements',
    description: 'Requirements for bringing motions',
    applicableTo: 'civil',
    details: [
      'Short motions (≤1 hour): Regular motions days',
      'Long motions (>1 hour): Special date scheduling',
      'Factums optional for short motions',
      'Factums required for long motions',
      'Books of authority required for long motions',
      'Associate judges have jurisdiction for most motions',
      'Contact trial coordinator for scheduling',
    ],
  },
  {
    id: 'service-requirements',
    title: 'Service Requirements',
    description: 'Requirements for serving documents',
    applicableTo: 'all',
    details: [
      'Personal service preferred',
      'Mail service acceptable with proof',
      'Email service by agreement',
      'Proof of service required for all filings',
      'Service must comply with Rules of Civil Procedure',
      'Provide proof of service with all motions',
    ],
  },
];

// Utility Functions

/**
 * Get all Sault Ste. Marie civil procedures
 */
export function getSaultCivilProcedures(): SaultSteMarieProcedure[] {
  return SAULT_CIVIL_PROCEDURES;
}

/**
 * Get all Sault Ste. Marie family procedures
 */
export function getSaultFamilyProcedures(): SaultSteMarieProcedure[] {
  return SAULT_FAMILY_PROCEDURES;
}

/**
 * Get all Sault Ste. Marie criminal procedures
 */
export function getSaultCriminalProcedures(): SaultSteMarieProcedure[] {
  return SAULT_CRIMINAL_PROCEDURES;
}

/**
 * Get procedures by type
 */
export function getSaultProceduresByType(procedureType: 'civil' | 'family' | 'criminal'): SaultSteMarieProcedure[] {
  switch (procedureType) {
    case 'civil':
      return SAULT_CIVIL_PROCEDURES;
    case 'family':
      return SAULT_FAMILY_PROCEDURES;
    case 'criminal':
      return SAULT_CRIMINAL_PROCEDURES;
    default:
      return [];
  }
}

/**
 * Get filing requirements
 */
export function getFilingRequirements(): FilingRequirement[] {
  return SAULT_FILING_REQUIREMENTS;
}

/**
 * Get local rules
 */
export function getLocalRules(): LocalRule[] {
  return SAULT_LOCAL_RULES;
}

/**
 * Get local rules by type
 */
export function getLocalRulesByType(applicableTo: 'civil' | 'family' | 'criminal' | 'all'): LocalRule[] {
  return SAULT_LOCAL_RULES.filter(rule => rule.applicableTo === applicableTo || rule.applicableTo === 'all');
}

/**
 * Get procedure by ID
 */
export function getSaultProcedureById(procedureId: string): SaultSteMarieProcedure | undefined {
  const allProcedures = [
    ...SAULT_CIVIL_PROCEDURES,
    ...SAULT_FAMILY_PROCEDURES,
    ...SAULT_CRIMINAL_PROCEDURES,
  ];
  return allProcedures.find(p => p.id === procedureId);
}

/**
 * Get filing requirement by ID
 */
export function getFilingRequirementById(requirementId: string): FilingRequirement | undefined {
  return SAULT_FILING_REQUIREMENTS.find(r => r.id === requirementId);
}

/**
 * Get local rule by ID
 */
export function getLocalRuleById(ruleId: string): LocalRule | undefined {
  return SAULT_LOCAL_RULES.find(r => r.id === ruleId);
}

/**
 * Check if procedure has page limit
 */
export function hasPageLimit(procedureId: string): boolean {
  const procedure = getSaultProcedureById(procedureId);
  return procedure ? procedure.requirements.some(r => r.includes('15 pages')) : false;
}

/**
 * Get page limit for procedure
 */
export function getPageLimit(procedureId: string): number | null {
  const procedure = getSaultProcedureById(procedureId);
  if (!procedure) return null;

  // Check if any requirement mentions page limit
  const pageReq = procedure.requirements.find(r => r.includes('15 pages'));
  return pageReq ? 15 : null;
}

/**
 * Get trial coordinator contact
 */
export function getTrialCoordinatorContact(): { email: string; calendly: string } {
  return {
    email: 'SaultSteMarie.scj.tc@ontario.ca',
    calendly: 'https://calendly.com/saultstemarie-scj',
  };
}

/**
 * Get court address and contact info
 */
export function getCourtContactInfo(): {
  name: string;
  address: string;
  phone: string;
  email: string;
  calendly: string;
} {
  return {
    name: 'Sault Ste. Marie Superior Court',
    address: '40 Broadway Ave, Sault Ste. Marie, ON P6A 1A1',
    phone: '(705) 945-8000',
    email: 'SaultSteMarie.scj.tc@ontario.ca',
    calendly: 'https://calendly.com/saultstemarie-scj',
  };
}
