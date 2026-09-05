"use client";

import * as React from "react";
import {
  type BloodGroup,
  BLOOD_GROUPS,
} from "@/types/shared";
import {
  getCompatibleDonors,
  getCompatibleRecipients,
} from "@/lib/constants/compatibility";
import {
  Droplet,
  ShieldCheck,
  MapPin,
  Clock,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SerologicalRadarPreviewProps {
  bloodGroup: string;
  district: string;
  isDonor: boolean;
  phone: string;
  lastDonationDate: string;
  userName?: string;
  currentStep: number;
}

export function SerologicalRadarPreview({
  bloodGroup,
  district,
  isDonor,
  phone,
  lastDonationDate,
  userName = "Volunteer Responder",
}: SerologicalRadarPreviewProps) {
  // Compute compatibility
  const isValidBloodGroup = bloodGroup && BLOOD_GROUPS.includes(bloodGroup as any);
  const compatibleRecipients = isValidBloodGroup
    ? getCompatibleRecipients(bloodGroup as BloodGroup)
    : [];
  const compatibleDonors = isValidBloodGroup
    ? getCompatibleDonors(bloodGroup as BloodGroup)
    : [];

  // Compute 56-day biological cooldown
  const cooldownInfo = React.useMemo(() => {
    if (!lastDonationDate) return null;
    try {
      const donationTime = new Date(lastDonationDate).getTime();
      if (isNaN(donationTime)) return null;

      const now = Date.now();
      const diffMs = now - donationTime;
      const daysSince = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const cooldownDays = 56;
      const isEligible = daysSince >= cooldownDays;
      const daysRemaining = Math.max(0, cooldownDays - daysSince);
      const progressPercent = Math.min(100, Math.round((daysSince / cooldownDays) * 100));

      const nextEligibleDate = new Date(donationTime + cooldownDays * 24 * 60 * 60 * 1000);

      return {
        daysSince,
        isEligible,
        daysRemaining,
        progressPercent,
        nextEligibleDateFormatted: nextEligibleDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
    } catch {
      return null;
    }
  }, [lastDonationDate]);

  // Mask phone number (first 5 + last 3 visible)
  const maskedPhone = React.useMemo(() => {
    if (!phone || phone.length < 5) return "01XXX***XXX";
    const clean = phone.replace(/[^0-9]/g, "");
    if (clean.length < 11) return `${clean.slice(0, 5)}***`;
    return `${clean.slice(0, 5)}***${clean.slice(8, 11)}`;
  }, [phone]);

  return (
    <div className="w-full space-y-4">
      {/* Digital Emergency Badge Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
              <Droplet className="h-4 w-4 fill-crimson" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground leading-none">
                Emergency Readiness
              </p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                BLOODOS LIFESAVER NETWORK
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`font-mono text-[10px] px-2 py-0.5 gap-1 ${
              isDonor
                ? "bg-teal/10 text-teal border-teal/30"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isDonor ? "bg-teal animate-pulse" : "bg-muted-foreground/60"
              }`}
            />
            <span>{isDonor ? "ACTIVE VOLUNTEER" : "COORDINATOR"}</span>
          </Badge>
        </div>

        {/* Identity Grid */}
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Blood Type Focus */}
          <div className="col-span-4 flex flex-col items-center justify-center p-3 rounded-xl border border-border/80 bg-muted/30 text-center">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
              Blood Group
            </span>
            <span className="font-mono text-2xl font-bold tracking-tight text-crimson mt-0.5">
              {bloodGroup || "--"}
            </span>
          </div>

          {/* User Details & Location */}
          <div className="col-span-8 space-y-1.5 pl-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {userName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-ochre shrink-0" />
              <span className="font-medium text-foreground/90 truncate">
                {district ? `${district}, BD` : "District not set"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-teal shrink-0" />
              <span>{maskedPhone}</span>
            </div>
          </div>
        </div>

        {/* 56-Day Cooldown Bar (if date provided) */}
        {cooldownInfo && (
          <div className="pt-3 border-t border-border/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-crimson" />
                <span>56d Biological Rest</span>
              </span>
              <span
                className={`font-semibold text-[11px] ${
                  cooldownInfo.isEligible ? "text-teal" : "text-ochre"
                }`}
              >
                {cooldownInfo.isEligible
                  ? "ELIGIBLE TODAY"
                  : `${cooldownInfo.daysRemaining}d left`}
              </span>
            </div>

            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  cooldownInfo.isEligible ? "bg-teal" : "bg-ochre"
                }`}
                style={{ width: `${cooldownInfo.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Serological Compatibility Radar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-crimson" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              Serological Compatibility
            </h3>
          </div>
          {isValidBloodGroup && (
            <span className="text-[10px] font-mono text-teal font-bold uppercase">
              MATCH READY
            </span>
          )}
        </div>

        {isValidBloodGroup ? (
          <div className="space-y-3 pt-1">
            {/* Can Donate To */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between">
                <span>Can donate whole blood to:</span>
                <span className="font-mono text-[10px] text-foreground font-semibold">
                  {compatibleRecipients.length} Groups
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {compatibleRecipients.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-crimson/10 border border-crimson/25 text-crimson font-mono font-bold text-xs"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>

            {/* Can Receive From */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between">
                <span>Can receive whole blood from:</span>
                <span className="font-mono text-[10px] text-foreground font-semibold">
                  {compatibleDonors.length} Groups
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {compatibleDonors.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal/10 border border-teal/25 text-teal font-mono font-bold text-xs"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center rounded-xl bg-muted/20 border border-dashed border-border/80">
            <Droplet className="h-5 w-5 text-muted-foreground/50 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">
              Select blood group to view transfusion compatibility.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

