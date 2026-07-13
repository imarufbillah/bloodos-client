/**
 * Public Routes Layout
 * 
 * Route group for public-facing pages that don't require authentication.
 * Includes Navbar and Footer from Phase 7a/7b.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
