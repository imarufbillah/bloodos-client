"use client";

import * as React from "react";
import Link from "next/link";
import { type BloodRequest, type BloodGroup, Urgency } from "@/types/shared";
import { useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";
import { isCompatible } from "@/lib/constants/compatibility";
import {
  Hospital,
  Clock,
  ShieldCheck,
  HeartHandshake,
  Navigation,
} from "lucide-react";
import { formatDistanceToNow, isPast, isToday, isTomorrow, format } from "date-fns";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface RequestCardProps {
  request: BloodRequest;
  staggerIndex?: number;
}

export function RequestCard({ request, staggerIndex = 0 }: RequestCardProps) {
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  const isCritical = request.urgency === Urgency.CRITICAL;
  const isUrgent = request.urgency === Urgency.URGENT;
  const neededByDate = new Date(request.neededByDate);
  const isExpired = isPast(neededByDate);

  // Time remaining calculation
  const getTimeLabel = () => {
    if (isExpired) return "Transfusion window passed";
    if (isToday(neededByDate)) {
      return `Today • ${format(neededByDate, "h:mm a")}`;
    }
    if (isTomorrow(neededByDate)) {
      return `Tomorrow • ${format(neededByDate, "h:mm a")}`;
    }
    return format(neededByDate, "MMM d • h:mm a");
  };

  // Compatibility evaluation
  const userBloodGroup = user?.bloodGroup as BloodGroup | undefined;
  const userIsCompatible = userBloodGroup
    ? isCompatible(userBloodGroup, request.bloodGroup)
    : null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${request.hospitalName}, ${request.hospitalAddress || ""}, ${request.district}, Bangladesh`
  )}`;

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 bg-card p-4 sm:p-6 shadow-xs hover:shadow-md ${
        isCritical
          ? "border-destructive/40 hover:border-destructive bg-destructive/[0.02]"
          : isUrgent
          ? "border-amber-500/30 hover:border-amber-500/60"
          : "border-border hover:border-foreground/20"
      }`}
      style={{
        animationDelay: `${Math.min(staggerIndex * 50, 400)}ms`,
      }}
    >
      {/* Critical STAT Aura Bar */}
      {isCritical && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
      )}

      {/* Top Header Row: Blood Group, Urgency Tier, Time Countdown */}
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          {/* Blood Group Hero Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl font-heading text-base sm:text-lg font-bold shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                isCritical
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <span>{request.bloodGroup}</span>
            </div>

            <div className="space-y-0.5">
              <span className="font-mono text-xs font-semibold text-foreground">
                {request.unitsNeeded} {request.unitsNeeded === 1 ? "Bag" : "Bags"} Needed
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className={isCritical ? "font-semibold text-destructive" : ""}>
                  {getTimeLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Urgency Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
              isCritical
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : isUrgent
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-teal/10 text-teal border border-teal/20"
            }`}
          >
            {isCritical && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-destructive" />
              </span>
            )}
            <span>{request.urgency.toUpperCase()}</span>
          </div>
        </div>

        {/* Patient & Hospital Info */}
        <div className="space-y-2 pt-1 border-t border-border/60">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
              <Link href={`/requests/${request._id}`} className="hover:underline focus-visible:outline-none">
                {request.patientName}
              </Link>
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground shrink-0">
              {request.district}
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <Hospital className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{request.hospitalName}</p>
              {request.hospitalAddress && (
                <p className="text-[11px] text-muted-foreground truncate">{request.hospitalAddress}</p>
              )}
            </div>
          </div>

          {/* Additional Clinical Notes */}
          {request.additionalNotes && (
            <p className="text-xs text-muted-foreground line-clamp-2 italic pt-0.5">
              &ldquo;{request.additionalNotes}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Footer Area: Compatibility Match + Action Button */}
      <div className="space-y-2.5 pt-3.5 mt-3.5 border-t border-border/60">
        {/* Compatibility Match Tag (if logged in with blood group) */}
        {userBloodGroup && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              userIsCompatible
                ? "bg-teal/10 text-teal border border-teal/20"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>
              {userIsCompatible
                ? `Matched for your ${userBloodGroup} profile`
                : `Incompatible with ${userBloodGroup}`}
            </span>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-2">
          <Link
            href={`/requests/${request._id}`}
            onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT)}
            className={`flex-1 h-11 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] ${
              isCritical
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            }`}
          >
            <HeartHandshake className="h-4 w-4" />
            <span>Volunteer to Donate</span>
          </Link>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT)}
            className="h-11 w-11 sm:h-10 sm:w-10 shrink-0 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label={`Get directions to ${request.hospitalName}`}
            title="Google Maps Route"
          >
            <Navigation className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
