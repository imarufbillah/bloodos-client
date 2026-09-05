"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { useTheme } from "next-themes";
import {
  Menu,
  User,
  LogOut,
  Sun,
  Moon,
  Droplet,
  Shield,
  MapPin,
  ChevronRight,
  Heart,
  AlertCircle,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const publicLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/requests", label: "Live Requests" },
  { href: "/donors", label: "Find Donors" },
  { href: "/about#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const protectedLinks: NavLink[] = [
  { href: "/requests/manage", label: "My Requests", requireAuth: true },
  { href: "/profile", label: "Profile", requireAuth: true },
];

const adminLinks: NavLink[] = [
  { href: "/admin", label: "Admin Panel", adminOnly: true },
];

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const user = session?.user as ExtendedUser | undefined;
  const isAdmin = user?.role === "admin";
  const userImage = (user as Record<string, unknown> | undefined)?.image as
    | string
    | null
    | undefined;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const visibleLinks = React.useMemo(() => {
    const links = [...publicLinks];
    if (user) {
      links.push(...protectedLinks);
      if (isAdmin) links.push(...adminLinks);
    }
    return links;
  }, [user, isAdmin]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <nav className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Brand Logo & Live Emergency Badge */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-foreground transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson text-paper shadow-sm">
              <Droplet className="h-4 w-4 fill-paper" aria-hidden="true" />
            </div>
            <span>BloodOS</span>
          </Link>

          <div className="hidden xl:flex items-center gap-2 border-l border-border/70 pl-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
            </span>
            <span className="font-mono text-[10px] font-semibold text-crimson uppercase tracking-wider">
              Live Network
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {visibleLinks.slice(0, 5).map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative inline-flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? "text-crimson"
                        : "text-foreground/75 hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-crimson" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-3 flex items-center gap-2 border-l border-border/70 pl-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 text-foreground/80 hover:text-foreground"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Emergency Request Button */}
            <Link href="/requests/add">
              <Button
                size="sm"
                className="bg-crimson hover:bg-crimson/90 text-paper font-semibold gap-1.5 shadow-sm h-9 px-3.5"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Emergency SOS</span>
              </Button>
            </Link>

            {/* User Session Profile / Auth */}
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <>
                <NotificationPanel />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="ml-1 rounded-full inline-flex items-center justify-center transition-all hover:ring-2 hover:ring-crimson/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="User menu"
                  >
                    <Avatar className="rounded-full h-8 w-8">
                      {userImage && (
                        <AvatarImage
                          src={userImage}
                          alt={user?.name || "User"}
                        />
                      )}
                      <AvatarFallback className="bg-crimson text-paper text-xs font-bold">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-0">
                    {/* User info card */}
                    <div className="relative flex items-start gap-3 px-3 pt-3 pb-2.5">
                      <Avatar className="h-10 w-10">
                        {userImage && (
                          <AvatarImage
                            src={userImage}
                            alt={user?.name || "User"}
                          />
                        )}
                        <AvatarFallback className="bg-crimson text-paper text-xs font-bold">
                          {getInitials(user?.name, user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                        <p className="text-sm font-semibold leading-tight truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {isAdmin && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 gap-1"
                            >
                              <Shield className="size-2.5" />
                              Admin
                            </Badge>
                          )}
                          {user.bloodGroup && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-crimson/30 text-crimson font-mono font-bold"
                            >
                              <Droplet className="size-2.5 fill-crimson" />
                              {user.bloodGroup}
                            </Badge>
                          )}
                          {user.district && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <MapPin className="size-2.5" />
                              {user.district}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenuSeparator className="mt-0" />

                    {/* Quick actions */}
                    <DropdownMenuGroup className="px-1">
                      <DropdownMenuItem className="px-2.5 py-2">
                        <Link
                          href="/profile"
                          className="flex w-full items-center gap-2 text-xs font-medium"
                        >
                          <User className="size-4 text-muted-foreground" />
                          <span className="flex-1">My Donor Profile</span>
                          <ChevronRight className="size-3.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-2.5 py-2">
                        <Link
                          href="/requests/manage"
                          className="flex w-full items-center gap-2 text-xs font-medium"
                        >
                          <Heart className="size-4 text-muted-foreground" />
                          <span className="flex-1">My Blood Requests</span>
                          <ChevronRight className="size-3.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup className="px-1">
                          <DropdownMenuItem className="px-2.5 py-2">
                            <Link
                              href="/admin"
                              className="flex w-full items-center gap-2 text-xs font-medium"
                            >
                              <Shield className="size-4 text-crimson" />
                              <span className="flex-1 font-semibold text-crimson">Admin Dashboard</span>
                              <ChevronRight className="size-3.5 text-muted-foreground/50" />
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </>
                    )}

                    <DropdownMenuSeparator />

                    {/* Sign out */}
                    <div className="px-1 pb-1">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={handleSignOut}
                        className="gap-2.5 px-2.5 py-2 cursor-pointer text-xs"
                      >
                        <LogOut className="size-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold uppercase tracking-wider"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Header Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 text-foreground/80"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>

          {user && <NotificationPanel className="mr-1" />}

          <Link href="/requests/add">
            <Button
              size="sm"
              className="bg-crimson hover:bg-crimson/90 text-paper font-semibold text-xs h-8 px-2.5 gap-1"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>SOS</span>
            </Button>
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className="h-9 w-9 inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-heading">
                  <Droplet className="h-5 w-5 text-crimson fill-crimson" />
                  <span>BloodOS Emergency</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {user && (
                  <div className="rounded-xl border border-border bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {userImage && (
                          <AvatarImage
                            src={userImage}
                            alt={user?.name || "User"}
                          />
                        )}
                        <AvatarFallback className="bg-crimson text-paper text-xs font-bold">
                          {getInitials(user?.name, user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {user.bloodGroup && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-crimson/30 text-crimson font-mono font-bold"
                        >
                          {user.bloodGroup}
                        </Badge>
                      )}
                      {user.district && (
                        <span className="text-[10px] text-muted-foreground">
                          {user.district}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-1">
                  {visibleLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-crimson/10 text-crimson font-semibold"
                            : "text-foreground/80 hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-2 border-t border-border flex flex-col gap-2">
                  <Link href="/requests/add" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-crimson hover:bg-crimson/90 text-paper font-semibold gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Post Emergency Request</span>
                    </Button>
                  </Link>

                  {user ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-destructive hover:text-destructive gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  ) : (
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
