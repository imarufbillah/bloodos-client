"use client";

/**
 * Protected routes layout
 * Ensures user is authenticated before accessing protected pages (Req 1.7, 20.2)
 * Redirects unauthenticated users to login
 * Ban checks are handled by API responses (backend checks fresh DB data)
 * Includes Navbar and Footer for authenticated pages
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Don't redirect while loading
    if (isPending) return;

    // Redirect to login if not authenticated (Req 1.7)
    if (!session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Show nothing while checking auth or redirecting
  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
