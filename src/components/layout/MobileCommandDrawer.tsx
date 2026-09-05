"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Droplet, 
  AlertCircle, 
  Activity, 
  Users, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  ChevronRight, 
  Heart, 
  FileText, 
  Info, 
  PhoneCall, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  ShieldAlert,
  Sliders
} from "lucide-react";
import { useTheme } from "next-themes";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ExtendedUser } from "@/types/auth";
import { authClient } from "@/lib/auth-client";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface MobileCommandDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: ExtendedUser;
  trigger?: React.ReactNode;
}

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

export function MobileCommandDrawer({
  open,
  onOpenChange,
  user,
  trigger,
}: MobileCommandDrawerProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isAdmin = user?.role === "admin";
  const userImage = (user as Record<string, unknown> | undefined)?.image as
    | string
    | null
    | undefined;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      onOpenChange(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger render={trigger as React.ReactElement} />}
      <SheetContent 
        side="bottom" 
        className="max-h-[90dvh] rounded-t-3xl border-t border-border/80 bg-background/98 backdrop-blur-xl p-0 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Tactile Drag Handle */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header Telemetry */}
        <SheetHeader className="px-5 py-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-crimson text-paper shadow-xs">
                <Droplet className="h-4 w-4 fill-paper" />
              </div>
              <span>BloodOS Triage Hub</span>
            </SheetTitle>

            <div className="flex items-center gap-1.5 rounded-full border border-teal/20 bg-teal/5 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-teal">
              <span className="relative flex h-1.5 w-1.5">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
              </span>
              <span>64 DISTRICTS LIVE</span>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Command Canvas */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin">
          {/* Emergency SOS Primary CTA Block */}
          <div className="rounded-2xl border-2 border-crimson/30 bg-crimson/5 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-crimson uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" />
                <span>Emergency Transfusion Triage</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-crimson/15 text-crimson px-1.5 py-0.5 rounded">
                STAT
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Match urgent hospital requirements with verified cooldown-eligible donors across Bangladesh in seconds.
            </p>

            <Link 
              href="/requests/add" 
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.EMERGENCY_SOS);
                onOpenChange(false);
              }} 
              className="block"
            >
              <Button 
                size="lg" 
                className="w-full bg-crimson hover:bg-crimson/90 text-paper font-semibold gap-2 h-11 text-xs sm:text-sm shadow-sm transition-all duration-150 active:scale-[0.98]"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Post Emergency Blood Request</span>
                <ArrowRight className="h-4 w-4 ml-auto opacity-80" />
              </Button>
            </Link>
          </div>

          {/* User Session Identity Capsule (when logged in) */}
          {user ? (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    {userImage && (
                      <AvatarImage src={userImage} alt={user.name || "User"} />
                    )}
                    <AvatarFallback className="bg-crimson text-paper text-xs font-bold">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {user.name || "Lifesaver"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.bloodGroup && (
                  <Badge 
                    variant="outline" 
                    className="font-mono font-bold text-xs bg-crimson/10 text-crimson border-crimson/30 px-2 py-0.5"
                  >
                    {user.bloodGroup}
                  </Badge>
                )}
              </div>

              {/* User Fast Links Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                <Link
                  href="/requests/manage"
                  onClick={() => onOpenChange(false)}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium border transition-colors ${
                    pathname === "/requests/manage"
                      ? "border-crimson bg-crimson/10 text-crimson font-bold"
                      : "border-border/70 bg-muted/40 text-foreground hover:bg-muted"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5 text-crimson shrink-0" />
                  <span>My Requests</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => onOpenChange(false)}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium border transition-colors ${
                    pathname === "/profile"
                      ? "border-crimson bg-crimson/10 text-crimson font-bold"
                      : "border-border/70 bg-muted/40 text-foreground hover:bg-muted"
                  }`}
                >
                  <User className="h-3.5 w-3.5 text-teal shrink-0" />
                  <span>Donor Profile</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => onOpenChange(false)}
                    className="col-span-2 flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold border border-ochre/30 bg-ochre/10 text-ochre hover:bg-ochre/15 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                      <span>Admin Control Center</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">Lifesaver Community</p>
                <p className="text-[11px] text-muted-foreground">Sign in to manage requests & track donations</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/signin" onClick={() => onOpenChange(false)}>
                  <Button variant="outline" size="sm" className="h-9 text-xs font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => onOpenChange(false)}>
                  <Button size="sm" className="h-9 text-xs font-semibold bg-primary text-paper">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Contextual Dual-Track: Emergency Services */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground px-1">
              Emergency & Patient Services
            </div>
            
            <div className="grid grid-cols-1 gap-1.5">
              <Link
                href="/donors"
                onClick={() => onOpenChange(false)}
                className={`flex items-center justify-between rounded-xl p-3 text-xs border transition-all ${
                  pathname === "/donors"
                    ? "border-crimson/40 bg-crimson/5 text-crimson font-semibold"
                    : "border-border/70 bg-card hover:bg-muted/60 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Find Compatible Donors</p>
                    <p className="text-[10px] text-muted-foreground">Search standby donors across 64 districts</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/requests"
                onClick={() => onOpenChange(false)}
                className={`flex items-center justify-between rounded-xl p-3 text-xs border transition-all ${
                  pathname === "/requests"
                    ? "border-crimson/40 bg-crimson/5 text-crimson font-semibold"
                    : "border-border/70 bg-card hover:bg-muted/60 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Live Emergency Requests</p>
                    <p className="text-[10px] text-muted-foreground">Real-time hospital urgent transfusion feed</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/#compatibility"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between rounded-xl p-3 text-xs border border-border/70 bg-card hover:bg-muted/60 text-foreground transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ochre/10 text-ochre">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">ABO/Rh Compatibility Engine</p>
                    <p className="text-[10px] text-muted-foreground">Transfusion rules & 56-day cooldown tool</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          {/* Contextual Dual-Track: Community & Platform */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground px-1">
              Community & Lifesaver Services
            </div>
            
            <div className="grid grid-cols-1 gap-1.5">
              <Link
                href="/privacy"
                onClick={() => onOpenChange(false)}
                className={`flex items-center justify-between rounded-xl p-3 text-xs border transition-all ${
                  pathname === "/privacy"
                    ? "border-crimson/40 bg-crimson/5 text-crimson font-semibold"
                    : "border-border/70 bg-card hover:bg-muted/60 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Privacy & Data Rights</p>
                    <p className="text-[10px] text-muted-foreground">Phone masking, cooldown & zero brokerage</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/about"
                onClick={() => onOpenChange(false)}
                className={`flex items-center justify-between rounded-xl p-3 text-xs border transition-all ${
                  pathname === "/about"
                    ? "border-crimson/40 bg-crimson/5 text-crimson font-semibold"
                    : "border-border/70 bg-card hover:bg-muted/60 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Info className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">About BloodOS</p>
                    <p className="text-[10px] text-muted-foreground">Non-profit mission & national coverage</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/contact"
                onClick={() => onOpenChange(false)}
                className={`flex items-center justify-between rounded-xl p-3 text-xs border transition-all ${
                  pathname === "/contact"
                    ? "border-crimson/40 bg-crimson/5 text-crimson font-semibold"
                    : "border-border/70 bg-card hover:bg-muted/60 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Emergency Contact & Support</p>
                    <p className="text-[10px] text-muted-foreground">24/7 volunteer escalation helpdesk</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="border-t border-border/70 bg-muted/30 px-5 py-3.5 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
          {/* Theme Quick Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Theme:</span>
            <div className="flex items-center rounded-lg border border-border/80 bg-background p-0.5">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${
                  theme === "light" ? "bg-crimson text-paper font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Light mode"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${
                  theme === "dark" ? "bg-crimson text-paper font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Dark mode"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="h-8 text-xs font-semibold text-destructive border-destructive/20 hover:bg-destructive/10 gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
