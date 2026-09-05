"use client";

import * as React from "react";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserDto } from "@/types/dto/user.dto";
import {
  Droplet,
  MapPin,
  Shield,
  ShieldCheck,
  Clock,
  Heart,
  Calendar,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface ProfilePassportHeaderProps {
  user: UserDto;
  onUpdateUser: (updatedUser: UserDto) => void;
}

export function ProfilePassportHeader({
  user,
  onUpdateUser,
}: ProfilePassportHeaderProps) {
  const [isTogglingDonor, setIsTogglingDonor] = React.useState(false);

  // 56-day biological cooldown computation (WHO / Bangladesh Red Crescent standard)
  const cooldown = React.useMemo(() => {
    if (!user.lastDonationDate) {
      return {
        isEligible: true,
        daysSince: null,
        daysRemaining: 0,
        progressPercent: 100,
        nextDateFormatted: null,
      };
    }

    try {
      const donationTime = new Date(user.lastDonationDate).getTime();
      if (isNaN(donationTime)) {
        return {
          isEligible: true,
          daysSince: null,
          daysRemaining: 0,
          progressPercent: 100,
          nextDateFormatted: null,
        };
      }

      const now = Date.now();
      const diffMs = now - donationTime;
      const daysSince = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const COOLDOWN_DAYS = 56;
      const isEligible = daysSince >= COOLDOWN_DAYS;
      const daysRemaining = Math.max(0, COOLDOWN_DAYS - daysSince);
      const progressPercent = Math.min(100, Math.round((daysSince / COOLDOWN_DAYS) * 100));
      const nextDate = new Date(donationTime + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

      return {
        isEligible,
        daysSince,
        daysRemaining,
        progressPercent,
        nextDateFormatted: nextDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
    } catch {
      return {
        isEligible: true,
        daysSince: null,
        daysRemaining: 0,
        progressPercent: 100,
        nextDateFormatted: null,
      };
    }
  }, [user.lastDonationDate]);

  // Masked Phone Number (01XXX***XXX)
  const maskedPhone = React.useMemo(() => {
    if (!user.phone || user.phone.length < 5) return "01XXX***XXX";
    const clean = user.phone.replace(/[^0-9]/g, "");
    if (clean.length < 11) return `${clean.slice(0, 5)}***`;
    return `${clean.slice(0, 5)}***${clean.slice(8, 11)}`;
  }, [user.phone]);

  // 1-Tap Donor Availability Switch
  const handleToggleDonor = async () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const newStatus = !user.isDonor;
    setIsTogglingDonor(true);

    // Optimistic Update
    const optimisticUser: UserDto = { ...user, isDonor: newStatus };
    onUpdateUser(optimisticUser);

    try {
      const response = await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ isDonor: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update donor status");
      }

      const updated = await response.json();
      onUpdateUser(updated);
      toast.success(
        newStatus
          ? "You are now active as an Emergency Volunteer Donor!"
          : "Donor status paused. You will not receive emergency dispatch alerts."
      );
    } catch (error) {
      // Rollback
      onUpdateUser(user);
      toast.error("Failed to update donor availability. Please try again.");
    } finally {
      setIsTogglingDonor(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Avatar + Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          <AvatarUpload
            currentImage={user.image}
            userName={user.name}
            userEmail={user.email}
            onAvatarUpdate={(imageUrl) => onUpdateUser({ ...user, image: imageUrl })}
          />

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                {user.name || "Emergency Responder"}
              </h1>

              {user.role === "admin" && (
                <Badge variant="secondary" className="font-mono text-[10px] px-2 py-0.5 gap-1 bg-crimson/10 text-crimson border-crimson/30">
                  <Shield className="h-3 w-3" />
                  <span>ADMIN</span>
                </Badge>
              )}

              <Badge
                variant="outline"
                className={`font-mono text-[10px] px-2 py-0.5 gap-1 ${
                  user.isDonor
                    ? "bg-teal/10 text-teal border-teal/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${user.isDonor ? "bg-teal animate-pulse" : "bg-muted-foreground/60"}`} />
                <span>{user.isDonor ? "ACTIVE DONOR" : "COORDINATOR"}</span>
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground truncate font-mono">
              {user.email}
            </p>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {user.bloodGroup ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-crimson/10 border border-crimson/30 text-crimson font-mono font-bold text-xs">
                  <Droplet className="h-3 w-3 fill-crimson" />
                  <span>{user.bloodGroup}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-xs">
                  Blood Group Pending
                </span>
              )}

              {user.district && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 border border-border text-xs text-foreground/85">
                  <MapPin className="h-3 w-3 text-ochre" />
                  <span>{user.district}, BD</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background border border-border/80 text-[11px] font-mono text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-teal" />
                <span>{maskedPhone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls & Cooldown Gauge */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          {/* 1-Tap Donor Availability Switch Button */}
          <button
            type="button"
            onClick={handleToggleDonor}
            disabled={isTogglingDonor}
            className={`flex items-center justify-between sm:justify-center gap-3 px-4 py-2.5 rounded-xl border font-mono text-xs font-semibold transition-all touch-manipulation active:scale-[0.98] ${
              user.isDonor
                ? "border-teal/50 bg-teal/10 text-teal hover:bg-teal/15"
                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${user.isDonor ? "bg-teal animate-pulse" : "bg-muted-foreground/50"}`} />
              <span>{user.isDonor ? "VOLUNTEER DONOR ACTIVE" : "DONOR STATUS PAUSED"}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${
              user.isDonor ? "border-teal/30 bg-teal/20 text-teal" : "border-border bg-card text-foreground"
            }`}>
              {user.isDonor ? "Online" : "Off"}
            </span>
          </button>

          {/* 56-Day Biological Rest Indicator Badge */}
          <div className="rounded-xl border border-border/70 bg-muted/20 px-3.5 py-2 text-xs space-y-1 w-full sm:w-auto min-w-[220px]">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-crimson" />
                <span>56d Biological Rest</span>
              </span>
              <span className={`font-bold ${cooldown.isEligible ? "text-teal" : "text-ochre"}`}>
                {cooldown.isEligible ? "ELIGIBLE NOW" : `${cooldown.daysRemaining}d left`}
              </span>
            </div>

            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  cooldown.isEligible ? "bg-teal" : "bg-ochre"
                }`}
                style={{ width: `${cooldown.progressPercent}%` }}
              />
            </div>

            {!cooldown.isEligible && cooldown.nextDateFormatted && (
              <p className="text-[10px] text-muted-foreground text-right">
                Next eligible: <strong className="text-foreground">{cooldown.nextDateFormatted}</strong>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
