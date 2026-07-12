import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
  plugins: [jwtClient()],
});

// Export auth hooks and functions
export const { 
  signIn, 
  signUp, 
  signOut,
  useSession,
  getSession,
} = authClient;
