"use client";

import { type Donor } from "@/types/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Droplet,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
import {
  evaluateDonorEligibility,
  calculateDaysSinceLastDonation,
  getEligibilityMessage,
} from "@/lib/eligibility";

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
  onRequestContact?: (donorId: string) => void;
  /**
   * Loading state for contact request
   */
  isRequestingContact?: boolean;
}

/**
 * DonorCard component (Phase 7d)
 * Displays a donor profile in card format:
 * - Blood group + district kicker (same anatomy as RequestCard)
 * - Donor name in Fraunces heading
 * - Eligibility badge (replaces urgency badge)
 * - Last donation info
 * - "Request Contact" CTA
 *
 * Follows civic infrastructure aesthetic from Phase 6a
 * Client-side eligibility calculated per Req 17.9
 */
export function DonorCard({
  donor,
  staggerIndex = 0,
  onRequestContact,
  isRequestingContact = false,
}: DonorCardProps) {
  // Calculate eligibility (client-side, Req 17.9)
  const eligibility = evaluateDonorEligibility(donor.lastDonationDate);
  const daysSinceDonation = donor.lastDonationDate
    ? calculateDaysSinceLastDonation(donor.lastDonationDate)
    : null;

  const handleRequestContact = () => {
    if (onRequestContact && !isRequestingContact) {
      onRequestContact(donor._id);
    }
  };

  return (
    <article
      className="card-grid-item relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-teal/40 focus-within:border-teal focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      style={{ "--stagger-index": staggerIndex } as React.CSSProperties}
    >
      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Header: Kicker + Eligibility Badge */}
        <div className="flex items-start justify-between gap-3">
          {/* Kicker: Blood Group + District (same as RequestCard) */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Droplet className="h-3.5 w-3.5 text-crimson" aria-hidden="true" />
            <span className="font-mono font-medium tabular-data">
              {donor.bloodGroup}
            </span>
            <span aria-hidden="true">•</span>
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{donor.district}</span>
          </div>

          {/* Eligibility Badge - top-right (replaces urgency badge) */}
          <EligibilityBadge
            eligible={eligibility.eligible}
            reason={eligibility.reason}
            daysRemaining={eligibility.daysRemaining}
          />
        </div>

        {/* Donor Name - Fraunces heading (same prominence as patient name) */}
        <h3 className="font-heading text-base font-semibold leading-tight tracking-tight text-foreground">
          {donor.name}
        </h3>

        {/* Last Donation Date */}
        {donor.lastDonationDate ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>
              Last donated{" "}
              <span className="font-medium tabular-data text-foreground">
                {daysSinceDonation}
              </span>{" "}
              {daysSinceDonation === 1 ? "day" : "days"} ago
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>No donation history</span>
          </div>
        )}

        {/* Eligibility Message */}
        <div className="flex items-start gap-2 text-sm">
          {eligibility.eligible ? (
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-teal"
              aria-hidden="true"
            />
          ) : (
            <Clock
              className="mt-0.5 h-4 w-4 shrink-0 text-ochre"
              aria-hidden="true"
            />
          )}
          <span
            className={
              eligibility.eligible ? "text-teal" : "text-muted-foreground"
            }
          >
            {getEligibilityMessage(eligibility)}
          </span>
        </div>

        {/* Contact Info (Masked - Req 17.5) */}
        <div className="mt-auto space-y-2 pt-2">
          {/* Phone (masked) */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="font-mono tabular-data">{donor.phone}</span>
          </div>

          {/* Email (masked, if present) */}
          {donor.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono tabular-data">{donor.email}</span>
            </div>
          )}
        </div>

        {/* Footer: Request Contact CTA */}
        <div className="pt-2 border-t border-border">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={handleRequestContact}
            disabled={isRequestingContact}
          >
            {isRequestingContact ? "Requesting..." : "Request Contact"}
          </Button>
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// Inline Badge Component (will be extracted to 7h)
// ============================================================================

/**
 * EligibilityBadge - styled pill for donor eligibility status
 * Eligible = teal (trust color)
 * Cooldown = ochre outlined (waiting state)
 * No history = slate outlined (neutral)
 */
function EligibilityBadge({
  eligible,
  reason,
  daysRemaining,
}: {
  eligible: boolean;
  reason?: string;
  daysRemaining?: number;
}) {
  // Eligible to donate
  if (eligible) {
    return (
      <Badge
        variant="outline"
        className="flex items-center gap-1 bg-teal text-paper border-teal text-xs font-medium"
      >
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        <span>Eligible</span>
      </Badge>
    );
  }

  // In cooldown period
  if (reason === "cooldown_requirement" && daysRemaining) {
    return (
      <Badge
        variant="outline"
        className="flex items-center gap-1 border-ochre text-ochre bg-transparent text-xs font-medium"
      >
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>{daysRemaining}d</span>
      </Badge>
    );
  }

  // No donation history or other reasons
  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1 border-slate text-slate bg-transparent text-xs font-medium"
    >
      <Calendar className="h-3 w-3" aria-hidden="true" />
      <span>New</span>
    </Badge>
  );
}
