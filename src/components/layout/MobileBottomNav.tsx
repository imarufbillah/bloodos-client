"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";
import { Home, Heart, Users, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/requests", icon: Heart, label: "Requests" },
    { href: "/donors", icon: Users, label: "Donors" },
    {
      href: user ? "/profile" : "/signin",
      icon: User,
      label: user ? "Profile" : "Sign In",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isActive
                  ? "text-crimson"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-crimson" />
              )}
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
