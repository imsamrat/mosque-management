// Utility functions for the application

/**
 * Format number to 2 decimal places
 */
export function formatWeight(weight: number): string {
  return weight.toFixed(2);
}

/**
 * Convert kg to grams
 */
export function kgToGrams(kg: number): number {
  return kg * 1000;
}

/**
 * Convert grams to kg
 */
export function gramsToKg(grams: number): number {
  return grams / 1000;
}

/**
 * Format weight with unit
 */
export function formatWeightWithUnit(grams: number): string {
  if (grams >= 1000) {
    return `${gramsToKg(grams).toFixed(2)} kg`;
  }
  return `${grams.toFixed(0)} gm`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Generate unique ID (alternative to CUID)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation - adjust based on your country format
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Calculate distribution statistics
 */
export interface DistributionStats {
  totalDonated: number;
  totalMembers: number;
  perPersonShare: number;
  completedCount: number;
  pendingCount: number;
  completionPercentage: number;
}

export function calculateDistributionStats(
  totalDonated: number,
  members: Array<{ status: string }>
): DistributionStats {
  const totalMembers = members.length;
  const completedCount = members.filter((m) => m.status === "COMPLETED").length;
  const pendingCount = totalMembers - completedCount;
  const perPersonShare = totalMembers > 0 ? totalDonated / totalMembers : 0;
  const completionPercentage =
    totalMembers > 0 ? (completedCount / totalMembers) * 100 : 0;

  return {
    totalDonated,
    totalMembers,
    perPersonShare,
    completedCount,
    pendingCount,
    completionPercentage,
  };
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
