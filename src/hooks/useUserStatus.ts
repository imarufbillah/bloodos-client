/**
 * User Status Hook
 * Provides easy access to user authentication and ban status
 */

"use client";

import { useSession } from "@/lib/auth-client";

export function useUserStatus() {
  const { data: session, isPending } = useSession();

  const isAuthenticated = !!session?.user;
  const isBanned = session?.user?.banned || false;
  const banReason = session?.user?.banReason;
  const isAdmin = session?.user?.role === "admin";
  const isDonor = session?.user?.isDonor || false;

  // User can perform actions if authenticated and not banned
  const canPerformActions = isAuthenticated && !isBanned;

  return {
    isAuthenticated,
    isBanned,
    banReason,
    isAdmin,
    isDonor,
    canPerformActions,
    isLoading: isPending,
    user: session?.user,
  };
}
