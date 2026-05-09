/**
 * Matter management utilities including status and budget tracking
 */

export type MatterStatus = 'active' | 'completed' | 'on-hold' | 'closed' | 'pending';

export interface MatterBudget {
  estimatedHours: number;
  hourlyRate: number;
  estimatedTotal: number;
  notToExceed?: number;
}

export interface MatterMetrics {
  totalHours: number;
  totalCost: number;
  totalExpenses: number;
  totalWithExpenses: number;
  percentOfBudget: number;
  remainingBudget: number;
  status: 'on-track' | 'at-risk' | 'over-budget';
}

/**
 * Calculate matter metrics based on time entries and expenses
 */
export function calculateMatterMetrics(
  timeEntries: Array<{ hours: number; minutes: number; rate: number }>,
  expenses: Array<{ amount: number; taxable: boolean }>,
  budget?: MatterBudget
): MatterMetrics {
  // Calculate total hours and cost from time entries
  const totalHours = timeEntries.reduce((sum, e) => sum + e.hours + e.minutes / 60, 0);
  const totalCost = timeEntries.reduce((sum, e) => sum + (e.hours + e.minutes / 60) * e.rate, 0);

  // Calculate total expenses
  const expenseSubtotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expenseHST = expenses
    .filter(e => e.taxable)
    .reduce((sum, e) => sum + e.amount * 0.13, 0);
  const totalExpenses = expenseSubtotal + expenseHST;

  const totalWithExpenses = totalCost + totalExpenses;

  // Calculate budget metrics
  let percentOfBudget = 0;
  let remainingBudget = 0;
  let status: 'on-track' | 'at-risk' | 'over-budget' = 'on-track';

  if (budget?.notToExceed) {
    percentOfBudget = (totalWithExpenses / budget.notToExceed) * 100;
    remainingBudget = budget.notToExceed - totalWithExpenses;

    if (percentOfBudget > 100) {
      status = 'over-budget';
    } else if (percentOfBudget > 80) {
      status = 'at-risk';
    }
  }

  return {
    totalHours,
    totalCost,
    totalExpenses,
    totalWithExpenses,
    percentOfBudget,
    remainingBudget,
    status
  };
}

/**
 * Get status color for UI display
 */
export function getStatusColor(status: MatterStatus | 'on-track' | 'at-risk' | 'over-budget'): string {
  const colors: Record<string, string> = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    'on-hold': 'bg-amber-100 text-amber-800',
    closed: 'bg-slate-100 text-slate-800',
    pending: 'bg-purple-100 text-purple-800',
    'on-track': 'bg-green-100 text-green-800',
    'at-risk': 'bg-amber-100 text-amber-800',
    'over-budget': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-slate-100 text-slate-800';
}

/**
 * Get status label
 */
export function getStatusLabel(status: MatterStatus | 'on-track' | 'at-risk' | 'over-budget'): string {
  const labels: Record<string, string> = {
    active: 'Active',
    completed: 'Completed',
    'on-hold': 'On Hold',
    closed: 'Closed',
    pending: 'Pending',
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    'over-budget': 'Over Budget'
  };
  return labels[status] || status;
}

/**
 * Estimate matter completion based on hours and budget
 */
export function estimateCompletion(
  currentHours: number,
  estimatedHours: number
): { percentComplete: number; estimatedRemainingHours: number } {
  const percentComplete = (currentHours / estimatedHours) * 100;
  const estimatedRemainingHours = Math.max(0, estimatedHours - currentHours);

  return {
    percentComplete: Math.min(percentComplete, 100),
    estimatedRemainingHours
  };
}
