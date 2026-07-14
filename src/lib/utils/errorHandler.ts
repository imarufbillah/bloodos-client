/**
 * Error Handler Utilities
 * Handles API errors with special handling for banned users
 */

import { toast } from "sonner";

/**
 * Check if an error response indicates a banned/suspended user
 */
export function isBannedError(error: any): boolean {
  if (!error) return false;

  // Check error message for suspension keywords
  const message = error.message || error.toString();
  return (
    message.includes("suspended") ||
    message.includes("banned") ||
    message.includes("Your account has been suspended")
  );
}

/**
 * Handle API errors with automatic redirect for banned users
 * 
 * @param error - The error object from API call
 * @param customMessage - Optional custom error message
 * @returns true if error was handled, false otherwise
 */
export function handleApiError(error: any, customMessage?: string): boolean {
  // Check if user is banned
  if (isBannedError(error)) {
    toast.error("Account Suspended", {
      description: "Your account has been suspended. Redirecting...",
    });

    // Redirect to suspended page after a brief delay
    setTimeout(() => {
      window.location.href = "/suspended";
    }, 1500);

    return true;
  }

  // Show generic error message
  const errorMessage =
    customMessage ||
    error?.message ||
    "An error occurred. Please try again.";

  toast.error(errorMessage);

  return false;
}

/**
 * Extract error message from various error formats
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "An unexpected error occurred";
}
