"use client";

/**
 * Admin-only routes layout
 * Ensures user has admin role before accessing admin pages (Req 18.2)
 * Redirects non-admin users to home
 * Includes Navbar and Footer for admin pages
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

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
    const user = session.user as ExtendedUser;
    if (user.role !== "admin") {
      router.push("/");
    }
  }, [session, isPending, router]);

  // Show nothing while checking auth or redirecting
  const adminUser = session?.user as ExtendedUser | undefined;
  if (isPending || !session || adminUser?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
