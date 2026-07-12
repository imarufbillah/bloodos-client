/**
 * Central export for all authentication functionality
 * 
 * This module provides:
 * - Authentication hooks (useSession)
 * - Authentication functions (login, logout, register, getSession)
 * - Demo account credentials
 * - Auth client instance
 */

// Export auth client and hooks from auth-client
export { authClient, signIn, signUp, signOut, useSession, getSession } from "../auth-client";

// Export authentication helper functions from auth-helpers
export { 
  login, 
  register, 
  logout, 
  getSession as getCurrentSession, 
  loginWithDemo, 
  DEMO_CREDENTIALS 
} from "../auth-helpers";

// Export types
export type { User, SessionUser, LoginCredentials, RegisterData } from "../../types/auth";
