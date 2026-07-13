/**
 * Blood group constants for BloodOS
 * Mirrors bloodos-server/src/types/shared.ts BloodGroup enum
 * DO NOT modify independently - keep in sync with server
 */

export const BloodGroup = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
} as const;

export type BloodGroup = (typeof BloodGroup)[keyof typeof BloodGroup];

export const BLOOD_GROUPS = Object.values(BloodGroup);

// Display labels for UI
export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  [BloodGroup.A_POSITIVE]: "A+",
  [BloodGroup.A_NEGATIVE]: "A-",
  [BloodGroup.B_POSITIVE]: "B+",
  [BloodGroup.B_NEGATIVE]: "B-",
  [BloodGroup.AB_POSITIVE]: "AB+",
  [BloodGroup.AB_NEGATIVE]: "AB-",
  [BloodGroup.O_POSITIVE]: "O+",
  [BloodGroup.O_NEGATIVE]: "O-",
};
