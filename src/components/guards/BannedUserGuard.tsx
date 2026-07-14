/**
 * Banned User Guard
 * Redirects banned users to the suspended page when they try to access protected features
 */

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStatus } from "@/hooks/useUserStatus";

interface BannedUserGuardProps {
  children: React.ReactNode;
}

export function BannedUserGuard({ children }: BannedUserGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isBanned, isLoading, isAuthenticated } = useUserStatus();

  useEffect(() => {
    // Don't redirect if already on suspended page (prevent loop)
    if (pathname === "/suspended") {
      return;
    }

    // Only redirect if user is authenticated and banned
    if (!isLoading && isAuthenticated && isBanned) {
      router.push("/suspended");
    }
  }, [isBanned, isLoading, isAuthenticated, pathname, router]);

  // Don't render children if banned (unless already on suspended page)
  if (isBanned && pathname !== "/suspended") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}
