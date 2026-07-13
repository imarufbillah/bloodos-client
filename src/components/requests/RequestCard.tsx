import Link from "next/link";
import { type BloodRequest, Urgency } from "@/types/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Droplet,
  Hospital,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RequestCardProps {
  request: BloodRequest;
  /**
   * Stagger index for card-fade-in animation
   * Pass the array index when rendering in a grid
   */
  staggerIndex?: number;
}

/**
 * RequestCard component (Phase 7c)
 * Displays a blood request in the dispatch-slip anatomy:
 * - Kicker (blood group + district) above patient name
 * - Urgency pill top-right
 * - Critical cards get the heartbeat left-bar (signature element)
 * - Truncated description with ellipsis
 * - "View Details" CTA button
 *
 * Follows civic infrastructure aesthetic from Phase 6a
 */
export function RequestCard({ request, staggerIndex = 0 }: RequestCardProps) {
  const isCritical = request.urgency === Urgency.CRITICAL;
  const neededByDate = new Date(request.neededByDate);
  const createdAt = new Date(request.createdAt);
  const isExpiringSoon =
    neededByDate.getTime() - Date.now() < 24 * 60 * 60 * 1000; // <24 hours

  // Format dates
  const neededByFormatted = formatDistanceToNow(neededByDate, {
    addSuffix: true,
  });
  const createdAtFormatted = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  // Truncate description to 120 characters
  const truncatedDescription = request.additionalNotes
    ? request.additionalNotes.length > 120
      ? `${request.additionalNotes.slice(0, 120)}...`
      : request.additionalNotes
    : "No additional notes provided.";

  return (
    <article
      className="card-grid-item relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-crimson/40 focus-within:border-crimson focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      style={{ "--stagger-index": staggerIndex } as React.CSSProperties}
    >
      {/* Critical pulse bar - signature element */}
      {isCritical && <div className="critical-pulse-bar" aria-hidden="true" />}

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Header: Kicker + Urgency Badge */}
        <div className="flex items-start justify-between gap-3">
          {/* Kicker: Blood Group + District */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Droplet className="h-3.5 w-3.5 text-crimson" aria-hidden="true" />
            <span className="font-mono font-medium tabular-data">
              {request.bloodGroup}
            </span>
            <span aria-hidden="true">•</span>
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{request.district}</span>
          </div>

          {/* Urgency Badge - top-right */}
          <UrgencyBadge urgency={request.urgency} />
        </div>

        {/* Patient Name - Fraunces heading */}
        <h3 className="font-heading text-base font-semibold leading-tight tracking-tight text-foreground">
          {request.patientName}
        </h3>

        {/* Hospital Info */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Hospital className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">
              {request.hospitalName}
            </span>
            <span className="text-xs">{request.hospitalAddress}</span>
          </div>
        </div>

        {/* Units Needed */}
        <div className="flex items-center gap-2 text-sm">
          <Droplet className="h-4 w-4 text-crimson" aria-hidden="true" />
          <span className="text-muted-foreground">
            <span className="font-medium tabular-data text-foreground">
              {request.unitsNeeded}
            </span>{" "}
            {request.unitsNeeded === 1 ? "unit" : "units"} needed
          </span>
        </div>

        {/* Needed By Date */}
        <div className="flex items-center gap-2 text-sm">
          {isExpiringSoon ? (
            <AlertCircle
              className="h-4 w-4 text-ochre"
              aria-hidden="true"
              aria-label="Expiring soon"
            />
          ) : (
            <Calendar className="h-4 w-4" aria-hidden="true" />
          )}
          <span
            className={
              isExpiringSoon
                ? "font-medium text-ochre"
                : "text-muted-foreground"
            }
          >
            Needed {neededByFormatted}
          </span>
        </div>

        {/* Description - truncated */}
        {request.additionalNotes && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {truncatedDescription}
          </p>
        )}

        {/* Status Badge */}
        <div className="mt-auto pt-2">
          <StatusBadge status={request.status} />
        </div>

        {/* Footer: Created time + CTA */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Posted {createdAtFormatted}</span>
          </div>

          {/* View Details CTA */}
          <Link href={`/requests/${request._id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// Inline Badge Components (will be extracted to 7h)
// ============================================================================

/**
 * UrgencyBadge - styled pill for urgency levels
 * Critical = filled crimson
 * Urgent = filled ochre
 * Moderate = outlined slate
 */
function UrgencyBadge({ urgency }: { urgency: string }) {
  const variants = {
    critical: {
      className: "bg-crimson text-paper border-crimson",
      icon: AlertCircle,
      label: "Critical",
    },
    urgent: {
      className: "bg-ochre text-ink border-ochre",
      icon: Clock,
      label: "Urgent",
    },
    moderate: {
      className: "border-slate text-slate bg-transparent",
      icon: Clock,
      label: "Moderate",
    },
  };

  const variant = variants[urgency as keyof typeof variants] || variants.moderate;
  const Icon = variant.icon;

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 text-xs font-medium ${variant.className}`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{variant.label}</span>
    </Badge>
  );
}

/**
 * StatusBadge - text-only label for request status
 * Uses ink-on-paper, no urgency color channel
 */
function StatusBadge({ status }: { status: string }) {
  const statusLabels = {
    open: "Open",
    in_progress: "In Progress",
    fulfilled: "Fulfilled",
    cancelled: "Cancelled",
    expired: "Expired",
  };

  const statusColors = {
    open: "text-teal",
    in_progress: "text-ochre",
    fulfilled: "text-teal",
    cancelled: "text-muted-foreground",
    expired: "text-muted-foreground",
  };

  const label = statusLabels[status as keyof typeof statusLabels] || status;
  const colorClass =
    statusColors[status as keyof typeof statusColors] || "text-foreground";

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`h-2 w-2 rounded-full ${
          status === "open" || status === "in_progress"
            ? "bg-teal"
            : status === "fulfilled"
              ? "bg-teal/50"
              : "bg-muted-foreground/50"
        }`}
        aria-hidden="true"
      />
      <span className={`text-xs font-medium ${colorClass}`}>{label}</span>
    </div>
  );
}
