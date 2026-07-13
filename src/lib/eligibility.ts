/**
 * Client-side eligibility calculation utilities
 * Mirrors server-side logic from bloodos-server/src/services/eligibility.service.ts
 * For displaying donor eligibility status without server round-trip (Req 17.9)
 */

import type { BloodGroup } from "@/types/shared";
import { BLOOD_COMPATIBILITY } from "./constants/compatibility";

// Constants from Bangladesh Red Crescent Standards
const MIN_AGE = 18;
const MAX_AGE = 60;
const MIN_WEIGHT_KG = 50;
const COOLDOWN_DAYS = 90;

export interface EligibilityResult {
  eligible: boolean;
  reason?:
    | "age_requirement"
    | "weight_requirement"
    | "cooldown_requirement"
    | "blood_type_incompatible"
    | "no_donation_history";
  daysRemaining?: number;
  message?: string;
}

/**
 * Calculates the number of days since last donation
 * Returns 0 if no donation date provided
 */
export function calculateDaysSinceLastDonation(
  lastDonationDate: string | Date | null
): number {
  if (!lastDonationDate) {
    return 0;
  }

  const donationDate =
    typeof lastDonationDate === "string"
      ? new Date(lastDonationDate)
      : lastDonationDate;
  const now = new Date();
  const diffMs = now.getTime() - donationDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Calculates days remaining until eligible to donate again
 * Returns 0 if already eligible or no donation history
 */
export function calculateCooldownDaysRemaining(
  lastDonationDate: string | Date | null
): number {
  if (!lastDonationDate) {
    return 0;
  }

  const daysSince = calculateDaysSinceLastDonation(lastDonationDate);
  const daysRemaining = COOLDOWN_DAYS - daysSince;

  return Math.max(0, daysRemaining);
}

/**
 * Checks if a blood type is compatible with a requested blood type
 * Uses the compatibility matrix from constants
 */
export function isBloodTypeCompatible(
  donorBloodGroup: BloodGroup,
  requestedBloodGroup: BloodGroup
): boolean {
  const compatibleDonors = BLOOD_COMPATIBILITY[requestedBloodGroup];
  return compatibleDonors.includes(donorBloodGroup);
}

/**
 * Evaluates donor eligibility for a general donation
 * Does NOT check blood type compatibility (use evaluateEligibilityForRequest for that)
 * Checks: cooldown period only (age/weight not available in donor profile)
 */
export function evaluateDonorEligibility(
  lastDonationDate: string | Date | null
): EligibilityResult {
  // No donation history
  if (!lastDonationDate) {
    return {
      eligible: true,
      reason: "no_donation_history",
      message: "No donation history",
    };
  }

  // Check cooldown
  const daysRemaining = calculateCooldownDaysRemaining(lastDonationDate);

  if (daysRemaining > 0) {
    return {
      eligible: false,
      reason: "cooldown_requirement",
      daysRemaining,
      message: `Eligible in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
    };
  }

  // Eligible to donate
  const daysSince = calculateDaysSinceLastDonation(lastDonationDate);
  return {
    eligible: true,
    message: `Last donated ${daysSince} day${daysSince === 1 ? "" : "s"} ago`,
  };
}

/**
 * Evaluates donor eligibility for a specific blood request
 * Checks both cooldown and blood type compatibility
 */
export function evaluateEligibilityForRequest(
  donorBloodGroup: BloodGroup,
  lastDonationDate: string | Date | null,
  requestedBloodGroup: BloodGroup
): EligibilityResult {
  // First check cooldown
  const daysRemaining = calculateCooldownDaysRemaining(lastDonationDate);

  if (daysRemaining > 0) {
    return {
      eligible: false,
      reason: "cooldown_requirement",
      daysRemaining,
      message: `Eligible in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
    };
  }

  // Then check blood compatibility
  if (!isBloodTypeCompatible(donorBloodGroup, requestedBloodGroup)) {
    return {
      eligible: false,
      reason: "blood_type_incompatible",
      message: "Blood type incompatible",
    };
  }

  // Eligible
  return {
    eligible: true,
    message: "Eligible to donate",
  };
}

/**
 * Gets a human-readable message for eligibility status
 */
export function getEligibilityMessage(result: EligibilityResult): string {
  if (result.message) {
    return result.message;
  }

  if (!result.eligible && result.reason) {
    switch (result.reason) {
      case "cooldown_requirement":
        return result.daysRemaining
          ? `Eligible in ${result.daysRemaining} day${result.daysRemaining === 1 ? "" : "s"}`
          : "Not yet eligible";
      case "blood_type_incompatible":
        return "Blood type incompatible";
      case "no_donation_history":
        return "No donation history";
      default:
        return "Not eligible";
    }
  }

  return result.eligible ? "Eligible to donate" : "Not eligible";
}

/**
 * Export constants for use in components
 */
export const ELIGIBILITY_CONSTANTS = {
  MIN_AGE,
  MAX_AGE,
  MIN_WEIGHT_KG,
  COOLDOWN_DAYS,
} as const;
