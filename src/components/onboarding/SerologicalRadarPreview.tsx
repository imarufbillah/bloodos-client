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
  Heart,
  Sparkles,
  CheckCircle2,
  Users,
  Activity,
  AlertCircle,
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
  currentStep,
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
      {/* Live Digital Emergency Badge Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        {/* Subtle top indicator bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border/70">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
              <Droplet className="h-4 w-4 fill-crimson" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground leading-none">
                Emergency Readiness Card
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
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

        {/* Dynamic Identity Grid */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Blood Type Focus Display */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/80 bg-muted/30 text-center">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Blood Group
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-bold tracking-tight text-crimson">
                {bloodGroup || "--"}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              {bloodGroup === "O-" && "Universal Whole Donor"}
              {bloodGroup === "AB+" && "Universal Recipient"}
              {bloodGroup === "O+" && "Rh+ Broad Donor"}
              {bloodGroup && !["O-", "AB+", "O+"].includes(bloodGroup) && "Rh Matched Donor"}
              {!bloodGroup && "Pending selection"}
            </span>
          </div>

          {/* User Details & Location */}
          <div className="sm:col-span-8 space-y-2.5">
            <div>
              <p className="text-sm font-semibold text-foreground truncate">
                {userName}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-ochre shrink-0" />
                <span className="font-medium text-foreground/90">
                  {district ? `${district}, Bangladesh` : "District not specified"}
                </span>
              </div>
            </div>

            {/* Privacy-Masked Contact preview */}
            <div className="flex items-center gap-2 rounded-lg bg-background/80 border border-border/60 px-2.5 py-1.5 text-xs font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-teal shrink-0" />
              <span className="text-muted-foreground">Contact:</span>
              <span className="font-semibold text-foreground tracking-wider">
                {maskedPhone}
              </span>
            </div>
          </div>
        </div>

        {/* 56-Day Cooldown Visual Bar (if date provided) */}
        {cooldownInfo && (
          <div className="mt-4 pt-3.5 border-t border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-crimson" />
                <span>56-Day Biological Rest</span>
              </div>
              <span
                className={`font-mono font-semibold text-[11px] ${
                  cooldownInfo.isEligible ? "text-teal" : "text-ochre"
                }`}
              >
                {cooldownInfo.isEligible
                  ? "✓ ELIGIBLE TO DONATE TODAY"
                  : `${cooldownInfo.daysRemaining}d rest remaining`}
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
            
            {!cooldownInfo.isEligible && (
              <p className="text-[11px] text-muted-foreground">
                Next eligible donation date: <strong className="text-foreground">{cooldownInfo.nextEligibleDateFormatted}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Serological Compatibility Radar (The Aha Moment) */}
      <div className="rounded-2xl border border-border bg-card/70 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-crimson" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              Serological Impact Matrix
            </h3>
          </div>
          {isValidBloodGroup && (
            <span className="text-[11px] font-mono text-teal font-medium">
              MATCH READY
            </span>
          )}
        </div>

        {isValidBloodGroup ? (
          <div className="space-y-3 pt-1">
            {/* Can Donate To */}
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 flex items-center justify-between">
                <span>Can safely donate whole blood to:</span>
                <span className="font-mono text-[10px] text-foreground font-semibold">
                  {compatibleRecipients.length} Blood Groups
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
                <span>Can safely receive whole blood from:</span>
                <span className="font-mono text-[10px] text-foreground font-semibold">
                  {compatibleDonors.length} Blood Groups
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
            <Droplet className="h-6 w-6 text-muted-foreground/50 mx-auto mb-1.5" />
            <p className="text-xs text-muted-foreground">
              Select your blood group on the right to simulate your emergency transfusion compatibility.
            </p>
          </div>
        )}
      </div>

      {/* Safety & Protocol Assurances */}
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-start gap-2 p-2.5 rounded-xl border border-border/60 bg-card/50">
          <ShieldCheck className="h-4 w-4 text-teal shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground text-[11px]">Phone Shield</p>
            <p className="text-[10px] leading-tight">Masked until mutual emergency acceptance.</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-xl border border-border/60 bg-card/50">
          <Clock className="h-4 w-4 text-crimson shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground text-[11px]">56-Day Rest</p>
            <p className="text-[10px] leading-tight">Enforced for biological donor safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
