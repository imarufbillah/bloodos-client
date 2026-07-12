import { authClient } from "./auth-client";
import type { LoginCredentials, RegisterData } from "@/types/auth";

/**
 * Authentication helper functions
 * Wraps better-auth client methods with BloodOS-specific logic
 */

/**
 * Login with email and password
 * JWT token is automatically stored in httpOnly cookies by better-auth
 * 
 * @param credentials - Email and password
 * @returns User session data or error
 */
export async function login(credentials: LoginCredentials) {
  try {
    const result = await authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
    });

    if (result.error) {
      throw new Error(result.error.message || "Login failed");
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Register a new user
 * Sets role="user" by default (enforced server-side)
 * JWT token is automatically stored in httpOnly cookies by better-auth
 * 
 * @param data - Registration data
 * @returns User session data or error
 */
export async function register(data: RegisterData) {
  try {
    const result = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      // Additional fields will be updated via profile endpoint after registration
    });

    if (result.error) {
      throw new Error(result.error.message || "Registration failed");
    }

    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Logout current user
 * Clears JWT token from httpOnly cookies
 */
export async function logout() {
  try {
    await authClient.signOut();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Get current session
 * Retrieves session from httpOnly cookie
 * 
 * @returns Current user session or null if not authenticated
 */
export async function getSession() {
  try {
    const session = await authClient.getSession();
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}

/**
 * Demo account credentials
 * Pre-configured for testing and demonstration
 */
export const DEMO_CREDENTIALS: LoginCredentials = {
  email: "demo@bloodos.app",
  password: "Demo@123",
};

/**
 * Login with demo account
 * Uses pre-configured credentials for quick access
 */
export async function loginWithDemo() {
  return login(DEMO_CREDENTIALS);
}
