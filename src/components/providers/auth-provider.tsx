"use client";

/**
 * AuthProvider component
 * 
 * better-auth handles session management internally through its client.
 * This provider serves as a placeholder for future session-related context
 * or can wrap other providers like ThemeProvider, ToastProvider, etc.
 * 
 * JWT tokens are automatically stored in httpOnly cookies by better-auth.
 * Session state is managed via the authClient and useSession hook.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // better-auth doesn't require a provider wrapper
  // The authClient handles session management internally
  return <>{children}</>;
}
