/**
 * BloodOS Tactical Haptics Helper
 * Provides graceful micro-vibration feedback on supported touch devices (Web Vibration API).
 * Silently degrades on desktop, iOS Safari, or devices without vibration support.
 */

export function triggerTactileFeedback(pattern: number | readonly number[] | number[] = 15): void {
  if (typeof window === "undefined") return;
  try {
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      // Array.from or slice ensures compatibility if passed a readonly tuple
      const vibrationValue = Array.isArray(pattern) ? Array.from(pattern) : (pattern as number);
      navigator.vibrate(vibrationValue);
    }
  } catch {
    // Graceful no-op on platforms with strict permissions
  }
}

/** Pre-configured haptic patterns for clinical triage interactions */
export const HAPTIC_PATTERNS = {
  /** Light confirmation when toggling chips or filters */
  LIGHT: 10,
  /** Medium tactile click on navigation and selections */
  MEDIUM: 18,
  /** Heavy pulse on destructive/critical confirmations */
  HEAVY: 25,
  /** Urgent triple pulse on Emergency SOS dispatch actions */
  EMERGENCY_SOS: [20, 40, 25] as const,
  /** Success feedback on form completion or request fulfillment */
  SUCCESS: [15, 30, 20, 30, 40] as const,
} as const;
