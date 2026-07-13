/**
 * Request form validation schema
 * Phase 8h - Create Request page
 * Mirrors backend validation from bloodos-server/src/validators/request.validator.ts (Req 7.1-7.12)
 */

import { z } from "zod";
import { BloodGroup, District, Urgency } from "@/types/shared";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DISTRICTS } from "@/lib/constants/districts";

// Phone number regex for Bangladesh format (01XXXXXXXXX - 11 digits)
const PHONE_REGEX = /^01[0-9]{9}$/;

export const createRequestSchema = z.object({
  // Patient Information
  patientName: z
    .string()
    .min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name must not exceed 100 characters")
    .trim(),

  // Medical Information
  bloodGroup: z.enum(BLOOD_GROUPS as [string, ...string[]], {
    message: "Please select a valid blood group",
  }),

  unitsNeeded: z
    .number({
      message: "Units needed must be a number",
    })
    .int("Units must be a whole number")
    .min(1, "At least 1 unit is required")
    .max(10, "Cannot request more than 10 units"),

  // Location Information
  hospitalName: z
    .string()
    .min(3, "Hospital name must be at least 3 characters")
    .max(200, "Hospital name must not exceed 200 characters")
    .trim(),

  hospitalAddress: z
    .string()
    .min(10, "Hospital address must be at least 10 characters")
    .max(500, "Hospital address must not exceed 500 characters")
    .trim(),

  district: z.enum(DISTRICTS as [string, ...string[]], {
    message: "Please select a valid district",
  }),

  // Urgency & Timing
  urgency: z.enum(["critical", "urgent", "moderate"], {
    message: "Please select urgency level",
  }),

  neededByDate: z
    .string()
    .min(1, "Needed by date is required")
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "Needed by date must be today or in the future" }
    ),

  // Contact Information
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(PHONE_REGEX, "Phone must be in format 01XXXXXXXXX (11 digits)"),

  // Additional Information
  additionalNotes: z
    .string()
    .max(1000, "Additional notes must not exceed 1000 characters")
    .trim()
    .optional(),

  // Optional image upload (not yet implemented in backend, prepared for future)
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateRequestFormData = z.infer<typeof createRequestSchema>;

// Form field labels for display
export const FORM_FIELD_LABELS = {
  patientName: "Patient Name",
  bloodGroup: "Blood Group",
  unitsNeeded: "Units Needed",
  hospitalName: "Hospital Name",
  hospitalAddress: "Hospital Address",
  district: "District",
  urgency: "Urgency Level",
  neededByDate: "Needed By Date",
  contactPhone: "Contact Phone",
  additionalNotes: "Additional Notes",
} as const;

// Urgency options for form
export const URGENCY_OPTIONS = [
  {
    value: Urgency.CRITICAL,
    label: "Critical",
    description: "Life-threatening emergency - immediate need",
  },
  {
    value: Urgency.URGENT,
    label: "Urgent",
    description: "Required within 24-48 hours",
  },
  {
    value: Urgency.MODERATE,
    label: "Moderate",
    description: "Scheduled procedure or stable patient",
  },
] as const;
