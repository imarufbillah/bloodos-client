"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";
import { Home, Heart, Users, User, PlusCircle } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {/* Home */}
        <Link
          href="/"
          className={`flex min-w-12 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
            pathname === "/"
              ? "text-crimson"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-5 w-5" strokeWidth={pathname === "/" ? 2.5 : 2} />
          <span>Home</span>
        </Link>

        {/* Requests */}
        <Link
          href="/requests"
          className={`flex min-w-12 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
            pathname.startsWith("/requests") && pathname !== "/requests/add"
              ? "text-crimson"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className="h-5 w-5" strokeWidth={pathname.startsWith("/requests") && pathname !== "/requests/add" ? 2.5 : 2} />
          <span>Requests</span>
        </Link>

        {/* Central SOS Action */}
        <Link
          href="/requests/add"
          className="flex -translate-y-3 flex-col items-center justify-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-crimson text-paper shadow-lg shadow-crimson/30 ring-4 ring-background transition-transform active:scale-95">
            <PlusCircle className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-tight text-crimson mt-0.5">
            Post SOS
          </span>
        </Link>

        {/* Donors */}
        <Link
          href="/donors"
          className={`flex min-w-12 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
            pathname.startsWith("/donors")
              ? "text-crimson"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-5 w-5" strokeWidth={pathname.startsWith("/donors") ? 2.5 : 2} />
          <span>Donors</span>
        </Link>

        {/* Profile / Sign In */}
        <Link
          href={user ? "/profile" : "/signin"}
          className={`flex min-w-12 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
            pathname.startsWith("/profile") || pathname.startsWith("/signin")
              ? "text-crimson"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-5 w-5" strokeWidth={pathname.startsWith("/profile") || pathname.startsWith("/signin") ? 2.5 : 2} />
          <span>{user ? "Profile" : "Sign In"}</span>
        </Link>
      </div>
    </nav>
  );
}
