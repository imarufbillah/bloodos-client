/**
 * Extended types for better-auth
 * These types extend the default better-auth user type with BloodOS-specific fields
 */

import { auth } from "@/lib/auth";

export type Session = typeof auth.$Infer.Session;

export interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: "user" | "admin";
  phone?: string;
  district?: string;
  bloodGroup?: string;
  isDonor?: boolean;
  lastDonationDate?: Date | null;
  banned?: boolean;
  banReason?: string | null;
}
