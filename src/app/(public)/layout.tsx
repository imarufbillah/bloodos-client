/**
 * Public Routes Layout
 * 
 * Route group for public-facing pages that don't require authentication.
 * Includes Navbar and Footer that wrap all public pages.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
