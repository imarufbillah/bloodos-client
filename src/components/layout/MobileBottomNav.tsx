"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Home, Heart, Users, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/requests", icon: Heart, label: "Requests" },
    { href: "/donors", icon: Users, label: "Donors" },
    {
      href: session ? "/profile" : "/signin",
      icon: User,
      label: session ? "Profile" : "Sign In",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:hidden">
      <div className="flex h-14 justify-around items-center">
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
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive ? "text-crimson" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
