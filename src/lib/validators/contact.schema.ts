/**
 * Contact Form Validation Schema
 * Mirrors backend validation (Req 19.7) - min 10 char message, required fields, valid email
 */

import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .trim()
    .toLowerCase(),

  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must not exceed 200 characters")
    .trim(),

  // Req 19.7 - Message must be at least 10 characters
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must not exceed 2000 characters")
    .trim(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
