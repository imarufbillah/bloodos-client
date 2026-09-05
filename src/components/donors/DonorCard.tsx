"use client";

import * as React from "react";
import { type Donor } from "@/types/shared";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  PhoneCall,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  evaluateDonorEligibility,
  calculateDaysSinceLastDonation,
  getEligibilityMessage,
} from "@/lib/eligibility";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface DonorCardProps {
  donor: Donor;
  /**
   * Stagger index for card-fade-in animation
   * Pass the array index when rendering in a grid
   */
  staggerIndex?: number;
  /**
   * Callback when "Request Contact" button is clicked
   */
  onRequestContact?: (donor: Donor) => void;
  /**
   * Loading state for contact request
   */
  isRequestingContact?: boolean;
}

export function DonorCard({
  donor,
  staggerIndex = 0,
  onRequestContact,
  isRequestingContact = false,
}: DonorCardProps) {
  // Calculate biological eligibility (90-day cooldown standard)
  const eligibility = evaluateDonorEligibility(donor.lastDonationDate);
  const daysSinceDonation = donor.lastDonationDate
    ? calculateDaysSinceLastDonation(donor.lastDonationDate)
    : null;

  const handleRequestContact = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    if (onRequestContact && !isRequestingContact) {
      onRequestContact(donor);
    }
  };

  return (
    <article
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-teal/40 hover:shadow-md focus-within:border-teal focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      style={{
        animationDelay: `${Math.min(staggerIndex * 40, 400)}ms`,
      }}
    >
      {/* Top Status Accent Bar for Active/Eligible Donors */}
      {eligibility.eligible && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-teal" />
      )}

      {/* Main Card Content */}
      <div className="space-y-3.5">
        {/* Top Meta Bar: District + Eligibility Pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-teal shrink-0" aria-hidden="true" />
            <span className="font-medium text-foreground/90">{donor.district}</span>
          </div>

          {/* Biological Eligibility Status Badge */}
          <EligibilityBadge
            eligible={eligibility.eligible}
            reason={eligibility.reason}
            daysRemaining={eligibility.daysRemaining}
          />
        </div>

        {/* Hero Identity: Blood Group Badge + Donor Name */}
        <div className="flex items-center gap-3 pt-0.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading text-lg font-bold shadow-xs transition-transform duration-200 group-hover:scale-105">
            <span>{donor.bloodGroup}</span>
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <h3 className="font-heading text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {donor.name}
            </h3>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-teal shrink-0" aria-hidden="true" />
              <span>Verified Blood Donor</span>
            </div>
          </div>
        </div>

        {/* Clinical Donation History Telemetry Block */}
        <div className="rounded-xl bg-muted/40 p-3 border border-border/50 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Last Donated
            </span>
            <span className="font-mono font-semibold tabular-nums text-foreground">
              {donor.lastDonationDate
                ? `${daysSinceDonation} ${daysSinceDonation === 1 ? "day" : "days"} ago`
                : "No prior records"}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border/40 pt-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              {eligibility.eligible ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              )}
              Readiness
            </span>
            <span
              className={`font-medium ${
                eligibility.eligible
                  ? "text-teal font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {getEligibilityMessage(eligibility)}
            </span>
          </div>
        </div>

        {/* Masked Contact Previews */}
        <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
            <span className="font-mono tabular-nums tracking-wide">{donor.phone}</span>
          </div>
          {donor.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" aria-hidden="true" />
              <span className="font-mono tabular-nums truncate">{donor.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Area: Request Contact Action */}
      <div className="pt-3.5 mt-3.5 border-t border-border/60">
        <button
          type="button"
          onClick={handleRequestContact}
          disabled={isRequestingContact}
          className="w-full h-11 sm:h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
        >
          {isRequestingContact ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Retrieving Contact...</span>
            </>
          ) : (
            <>
              <PhoneCall className="h-4 w-4" />
              <span>Request Verified Contact</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

// ============================================================================
// Eligibility Badge Component
// ============================================================================

function EligibilityBadge({
  eligible,
  reason,
  daysRemaining,
}: {
  eligible: boolean;
  reason?: string;
  daysRemaining?: number;
}) {
  if (eligible) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-teal/10 text-teal border border-teal/20">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal" />
        </span>
        <span>Eligible Now</span>
      </div>
    );
  }

  if (reason === "cooldown_requirement" && daysRemaining) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>Cooldown • {daysRemaining}d</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-muted text-muted-foreground border border-border/60">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      <span>First-Time</span>
    </div>
  );
}
