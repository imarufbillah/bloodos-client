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
  Settings,
  Heart,
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
    <header className="fixed top-0 inset-x-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight transition-colors hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-xl"
        >
          <Droplet
            className="h-5 w-5 text-crimson sm:h-6 sm:w-6"
            aria-hidden="true"
          />
          <span>BloodOS</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-0.5">
            {visibleLinks.slice(0, 5).map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      isActive
                        ? "text-crimson"
                        : "text-foreground/70 hover:text-foreground"
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

          <div className="ml-2 flex items-center gap-1.5">
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
                <NotificationPanel />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="ml-1 rounded-full inline-flex items-center justify-center transition-all hover:ring-2 hover:ring-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="User menu"
                  >
                    <Avatar className="rounded-full">
                      {userImage && (
                        <AvatarImage
                          src={userImage}
                          alt={user?.name || "User"}
                        />
                      )}
                      <AvatarFallback className="bg-crimson text-paper text-xs font-medium">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-0">
                    {/* User info card */}
                    <div className="relative flex items-start gap-3 px-3 pt-3 pb-2">
                      <Avatar className="h-10 w-10">
                        {userImage && (
                          <AvatarImage
                            src={userImage}
                            alt={user?.name || "User"}
                          />
                        )}
                        <AvatarFallback className="bg-crimson text-paper text-xs font-medium">
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
                              className="text-[10px] px-1.5 py-0 gap-1"
                            >
                              <Droplet className="size-2.5" />
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
                          className="flex w-full items-center gap-2"
                        >
                          <User className="size-4 text-muted-foreground" />
                          <span className="flex-1">Profile</span>
                          <ChevronRight className="size-3.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-2.5 py-2">
                        <Link
                          href="/requests/manage"
                          className="flex w-full items-center gap-2"
                        >
                          <Heart className="size-4 text-muted-foreground" />
                          <span className="flex-1">My Requests</span>
                          <ChevronRight className="size-3.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="px-2.5 py-2">
                        <Link
                          href="/profile"
                          className="flex w-full items-center gap-2"
                        >
                          <Settings className="size-4 text-muted-foreground" />
                          <span className="flex-1">Settings</span>
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
                              className="flex w-full items-center gap-2"
                            >
                              <Shield className="size-4 text-muted-foreground" />
                              <span className="flex-1">Admin Dashboard</span>
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
                        className="gap-2.5 px-2.5 py-2 cursor-pointer"
                      >
                        <LogOut className="size-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button size="sm">
                  <Link href="/requests/add">Post a Request</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
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

          {user && <NotificationPanel className="mr-1" />}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className="h-9 w-9 inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-85">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-crimson" />
                  <span>BloodOS</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {user && (
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {userImage && (
                          <AvatarImage
                            src={userImage}
                            alt={user?.name || "User"}
                          />
                        )}
                        <AvatarFallback className="bg-crimson text-paper text-xs font-medium">
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
                          className="text-[10px] px-1.5 py-0 gap-1"
                        >
                          <Droplet className="size-2.5" />
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
                )}

                <nav className="flex flex-col gap-0.5">
                  {visibleLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isActive
                            ? "bg-accent text-crimson"
                            : "text-foreground/70 hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                {user ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-1 w-full justify-start text-destructive hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="mt-1 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/signin">Sign In</Link>
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
