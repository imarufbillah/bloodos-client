/**
 * Onboarding Validation Schema
 * Phase 8n - Complete donor profile after signup
 * Used to populate Req 1.8 fields (district, bloodGroup, phone, isDonor, lastDonationDate)
 * All fields are optional - user can skip this step
 */

import { z } from "zod";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DISTRICTS } from "@/lib/constants/districts";

// Phone number regex for Bangladesh format (01XXXXXXXXX - 11 digits)
const PHONE_REGEX = /^01[0-9]{9}$/;

/**
 * Onboarding schema
 * All fields optional to allow skipping
 * Validates when provided to ensure data quality
 */
export const onboardingSchema = z.object({
  district: z
    .enum(DISTRICTS as [string, ...string[]], {
      message: "Please select a valid district",
    })
    .optional(),

  bloodGroup: z
    .enum(BLOOD_GROUPS as [string, ...string[]], {
      message: "Please select a valid blood group",
    })
    .optional(),

  phone: z
    .string()
    .regex(PHONE_REGEX, "Phone must be in format 01XXXXXXXXX (11 digits)")
    .optional()
    .or(z.literal("")), // Allow empty string for skipping

  isDonor: z.boolean().default(false),

  lastDonationDate: z
    .string()
    .optional()
    .refine(
      (dateStr) => {
        if (!dateStr) return true; // Optional field
        const date = new Date(dateStr);
        const today = new Date();
        // Donation date cannot be in the future
        return date <= today;
      },
      { message: "Last donation date cannot be in the future" }
    )
    .or(z.literal("")), // Allow empty string for skipping
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
