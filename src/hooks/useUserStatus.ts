/**
 * User Status Hook
 * Provides easy access to user authentication and ban status
 */

"use client";

import { useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";

export function useUserStatus() {
  const { data: session, isPending } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  const isAuthenticated = !!user;
  const isBanned = user?.banned || false;
  const banReason = user?.banReason;
  const isAdmin = user?.role === "admin";
  const isDonor = user?.isDonor || false;

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
