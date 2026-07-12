/**
 * Extended user model with BloodOS-specific fields
 * Matches the better-auth user schema configuration
 */
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Extended fields
  role: "user" | "admin";
  phone?: string;
  district?: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  isDonor: boolean;
  lastDonationDate?: Date | null;
  dateOfBirth?: Date;
  weight?: number;
}

/**
 * Session user extracted from JWT
 */
export interface SessionUser {
  id: string;
  email: string;
  role: "user" | "admin";
  phone?: string;
  district?: string;
  bloodGroup?: string;
  isDonor: boolean;
  lastDonationDate?: Date | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  district?: string;
  bloodGroup?: string;
  dateOfBirth?: Date;
  weight?: number;
  isDonor?: boolean;
}
