/**
 * Billing interval utilities for 6-minute increments
 * Standard legal billing practice: time is tracked and billed in 6-minute (0.1 hour) increments
 */

export const BILLING_INTERVAL_MINUTES = 6;
export const BILLING_INTERVAL_HOURS = BILLING_INTERVAL_MINUTES / 60; // 0.1 hours

/**
 * Round time to the nearest 6-minute interval (always round up for billing)
 * @param minutes Total minutes
 * @returns Rounded minutes in 6-minute increments
 */
export function roundToBillingInterval(minutes: number): number {
  const intervals = Math.ceil(minutes / BILLING_INTERVAL_MINUTES);
  return intervals * BILLING_INTERVAL_MINUTES;
}

/**
 * Convert minutes to billable hours (in 6-minute increments)
 * @param minutes Total minutes
 * @returns Billable hours
 */
export function minutesToBillableHours(minutes: number): number {
  const roundedMinutes = roundToBillingInterval(minutes);
  return roundedMinutes / 60;
}

/**
 * Convert hours and minutes to billable hours
 * @param hours Full hours
 * @param minutes Additional minutes
 * @returns Billable hours
 */
export function timeToBillableHours(hours: number, minutes: number): number {
  const totalMinutes = hours * 60 + minutes;
  return minutesToBillableHours(totalMinutes);
}

/**
 * Calculate billable amount based on rate and time
 * @param hourlyRate Rate per hour
 * @param hours Full hours
 * @param minutes Additional minutes
 * @returns Billable amount
 */
export function calculateBillableAmount(hourlyRate: number, hours: number, minutes: number): number {
  const billableHours = timeToBillableHours(hours, minutes);
  return billableHours * hourlyRate;
}

/**
 * Format billable time for display
 * @param hours Full hours
 * @param minutes Additional minutes
 * @returns Formatted string (e.g., "1.2h" or "0.1h")
 */
export function formatBillableTime(hours: number, minutes: number): string {
  const billableHours = timeToBillableHours(hours, minutes);
  return `${billableHours.toFixed(1)}h`;
}

/**
 * Get the next valid billing interval in minutes
 * @param currentMinutes Current minutes
 * @returns Next billing interval in minutes
 */
export function getNextBillingInterval(currentMinutes: number): number {
  return roundToBillingInterval(currentMinutes);
}

/**
 * Validate that time is in valid 6-minute increments
 * @param minutes Total minutes
 * @returns true if valid, false otherwise
 */
export function isValidBillingInterval(minutes: number): boolean {
  return minutes % BILLING_INTERVAL_MINUTES === 0;
}

/**
 * Get suggested time entries for quick entry (common billing intervals)
 */
export const QUICK_TIME_ENTRIES = [
  { label: '6 min', minutes: 6 },
  { label: '15 min', minutes: 12 }, // Rounds to 12 minutes (0.2h)
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hours', minutes: 90 },
  { label: '2 hours', minutes: 120 },
  { label: '3 hours', minutes: 180 },
  { label: '4 hours', minutes: 240 },
];

/**
 * Get billing interval suggestions based on input
 * @param minutes Current minutes entered
 * @returns Array of suggested billing intervals
 */
export function getBillingIntervalSuggestions(minutes: number): Array<{ label: string; minutes: number; billable: number }> {
  const suggestions: Array<{ label: string; minutes: number; billable: number }> = [];
  
  // Current rounded value
  const rounded = roundToBillingInterval(minutes);
  suggestions.push({
    label: `${formatBillableTime(Math.floor(rounded / 60), rounded % 60)} (rounded up)`,
    minutes: rounded,
    billable: rounded / 60
  });

  // Next interval if different
  if (rounded !== minutes) {
    suggestions.push({
      label: `${formatBillableTime(Math.floor(minutes / 60), minutes % 60)} (exact)`,
      minutes: minutes,
      billable: minutes / 60
    });
  }

  return suggestions;
}
