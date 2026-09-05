import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground antialiased selection:bg-crimson/20 selection:text-crimson">
      <Navbar />
      <main className="flex-1 pt-14 pb-16 sm:pt-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
