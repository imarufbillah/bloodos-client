"use client";

/**
 * Admin-only routes layout
 * Ensures user has admin role before accessing admin pages (Req 18.2)
 * Redirects non-admin users to home
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Don't redirect while loading
    if (isPending) return;

    // Redirect to login if not authenticated
    if (!session) {
      router.push("/login");
      return;
    }

    // Redirect to home if not admin (Req 18.2)
    if (session.user.role !== "admin") {
      router.push("/");
    }
  }, [session, isPending, router]);

  // Show nothing while checking auth or redirecting
  if (isPending || !session || session.user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
