"use client";

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
      router.push("/signin?callbackUrl=/admin");
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
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-crimson border-t-transparent" />
          <p className="font-mono text-xs text-muted-foreground">
            Verifying administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground antialiased selection:bg-crimson/20 selection:text-crimson">
      <Navbar />
      <main className="flex-1 pt-14 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:pt-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
