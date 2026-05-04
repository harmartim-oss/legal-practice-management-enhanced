/**
 * Regional Compliance Module for Northeast Ontario
 * Handles all regional court requirements, procedures, and compliance validation
 * for Sault Ste. Marie and surrounding Northeast Ontario courts
 */

export interface RegionalCourt {
  id: string;
  name: string;
  location: string;
  trialCoordinator: string;
  trialCoordinatorEmail: string;
  calendlyLink?: string;
  phone?: string;
  address?: string;
  region: 'northeast' | 'central' | 'east' | 'west' | 'northwest';
}

export interface RegionalProcedure {
  id: string;
  court: string;
  procedureType: 'civil' | 'family' | 'criminal' | 'bankruptcy';
  description: string;
  requirements: string[];
  pageLimit?: number;
  presumptiveMode?: 'in-person' | 'zoom' | 'writing' | 'video';
  specialRequirements?: string[];
}

export interface ComplianceChecklistItem {
  id: string;
  category: string;
  item: string;
  required: boolean;
  completed: boolean;
  notes?: string;
}

export interface RegionalCompliance {
  matterId: string;
  court: RegionalCourt;
  procedureType: 'civil' | 'family' | 'criminal' | 'bankruptcy';
  procedures: RegionalProcedure[];
  checklist: ComplianceChecklistItem[];
  complianceScore: number;
  issues: string[];
  recommendations: string[];
}

// Northeast Ontario Court Locations
export const NORTHEAST_COURTS: RegionalCourt[] = [
  {
    id: 'sault-ste-marie',
    name: 'Sault Ste. Marie Superior Court',
    location: 'Sault Ste. Marie, ON',
    trialCoordinator: 'Trial Coordinator',
    trialCoordinatorEmail: 'SaultSteMarie.scj.tc@ontario.ca',
    calendlyLink: 'https://calendly.com/saultstemarie-scj',
    phone: '(705) 945-8000',
    address: '40 Broadway Ave, Sault Ste. Marie, ON P6A 1A1',
    region: 'northeast',
  },
  {
    id: 'sudbury',
    name: 'Sudbury Superior Court',
    location: 'Sudbury, ON',
    trialCoordinator: 'Trial Coordinator',
    trialCoordinatorEmail: 'Sudbury.SCJ.TC@ontario.ca',
    calendlyLink: 'https://calendly.com/sudbury-scj',
    region: 'northeast',
  },
  {
    id: 'north-bay',
    name: 'North Bay Superior Court',
    location: 'North Bay, ON',
    trialCoordinator: 'Trial Coordinator',
    trialCoordinatorEmail: 'NorthBay.scj.tc@ontario.ca',
    calendlyLink: 'https://calendly.com/northbay-scj',
    region: 'northeast',
  },
  {
    id: 'cochrane-timmins',
    name: 'Cochrane/Timmins Superior Court',
    location: 'Cochrane/Timmins, ON',
    trialCoordinator: 'Trial Coordinator',
    trialCoordinatorEmail: 'Cochrane.SCJ.TC@ontario.ca',
    calendlyLink: 'https://calendly.com/cochrane-scj',
    region: 'northeast',
  },
  {
    id: 'haileybury',
    name: 'Haileybury Superior Court',
    location: 'Haileybury, ON',
    trialCoordinator: 'Trial Coordinator',
    trialCoordinatorEmail: 'Haileybury.scj.tc@ontario.ca',
    region: 'northeast',
  },
  {
    id: 'parry-sound',
    name: 'Parry Sound Superior Court',
    location: 'Parry Sound, ON',
    trialCoordinator: 'Trial Coordinator',
    trialCoordinatorEmail: 'ParrySound.scj.tc@ontario.ca',
    region: 'northeast',
  },
  {
    id: 'gore-bay',
    name: 'Gore Bay/Manitoulin Superior Court',
    location: 'Gore Bay, ON',
    trialCoordinator: 'Trial Coordinator',
    trialCoordinatorEmail: 'GoreBay.SCJ.TC@ontario.ca',
    region: 'northeast',
  },
];

// Regional Procedures for Civil Proceedings
export const CIVIL_PROCEDURES: RegionalProcedure[] = [
  {
    id: 'short-motion',
    court: 'northeast',
    procedureType: 'civil',
    description: 'Short Motion (≤1 hour)',
    requirements: [
      'Expected duration one hour or less',
      'Scheduled on regular motions days',
      'Materials served and filed within Rules of Civil Procedure timelines',
      'Associate judges have jurisdiction',
    ],
    pageLimit: 15,
    specialRequirements: [
      'No special scheduling required',
      'Factums optional',
      'Contact trial coordinator for scheduling',
    ],
  },
  {
    id: 'long-motion',
    court: 'northeast',
    procedureType: 'civil',
    description: 'Long Motion (>1 hour)',
    requirements: [
      'Expected duration more than one hour',
      'Requires special date scheduling',
      'Follow long motion protocol',
      'Factums required',
    ],
    pageLimit: 15,
    specialRequirements: [
      'Initially made returnable on regular motions list',
      'Parties attend first return date to set timetable',
      'Contact trial coordinator to canvass dates',
      'Judge confirms hearing date at second return date',
      'May only be vacated by order of judge',
    ],
  },
  {
    id: 'case-conference',
    court: 'northeast',
    procedureType: 'civil',
    description: 'Case Conference',
    requirements: [
      'Associate judges authorized to convene',
      'Associate judges authorized to make orders',
      'No separate judge order required',
    ],
    presumptiveMode: 'zoom',
    specialRequirements: [
      'Scheduled via Calendly for major locations',
      'Timetable and directions established',
      'Except construction lien cases (Rule 50.13)',
    ],
  },
  {
    id: 'pre-trial-conference',
    court: 'northeast',
    procedureType: 'civil',
    description: 'Judicial Pre-Trial Conference',
    requirements: [
      'Preferred attendance: counsel and clients',
      'Discuss resolution of proceeding',
      'Judge/associate judge orders if settlement not achieved',
    ],
    pageLimit: 15,
    presumptiveMode: 'in-person',
    specialRequirements: [
      'Exchange of Affidavits of Documents',
      'Dates for examinations',
      'Dates for answering undertakings',
      'Timetable established',
    ],
  },
  {
    id: 'mortgage-proceeding',
    court: 'northeast',
    procedureType: 'civil',
    description: 'Mortgage Proceeding',
    requirements: [
      'Designated places for commencement',
      'Applies to property anywhere in Northeast Region',
      'Pursuant to Rule 13.1.01(3)',
    ],
    specialRequirements: [
      'Can be commenced in: North Bay, Parry Sound, Sudbury, Haileybury, Sault Ste. Marie, Cochrane, Gore Bay',
    ],
  },
  {
    id: 'construction-lien',
    court: 'northeast',
    procedureType: 'civil',
    description: 'Construction Lien Matter',
    requirements: [
      'In Sudbury: associate judges hear (except exclusive judge jurisdiction)',
      'Throughout region: motions with reference heard by associate judge',
    ],
    specialRequirements: [
      'Case conferences not subject to associate judge authorization',
      'Rule 50.13 applies',
    ],
  },
];

// Regional Procedures for Family Proceedings
export const FAMILY_PROCEDURES: RegionalProcedure[] = [
  {
    id: 'family-case-conference',
    court: 'northeast',
    procedureType: 'family',
    description: 'Family Case Conference',
    requirements: ['Scheduled via Calendly', 'Presumptive mode: Zoom'],
    presumptiveMode: 'zoom',
    specialRequirements: [
      'Except in Sudbury, where scheduled by Registrar',
      'Discuss resolution opportunities',
    ],
  },
  {
    id: 'family-settlement-conference',
    court: 'northeast',
    procedureType: 'family',
    description: 'Family Settlement Conference',
    requirements: ['Scheduled via Calendly', 'Presumptive mode: In-person'],
    presumptiveMode: 'in-person',
    specialRequirements: [
      'Except in Cochrane and Timmins (Zoom)',
      'Focus on settlement',
    ],
  },
  {
    id: 'family-trial-management',
    court: 'northeast',
    procedureType: 'family',
    description: 'Family Trial Management Conference',
    requirements: ['Scheduled via Calendly', 'Presumptive mode: Zoom'],
    presumptiveMode: 'zoom',
    specialRequirements: [
      'Except those specifically identified as settlement conference focus',
      'Prepare for trial',
    ],
  },
  {
    id: 'family-bjdr',
    court: 'northeast',
    procedureType: 'family',
    description: 'Binding Judicial Dispute Resolution',
    requirements: ['Presumptive mode: In-person', 'Mandatory attendance'],
    presumptiveMode: 'in-person',
    specialRequirements: [
      'Binding decision by judge',
      'Final resolution mechanism',
    ],
  },
];

// Regional Procedures for Criminal Proceedings
export const CRIMINAL_PROCEDURES: RegionalProcedure[] = [
  {
    id: 'bail-hearing',
    court: 'northeast',
    procedureType: 'criminal',
    description: 'Bail Hearing',
    requirements: ['Presumptive mode: In-person'],
    presumptiveMode: 'in-person',
  },
  {
    id: 'bail-review',
    court: 'northeast',
    procedureType: 'criminal',
    description: 'Bail Review/Detention Review',
    requirements: ['Presumptive mode: In-person'],
    presumptiveMode: 'in-person',
  },
  {
    id: 'pre-trial-application',
    court: 'northeast',
    procedureType: 'criminal',
    description: 'Pre-Trial Application',
    requirements: ['Presumptive mode: In-person'],
    presumptiveMode: 'in-person',
  },
  {
    id: 'trial-readiness',
    court: 'northeast',
    procedureType: 'criminal',
    description: 'Trial Readiness Hearing',
    requirements: ['Specific procedures and timelines apply'],
    pageLimit: 15,
    specialRequirements: [
      'Preparation requirements',
      'Confirmation of trial readiness',
    ],
  },
];

// Compliance Validation Functions

/**
 * Get regional court by ID
 */
export function getRegionalCourt(courtId: string): RegionalCourt | undefined {
  return NORTHEAST_COURTS.find(court => court.id === courtId);
}

/**
 * Get all procedures for a specific proceeding type
 */
export function getProceduresByType(procedureType: 'civil' | 'family' | 'criminal' | 'bankruptcy'): RegionalProcedure[] {
  switch (procedureType) {
    case 'civil':
      return CIVIL_PROCEDURES;
    case 'family':
      return FAMILY_PROCEDURES;
    case 'criminal':
      return CRIMINAL_PROCEDURES;
    default:
      return [];
  }
}

/**
 * Validate document page limits
 */
export function validatePageLimit(documentType: string, pageCount: number, procedureType: 'civil' | 'family' | 'criminal'): { valid: boolean; message: string } {
  const procedures = getProceduresByType(procedureType);
  let maxPages = 15; // Default page limit

  for (const proc of procedures) {
    if (proc.pageLimit && proc.description.toLowerCase().includes(documentType.toLowerCase())) {
      maxPages = proc.pageLimit;
      break;
    }
  }

  if (pageCount > maxPages) {
    return {
      valid: false,
      message: `Document exceeds maximum page limit of ${maxPages} pages. Current: ${pageCount} pages.`,
    };
  }

  return {
    valid: true,
    message: `Document complies with page limit (${pageCount}/${maxPages} pages).`,
  };
}

/**
 * Generate compliance checklist for a matter
 */
export function generateComplianceChecklist(
  court: RegionalCourt,
  procedureType: 'civil' | 'family' | 'criminal'
): ComplianceChecklistItem[] {
  const checklist: ComplianceChecklistItem[] = [];
  const procedures = getProceduresByType(procedureType);

  // Basic requirements
  checklist.push({
    id: 'court-location',
    category: 'Basic',
    item: `Court location: ${court.name}`,
    required: true,
    completed: true,
  });

  checklist.push({
    id: 'trial-coordinator',
    category: 'Basic',
    item: `Trial coordinator contact: ${court.trialCoordinatorEmail}`,
    required: true,
    completed: false,
  });

  // Procedure-specific requirements
  for (const proc of procedures) {
    for (const req of proc.requirements) {
      checklist.push({
        id: `${proc.id}-${req.replace(/\s+/g, '-').toLowerCase()}`,
        category: 'Procedures',
        item: `${proc.description}: ${req}`,
        required: true,
        completed: false,
      });
    }

    if (proc.pageLimit) {
      checklist.push({
        id: `${proc.id}-page-limit`,
        category: 'Document Compliance',
        item: `${proc.description} page limit: ${proc.pageLimit} pages`,
        required: true,
        completed: false,
      });
    }

    if (proc.presumptiveMode) {
      checklist.push({
        id: `${proc.id}-appearance-mode`,
        category: 'Appearance',
        item: `${proc.description} presumptive mode: ${proc.presumptiveMode}`,
        required: true,
        completed: false,
      });
    }
  }

  // Calendly requirements
  if (court.calendlyLink) {
    checklist.push({
      id: 'calendly-scheduling',
      category: 'Scheduling',
      item: `Use Calendly for scheduling: ${court.calendlyLink}`,
      required: true,
      completed: false,
    });
  }

  return checklist;
}

/**
 * Calculate compliance score
 */
export function calculateComplianceScore(checklist: ComplianceChecklistItem[]): number {
  if (checklist.length === 0) return 0;

  const completedRequired = checklist.filter(item => item.required && item.completed).length;
  const totalRequired = checklist.filter(item => item.required).length;

  return totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
}

/**
 * Validate motion duration and apply appropriate procedures
 */
export function validateMotionDuration(
  duration: number,
  procedureType: 'civil' | 'family' | 'criminal'
): { motionType: 'short' | 'long'; procedure: RegionalProcedure } {
  const procedures = getProceduresByType(procedureType);

  if (duration <= 60) {
    const shortMotion = procedures.find(p => p.id === 'short-motion');
    return {
      motionType: 'short',
      procedure: shortMotion || procedures[0],
    };
  } else {
    const longMotion = procedures.find(p => p.id === 'long-motion');
    return {
      motionType: 'long',
      procedure: longMotion || procedures[0],
    };
  }
}

/**
 * Get presumptive mode of appearance for a proceeding
 */
export function getPresumptiveMode(
  procedureId: string,
  procedureType: 'civil' | 'family' | 'criminal'
): string {
  const procedures = getProceduresByType(procedureType);
  const procedure = procedures.find(p => p.id === procedureId);
  return procedure?.presumptiveMode || 'in-person';
}

/**
 * Generate compliance report
 */
export function generateComplianceReport(
  matterId: string,
  court: RegionalCourt,
  procedureType: 'civil' | 'family' | 'criminal',
  checklist: ComplianceChecklistItem[]
): RegionalCompliance {
  const procedures = getProceduresByType(procedureType);
  const complianceScore = calculateComplianceScore(checklist);

  const issues: string[] = [];
  const recommendations: string[] = [];

  // Identify incomplete items
  const incompleteItems = checklist.filter(item => item.required && !item.completed);
  if (incompleteItems.length > 0) {
    issues.push(`${incompleteItems.length} compliance items incomplete`);
    recommendations.push('Complete all required compliance checklist items');
  }

  // Score-based recommendations
  if (complianceScore < 50) {
    recommendations.push('Significant compliance issues identified. Review all procedures carefully.');
  } else if (complianceScore < 100) {
    recommendations.push('Some compliance items remain. Ensure all requirements are met before filing.');
  }

  // Procedure-specific recommendations
  if (procedureType === 'civil') {
    recommendations.push('Verify motion duration and apply appropriate short or long motion procedures');
    recommendations.push('Ensure factums comply with 15-page limit');
  }

  if (procedureType === 'family') {
    recommendations.push('Confirm presumptive mode of appearance (Zoom vs. in-person)');
    recommendations.push('Use Calendly for scheduling where available');
  }

  return {
    matterId,
    court,
    procedureType,
    procedures,
    checklist,
    complianceScore,
    issues,
    recommendations,
  };
}

/**
 * Get trial coordinator contact information
 */
export function getTrialCoordinatorContact(courtId: string): { email: string; name: string } | null {
  const court = getRegionalCourt(courtId);
  if (!court) return null;

  return {
    email: court.trialCoordinatorEmail,
    name: court.trialCoordinator,
  };
}

/**
 * Get Calendly link for court
 */
export function getCalendlyLink(courtId: string): string | null {
  const court = getRegionalCourt(courtId);
  return court?.calendlyLink || null;
}

/**
 * Check if court supports Calendly scheduling
 */
export function supportsCalendlyScheduling(courtId: string): boolean {
  const court = getRegionalCourt(courtId);
  return !!court?.calendlyLink;
}

/**
 * Get all Northeast Ontario courts
 */
export function getNortheastCourts(): RegionalCourt[] {
  return NORTHEAST_COURTS;
}

/**
 * Validate regional procedure compliance
 */
export function validateRegionalCompliance(
  court: RegionalCourt,
  procedureType: 'civil' | 'family' | 'criminal',
  documentType: string,
  pageCount: number
): { compliant: boolean; issues: string[]; recommendations: string[] } {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Validate page limits
  const pageValidation = validatePageLimit(documentType, pageCount, procedureType);
  if (!pageValidation.valid) {
    issues.push(pageValidation.message);
    recommendations.push('Condense document content to meet page limits');
  }

  // Validate court location
  if (!court) {
    issues.push('Court location not specified');
    recommendations.push('Select a valid Northeast Ontario court location');
  }

  // Validate procedure type
  const procedures = getProceduresByType(procedureType);
  if (procedures.length === 0) {
    issues.push('No procedures found for specified proceeding type');
    recommendations.push('Verify proceeding type is correct');
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations,
  };
}
