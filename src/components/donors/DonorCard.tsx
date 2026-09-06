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
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 sm:p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
      style={{
        animationDelay: `${Math.min(staggerIndex * 30, 300)}ms`,
      }}
      aria-label={`Donor profile for ${donor.name}, blood group ${donor.bloodGroup}`}
    >
      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Header: District Location + Biological Eligibility Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-teal shrink-0" aria-hidden="true" />
            <span className="font-medium text-foreground/90">{donor.district}</span>
          </div>

          <EligibilityBadge
            eligible={eligibility.eligible}
            reason={eligibility.reason}
            daysRemaining={eligibility.daysRemaining}
          />
        </div>

        {/* Donor Identity: Blood Group + Name + Masked Phone */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading text-lg font-bold shadow-xs"
            aria-label={`Blood type ${donor.bloodGroup}`}
          >
            <span>{donor.bloodGroup}</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-base font-bold text-foreground truncate">
              {donor.name}
            </h3>
            <p className="text-xs font-mono text-muted-foreground tabular-nums truncate">
              {donor.phone}
            </p>
          </div>
        </div>

        {/* Clinical History & Eligibility Telemetry */}
        <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Last Donation
            </span>
            <span className="font-mono font-semibold tabular-nums text-foreground">
              {donor.lastDonationDate
                ? `${daysSinceDonation} ${daysSinceDonation === 1 ? "day" : "days"} ago`
                : "No previous records"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              {eligibility.eligible ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-ochre" aria-hidden="true" />
              )}
              Eligibility
            </span>
            <span
              className={`font-medium ${
                eligibility.eligible
                  ? "text-teal font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {eligibility.eligible
                ? "Eligible to donate today"
                : `Cooldown (${eligibility.daysRemaining}d remaining)`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-border/60">
        <button
          type="button"
          onClick={handleRequestContact}
          disabled={isRequestingContact}
          aria-label={`Request contact details for donor ${donor.name}`}
          className="w-full h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
        >
          {isRequestingContact ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Retrieving Contact...</span>
            </>
          ) : (
            <>
              <PhoneCall className="h-4 w-4" />
              <span>Request Contact Details</span>
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
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-ochre/10 text-ochre border border-ochre/20">
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>Cooldown • {daysRemaining}d</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-muted text-muted-foreground border border-border/60">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      <span>First-Time Donor</span>
    </div>
  );
}
