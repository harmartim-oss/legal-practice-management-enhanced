/**
 * Pre-defined time entry templates for common legal tasks
 * These help speed up time entry and ensure consistency
 */

export interface TimeEntryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'consultation' | 'research' | 'drafting' | 'correspondence' | 'court' | 'admin' | 'other';
  defaultMinutes: number; // in 6-minute increments
}

export const TIME_ENTRY_TEMPLATES: TimeEntryTemplate[] = [
  // Consultation
  {
    id: 'tpl-1',
    name: 'Client Consultation',
    description: 'Meeting with client to discuss matter',
    category: 'consultation',
    defaultMinutes: 60
  },
  {
    id: 'tpl-2',
    name: 'Telephone Consultation',
    description: 'Phone call with client',
    category: 'consultation',
    defaultMinutes: 30
  },
  {
    id: 'tpl-3',
    name: 'Third Party Consultation',
    description: 'Meeting with third party (expert, other counsel, etc.)',
    category: 'consultation',
    defaultMinutes: 60
  },

  // Research
  {
    id: 'tpl-4',
    name: 'Legal Research',
    description: 'Research case law, statutes, and legal precedents',
    category: 'research',
    defaultMinutes: 120
  },
  {
    id: 'tpl-5',
    name: 'Document Review',
    description: 'Review and analyze client documents',
    category: 'research',
    defaultMinutes: 90
  },
  {
    id: 'tpl-6',
    name: 'File Review',
    description: 'Review file and prepare for next steps',
    category: 'research',
    defaultMinutes: 30
  },

  // Drafting
  {
    id: 'tpl-7',
    name: 'Draft Pleading',
    description: 'Draft statement of claim, defence, or other pleading',
    category: 'drafting',
    defaultMinutes: 180
  },
  {
    id: 'tpl-8',
    name: 'Draft Agreement',
    description: 'Draft contract or agreement',
    category: 'drafting',
    defaultMinutes: 240
  },
  {
    id: 'tpl-9',
    name: 'Draft Letter',
    description: 'Draft correspondence to client or third party',
    category: 'drafting',
    defaultMinutes: 30
  },
  {
    id: 'tpl-10',
    name: 'Draft Motion',
    description: 'Draft motion materials',
    category: 'drafting',
    defaultMinutes: 120
  },

  // Correspondence
  {
    id: 'tpl-11',
    name: 'Correspondence - Client',
    description: 'Send letter or email to client',
    category: 'correspondence',
    defaultMinutes: 12
  },
  {
    id: 'tpl-12',
    name: 'Correspondence - Opposing Counsel',
    description: 'Send letter or email to opposing counsel',
    category: 'correspondence',
    defaultMinutes: 12
  },
  {
    id: 'tpl-13',
    name: 'Correspondence - Court',
    description: 'Send letter or email to court',
    category: 'correspondence',
    defaultMinutes: 12
  },

  // Court
  {
    id: 'tpl-14',
    name: 'Court Appearance',
    description: 'Appearance in court (trial, motion, etc.)',
    category: 'court',
    defaultMinutes: 120
  },
  {
    id: 'tpl-15',
    name: 'Settlement Conference',
    description: 'Attend settlement conference',
    category: 'court',
    defaultMinutes: 90
  },
  {
    id: 'tpl-16',
    name: 'Preparation for Trial',
    description: 'Prepare materials for trial',
    category: 'court',
    defaultMinutes: 180
  },

  // Administrative
  {
    id: 'tpl-17',
    name: 'File Management',
    description: 'Organize and manage file',
    category: 'admin',
    defaultMinutes: 30
  },
  {
    id: 'tpl-18',
    name: 'Billing/Accounting',
    description: 'Time entry and billing administration',
    category: 'admin',
    defaultMinutes: 12
  },
  {
    id: 'tpl-19',
    name: 'Client Communication',
    description: 'Administrative communication with client',
    category: 'admin',
    defaultMinutes: 12
  },
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TimeEntryTemplate['category']): TimeEntryTemplate[] {
  return TIME_ENTRY_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): Array<{ id: string; label: string }> {
  const categories = new Set(TIME_ENTRY_TEMPLATES.map(t => t.category));
  const categoryLabels: Record<string, string> = {
    consultation: 'Consultation',
    research: 'Research',
    drafting: 'Drafting',
    correspondence: 'Correspondence',
    court: 'Court',
    admin: 'Administrative',
    other: 'Other'
  };
  
  return Array.from(categories).map(cat => ({
    id: cat,
    label: categoryLabels[cat] || cat
  }));
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TimeEntryTemplate | undefined {
  return TIME_ENTRY_TEMPLATES.find(t => t.id === id);
}
