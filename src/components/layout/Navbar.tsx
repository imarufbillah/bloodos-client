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
import { MobileCommandDrawer } from "@/components/layout/MobileCommandDrawer";
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
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface NavLink {
  href: string;
  label: string;
}

const primaryNavLinks: NavLink[] = [
  { href: "/requests", label: "Live Requests" },
  { href: "/donors", label: "Find Donors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 w-full">
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
            {primaryNavLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative inline-flex items-center px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? "text-crimson"
                        : "text-foreground/75 hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full bg-crimson" />
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
                    className="ml-1 inline-flex items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-crimson/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="User menu"
                    onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT)}
                  >
                    <Avatar className="h-8.5 w-8.5 rounded-full border border-border/80 shadow-2xs">
                      {userImage && (
                        <AvatarImage
                          src={userImage}
                          alt={user?.name || "User"}
                        />
                      )}
                      <AvatarFallback className="bg-crimson text-paper font-mono text-xs font-bold">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-72 p-0 rounded-2xl border border-border bg-card shadow-lg overflow-hidden"
                    sideOffset={8}
                  >
                    {/* Tactical Identity Capsule Header */}
                    <div className="border-b border-border/80 bg-muted/25 px-4 py-3.5 space-y-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 shrink-0 border border-border/70">
                          {userImage && (
                            <AvatarImage
                              src={userImage}
                              alt={user?.name || "User"}
                            />
                          )}
                          <AvatarFallback className="bg-crimson text-paper font-mono text-xs font-bold">
                            {getInitials(user?.name, user?.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-heading text-sm font-bold text-foreground leading-tight truncate">
                            {user.name || "Lifesaver"}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Donor Badges Strip */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {user.bloodGroup ? (
                          <Badge
                            variant="outline"
                            className="bg-crimson/10 border-crimson/30 text-crimson font-mono text-[10px] font-bold px-2 py-0.5 gap-1"
                          >
                            <Droplet className="size-2.5 fill-crimson" />
                            <span>{user.bloodGroup}</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-muted text-muted-foreground font-mono text-[10px] px-1.5 py-0"
                          >
                            Blood Group Unset
                          </Badge>
                        )}

                        {user.district && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-card border border-border/60 rounded-md px-1.5 py-0.5">
                            <MapPin className="size-2.5 text-ochre" />
                            <span>{user.district}</span>
                          </span>
                        )}

                        {isAdmin && (
                          <Badge
                            variant="secondary"
                            className="bg-teal/10 text-teal border border-teal/20 text-[10px] font-mono px-1.5 py-0 gap-1 ml-auto"
                          >
                            <Shield className="size-2.5" />
                            ADMIN
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Lifesaver Coordination Links */}
                    <div className="p-1.5 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80">
                        Lifesaver Services
                      </div>
                      <DropdownMenuItem className="p-0 rounded-xl">
                        <Link
                          href="/profile"
                          className="flex w-full items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-foreground hover:text-crimson transition-colors"
                        >
                          <User className="size-4 text-teal shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate">Donor Profile & Cooldown</p>
                          </div>
                          <ChevronRight className="size-3.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0 rounded-xl">
                        <Link
                          href="/requests/manage"
                          className="flex w-full items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-foreground hover:text-crimson transition-colors"
                        >
                          <Heart className="size-4 text-crimson shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate">My Blood Requests</p>
                          </div>
                          <ChevronRight className="size-3.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    {/* Admin Section */}
                    {isAdmin && (
                      <div className="border-t border-border/60 p-1.5 space-y-0.5 bg-muted/10">
                        <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80">
                          Governance
                        </div>
                        <DropdownMenuItem className="p-0 rounded-xl">
                          <Link
                            href="/admin"
                            className="flex w-full items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-foreground hover:text-crimson transition-colors"
                          >
                            <Shield className="size-4 text-crimson shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate">Operations Console</p>
                            </div>
                            <ChevronRight className="size-3.5 text-muted-foreground/50" />
                          </Link>
                        </DropdownMenuItem>
                      </div>
                    )}

                    <DropdownMenuSeparator className="m-0" />

                    {/* Session Sign Out */}
                    <div className="p-1.5">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-destructive cursor-pointer rounded-xl"
                      >
                        <LogOut className="size-4 shrink-0" />
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open mobile command drawer"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <MobileCommandDrawer
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            user={user}
          />
        </div>
      </nav>
    </header>
  );
}
