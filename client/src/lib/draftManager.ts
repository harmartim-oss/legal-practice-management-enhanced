/**
 * Draft Management System
 * Handles auto-saving and restoring drafts for invoices, bills of costs, and cover letters
 */

export interface InvoiceDraft {
  id: string;
  type: 'invoice';
  invoiceNumber: string;
  additionalNotes: string;
  timeEntryIds: string[];
  clientId: string;
  savedAt: number;
  lastModified: number;
}

export interface BillOfCostsDraft {
  id: string;
  type: 'bill-of-costs';
  billNumber: string;
  additionalNotes: string;
  timeEntryIds: string[];
  clientId: string;
  savedAt: number;
  lastModified: number;
}

export interface CoverLetterDraft {
  id: string;
  type: 'cover-letter';
  content: string;
  clientId: string;
  timeEntryIds: string[];
  savedAt: number;
  lastModified: number;
}

export type Draft = InvoiceDraft | BillOfCostsDraft | CoverLetterDraft;

const DRAFT_STORAGE_KEY = 'legal-practice-drafts';
const DRAFT_EXPIRY_DAYS = 30; // Auto-delete drafts older than 30 days

/**
 * Get all drafts from localStorage
 */
export function getAllDrafts(): Draft[] {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return [];
    
    const drafts = JSON.parse(stored) as Draft[];
    
    // Clean up expired drafts
    const now = Date.now();
    const expiryTime = DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    const validDrafts = drafts.filter(draft => {
      const age = now - draft.savedAt;
      return age < expiryTime;
    });
    
    // Update storage if any drafts were removed
    if (validDrafts.length < drafts.length) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(validDrafts));
    }
    
    return validDrafts;
  } catch (error) {
    console.error('Error reading drafts:', error);
    return [];
  }
}

/**
 * Get drafts of a specific type
 */
export function getDraftsByType(type: Draft['type']): Draft[] {
  return getAllDrafts().filter(draft => draft.type === type);
}

/**
 * Get a specific draft by ID
 */
export function getDraftById(id: string): Draft | undefined {
  return getAllDrafts().find(draft => draft.id === id);
}

/**
 * Save a new draft or update existing one
 */
export function saveDraft(draft: Draft): void {
  try {
    const drafts = getAllDrafts();
    
    // Remove existing draft with same ID if it exists
    const filteredDrafts = drafts.filter(d => d.id !== draft.id);
    
    // Add updated draft
    const updatedDraft = {
      ...draft,
      lastModified: Date.now()
    };
    
    filteredDrafts.push(updatedDraft);
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filteredDrafts));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

/**
 * Delete a specific draft
 */
export function deleteDraft(id: string): void {
  try {
    const drafts = getAllDrafts();
    const filtered = drafts.filter(draft => draft.id !== id);
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting draft:', error);
  }
}

/**
 * Delete all drafts of a specific type
 */
export function deleteAllDraftsByType(type: Draft['type']): void {
  try {
    const drafts = getAllDrafts();
    const filtered = drafts.filter(draft => draft.type !== type);
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting drafts:', error);
  }
}

/**
 * Clear all drafts
 */
export function clearAllDrafts(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing drafts:', error);
  }
}

/**
 * Generate a unique draft ID
 */
export function generateDraftId(type: Draft['type']): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format a timestamp for display
 */
export function formatDraftTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Get draft statistics
 */
export function getDraftStats() {
  const drafts = getAllDrafts();
  
  return {
    total: drafts.length,
    invoices: drafts.filter(d => d.type === 'invoice').length,
    billsOfCosts: drafts.filter(d => d.type === 'bill-of-costs').length,
    coverLetters: drafts.filter(d => d.type === 'cover-letter').length,
    oldestDraft: drafts.length > 0 ? Math.min(...drafts.map(d => d.savedAt)) : null,
    newestDraft: drafts.length > 0 ? Math.max(...drafts.map(d => d.savedAt)) : null
  };
}
