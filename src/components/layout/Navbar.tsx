"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { useTheme } from "next-themes";
import {
  Bell,
  Menu,
  User,
  LogOut,
  Sun,
  Moon,
  Droplet,
  Shield,
  Settings,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const publicLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/requests", label: "Browse Requests" },
  { href: "/donors", label: "Find Donors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const protectedLinks: NavLink[] = [
  { href: "/requests/add", label: "Post Request", requireAuth: true },
  { href: "/requests/manage", label: "My Requests", requireAuth: true },
  { href: "/profile", label: "Profile", requireAuth: true },
];

const adminLinks: NavLink[] = [
  { href: "/admin", label: "Admin Dashboard", adminOnly: true },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const user = session?.user as ExtendedUser | undefined;
  const isAdmin = user?.role === "admin";

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  // Filter links based on auth state
  const visibleLinks = React.useMemo(() => {
    const links = [...publicLinks];
    if (user) {
      links.push(...protectedLinks);
      if (isAdmin) {
        links.push(...adminLinks);
      }
    }
    return links;
  }, [user, isAdmin]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-semibold tracking-tight transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Droplet className="h-6 w-6 text-crimson" aria-hidden="true" />
          <span>BloodOS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* Navigation Links */}
          <ul className="flex items-center gap-1">
            {visibleLinks.slice(0, 5).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md ${
                    pathname === link.href
                      ? "text-crimson"
                      : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <>
                {/* Notification Panel */}
                <NotificationPanel />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        aria-label="User menu"
                      />
                    }
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-crimson text-paper text-xs font-medium">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <Badge
                            variant="outline"
                            className="mt-1 w-fit text-[10px]"
                          >
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="/profile"
                        className="flex w-full cursor-pointer items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/requests/manage"
                        className="flex w-full cursor-pointer items-center"
                      >
                        <Droplet className="mr-2 h-4 w-4" />
                        <span>My Requests</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem>
                        <Link
                          href="/admin"
                          className="flex w-full cursor-pointer items-center"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm">
                  <Link href="/requests/add">Post a Request</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Theme Toggle Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>

          {user && (
            <NotificationPanel className="mr-2" />
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-crimson" />
                  <span>BloodOS</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {user && (
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-crimson text-paper">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <Badge
                          variant="outline"
                          className="mt-1 w-fit text-[10px]"
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-1">
                  {visibleLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        pathname === link.href
                          ? "bg-accent text-crimson"
                          : "text-foreground/80"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {user ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2 w-full justify-start text-destructive hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="mt-2 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/requests/add">Post a Request</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
