import { z } from "zod";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DISTRICTS } from "@/lib/constants/districts";

// Phone number regex for Bangladesh format (01XXXXXXXXX - 11 digits)
const PHONE_REGEX = /^01[0-9]{9}$/;

/**
 * Profile update schema
 * Only includes fields that can be updated by the user themselves
 * Role cannot be updated (Req 1.10 - admin-only operation)
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),

  phone: z
    .string()
    .regex(PHONE_REGEX, "Phone must be in format 01XXXXXXXXX (11 digits)")
    .optional(),

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

  isDonor: z.boolean().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/**
 * Donation self-report schema (Req 13.8, inferred from plan §0.A)
 * For users to log their donations
 */
export const createDonationSchema = z.object({
  donationDate: z
    .string()
    .min(1, "Donation date is required")
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        // Donation date cannot be in the future
        return date <= today;
      },
      { message: "Donation date cannot be in the future" },
    ),

  bloodGroup: z.enum(BLOOD_GROUPS as [string, ...string[]], {
    message: "Please select a valid blood group",
  }),

  hospitalName: z
    .string()
    .min(3, "Hospital name must be at least 3 characters")
    .max(200, "Hospital name must not exceed 200 characters")
    .trim(),

  district: z.enum(DISTRICTS as [string, ...string[]], {
    message: "Please select a valid district",
  }),
});

export type CreateDonationFormData = z.infer<typeof createDonationSchema>;
