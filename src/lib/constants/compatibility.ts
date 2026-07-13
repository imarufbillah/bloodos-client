/**
 * Blood compatibility matrix for BloodOS
 * Mirrors bloodos-server/src/types/shared.ts BLOOD_COMPATIBILITY
 * DO NOT modify independently - keep in sync with server
 */

import { BloodGroup } from "./bloodGroups";

/**
 * Maps each blood group to the blood groups that can donate to it
 * Based on standard blood compatibility rules (Req 2.4)
 */
export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  [BloodGroup.A_POSITIVE]: [
    BloodGroup.A_POSITIVE,
    BloodGroup.A_NEGATIVE,
    BloodGroup.O_POSITIVE,
    BloodGroup.O_NEGATIVE,
  ],
  [BloodGroup.A_NEGATIVE]: [BloodGroup.A_NEGATIVE, BloodGroup.O_NEGATIVE],
  [BloodGroup.B_POSITIVE]: [
    BloodGroup.B_POSITIVE,
    BloodGroup.B_NEGATIVE,
    BloodGroup.O_POSITIVE,
    BloodGroup.O_NEGATIVE,
  ],
  [BloodGroup.B_NEGATIVE]: [BloodGroup.B_NEGATIVE, BloodGroup.O_NEGATIVE],
  [BloodGroup.AB_POSITIVE]: [
    // Universal receiver
    BloodGroup.A_POSITIVE,
    BloodGroup.A_NEGATIVE,
    BloodGroup.B_POSITIVE,
    BloodGroup.B_NEGATIVE,
    BloodGroup.AB_POSITIVE,
    BloodGroup.AB_NEGATIVE,
    BloodGroup.O_POSITIVE,
    BloodGroup.O_NEGATIVE,
  ],
  [BloodGroup.AB_NEGATIVE]: [
    BloodGroup.A_NEGATIVE,
    BloodGroup.B_NEGATIVE,
    BloodGroup.AB_NEGATIVE,
    BloodGroup.O_NEGATIVE,
  ],
  [BloodGroup.O_POSITIVE]: [BloodGroup.O_POSITIVE, BloodGroup.O_NEGATIVE],
  [BloodGroup.O_NEGATIVE]: [BloodGroup.O_NEGATIVE], // Universal donor
};

/**
 * Checks if a donor's blood group is compatible with a recipient's blood group
 * @param donorBloodGroup - Blood group of the potential donor
 * @param recipientBloodGroup - Blood group of the recipient (patient)
 * @returns true if the donor can donate to the recipient
 */
export function isCompatible(
  donorBloodGroup: BloodGroup,
  recipientBloodGroup: BloodGroup
): boolean {
  const compatibleDonors = BLOOD_COMPATIBILITY[recipientBloodGroup];
  return compatibleDonors.includes(donorBloodGroup);
}

/**
 * Gets all blood groups that can donate to a given recipient blood group
 * @param recipientBloodGroup - Blood group of the recipient
 * @returns Array of compatible donor blood groups
 */
export function getCompatibleDonors(
  recipientBloodGroup: BloodGroup
): BloodGroup[] {
  return BLOOD_COMPATIBILITY[recipientBloodGroup];
}

/**
 * Gets all blood groups that a given donor can donate to
 * @param donorBloodGroup - Blood group of the donor
 * @returns Array of compatible recipient blood groups
 */
export function getCompatibleRecipients(
  donorBloodGroup: BloodGroup
): BloodGroup[] {
  return Object.entries(BLOOD_COMPATIBILITY)
    .filter(([_, compatibleDonors]) => compatibleDonors.includes(donorBloodGroup))
    .map(([recipientBloodGroup]) => recipientBloodGroup as BloodGroup);
}
