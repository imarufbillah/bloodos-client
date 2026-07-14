/**
 * Request Details Content Component
 *
 * Client component for interactive features:
 * - "I Can Help" button with auth check
 * - Response submission
 * - Related requests grid
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BloodRequest } from "@/types/shared";
import { RequestStatus, Urgency } from "@/types/shared";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestCard } from "@/components/requests/RequestCard";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Droplet,
  Hospital,
  Phone,
  AlertCircle,
  Clock,
  User,
  FileText,
  ArrowLeft,
  Heart,
  MapPinned,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { apiFetch } from "@/lib/api-client";

interface RequestDetailsContentProps {
  request: BloodRequest;
}

/**
 * Fetch related requests
 */
async function fetchRelatedRequests(
  requestId: string
): Promise<BloodRequest[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/requests/related/${requestId}`
  );

  if (!response.ok) {
    console.error("Failed to fetch related requests:", response.statusText);
    return [];
  }

  return response.json();
}

/**
 * Submit response to request
 */
async function submitResponse(
  requestId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiFetch(`/api/requests/${requestId}/respond`, {
      method: "POST",
      body: JSON.stringify({
        message: "I can help with this blood donation request.",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to submit response",
      };
    }

    return {
      success: true,
      message: "Your response has been submitted successfully",
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export default function RequestDetailsContent({
  request,
}: RequestDetailsContentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [relatedRequests, setRelatedRequests] = React.useState<
    BloodRequest[]
  >([]);
  const [isLoadingRelated, setIsLoadingRelated] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDonor, setIsDonor] = React.useState<boolean>(false);
  const [isCheckingDonor, setIsCheckingDonor] = React.useState(true);

  const isCritical = request.urgency === Urgency.CRITICAL;
  
  // Memoize date calculations to avoid new Date() on every render
  const { neededByDate, createdAt, isExpiringSoon } = React.useMemo(() => {
    const needed = new Date(request.neededByDate);
    const created = new Date(request.createdAt);
    // eslint-disable-next-line react-hooks/purity
    const expiringSoon = needed.getTime() - Date.now() < 24 * 60 * 60 * 1000;
    return { neededByDate: needed, createdAt: created, isExpiringSoon: expiringSoon };
  }, [request.neededByDate, request.createdAt]);

  // Check if current user is the request owner
  const isOwner = session?.user?.id === request.userId;
  const isAuthenticated = !!session?.user;

  // Fetch current user's donor status from API
  React.useEffect(() => {
    const checkDonorStatus = async () => {
      if (!isAuthenticated) {
        setIsCheckingDonor(false);
        setIsDonor(false);
        return;
      }

      try {
        const response = await apiFetch("/api/users/me");
        if (response.ok) {
          const userData = await response.json();
          setIsDonor(userData.isDonor || false);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setIsDonor(false);
      } finally {
        setIsCheckingDonor(false);
      }
    };

    checkDonorStatus();
  }, [isAuthenticated]);

  // Fetch related requests
  React.useEffect(() => {
    const loadRelated = async () => {
      setIsLoadingRelated(true);
      const related = await fetchRelatedRequests(request._id);
      setRelatedRequests(related);
      setIsLoadingRelated(false);
    };

    loadRelated();
  }, [request._id]);

  // Handle "I Can Help" button click
  const handleHelp = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to respond to requests");
      router.push(`/signin?redirect=/requests/${request._id}`);
      return;
    }

    if (!isDonor) {
      toast.error("Only registered donors can respond to requests");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitResponse(request._id);

      if (result.success) {
        toast.success(result.message);
        // Optionally redirect to profile or manage page
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <Link href="/requests">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          {/* Section 1: Overview - Hero with urgency indicators */}
          <section
            className={`relative overflow-hidden rounded-lg border border-border bg-card p-6 ${
              isCritical ? "border-crimson/40" : ""
            }`}
          >
            {/* Critical pulse bar */}
            {isCritical && (
              <div className="critical-pulse-bar" aria-hidden="true" />
            )}

            <div className="space-y-4">
              {/* Status + Urgency Row */}
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={request.status} />
                <UrgencyBadge urgency={request.urgency} />
                {isExpiringSoon && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 border-ochre text-ochre"
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>Expiring Soon</span>
                  </Badge>
                )}
              </div>

              {/* Patient Name - Large Heading */}
              <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground">
                {request.patientName}
              </h1>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Blood Group */}
                <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
                  <Droplet
                    className="h-5 w-5 text-crimson"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Blood Group
                    </div>
                    <div className="font-mono text-lg font-semibold tabular-data text-crimson">
                      {request.bloodGroup}
                    </div>
                  </div>
                </div>

                {/* Units Needed */}
                <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
                  <Heart className="h-5 w-5 text-teal" aria-hidden="true" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Units Needed
                    </div>
                    <div className="font-mono text-lg font-semibold tabular-data text-foreground">
                      {request.unitsNeeded}{" "}
                      {request.unitsNeeded === 1 ? "unit" : "units"}
                    </div>
                  </div>
                </div>

                {/* Needed By */}
                <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
                  <Calendar className="h-5 w-5 text-ochre" aria-hidden="true" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Needed By
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        isExpiringSoon ? "text-ochre" : "text-foreground"
                      }`}
                    >
                      {format(neededByDate, "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(neededByDate, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {request.status === RequestStatus.OPEN && (
                <div className="pt-4">
                  <Button
                    onClick={handleHelp}
                    disabled={isSubmitting || isOwner}
                    size="lg"
                    className="w-full sm:w-auto gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    {isSubmitting
                      ? "Submitting..."
                      : isOwner
                        ? "Your Request"
                        : "I Can Help"}
                  </Button>
                  {!isAuthenticated && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Sign in to respond to this request
                    </p>
                  )}
                  {isAuthenticated && !isDonor && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Only registered donors can respond
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Section 2: Key Information */}
          <section className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal" />
              Key Information
            </h2>
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <InfoRow
                icon={User}
                label="Patient Name"
                value={request.patientName}
              />
              <InfoRow
                icon={Droplet}
                label="Blood Group"
                value={request.bloodGroup}
                valueClassName="font-mono font-semibold text-crimson"
              />
              <InfoRow
                icon={Heart}
                label="Units Needed"
                value={`${request.unitsNeeded} ${request.unitsNeeded === 1 ? "unit" : "units"}`}
              />
              <InfoRow
                icon={Hospital}
                label="Hospital"
                value={request.hospitalName}
              />
              <InfoRow
                icon={Calendar}
                label="Needed By"
                value={format(neededByDate, "MMMM d, yyyy 'at' h:mm a")}
                valueClassName={isExpiringSoon ? "text-ochre font-medium" : ""}
              />
              <InfoRow
                icon={Clock}
                label="Posted"
                value={formatDistanceToNow(createdAt, { addSuffix: true })}
              />
            </div>
          </section>

          {/* Section 3: Location */}
          <section className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
              <MapPinned className="h-5 w-5 text-teal" />
              Location
            </h2>
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <InfoRow
                icon={Hospital}
                label="Hospital"
                value={request.hospitalName}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={request.hospitalAddress}
              />
              <InfoRow
                icon={MapPin}
                label="District"
                value={request.district}
              />
            </div>
          </section>

          {/* Section 4: Description */}
          {request.additionalNotes && (
            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal" />
                Additional Notes
              </h2>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {request.additionalNotes}
                </p>
              </div>
            </section>
          )}

          {/* Section 5: Contact Information */}
          <section className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
              <Phone className="h-5 w-5 text-teal" />
              Contact Information
            </h2>
            <div className="space-y-3 rounded-lg border border-border bg-card p-4">
              <InfoRow
                icon={Phone}
                label="Phone"
                value={
                  isOwner
                    ? request.contactPhone
                    : maskPhone(request.contactPhone)
                }
                valueClassName="font-mono"
              />
              {!isOwner && (
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  Full contact information is only visible to the request owner
                  and administrators.
                </p>
              )}
            </div>
          </section>

          {/* Section 6: Related Requests */}
          {relatedRequests.length > 0 && (
            <section className="space-y-4 pt-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Related Requests
              </h2>
              <p className="text-sm text-muted-foreground">
                Other {request.bloodGroup} blood requests in {request.district}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedRequests.map((related, index) => (
                  <RequestCard
                    key={related._id}
                    request={related}
                    staggerIndex={index}
                  />
                ))}
              </div>
            </section>
          )}

          {isLoadingRelated && (
            <div className="space-y-4 pt-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Related Requests
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Info Row - Reusable component for key-value pairs
 */
function InfoRow({
  icon: Icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={`text-sm text-foreground ${valueClassName}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

/**
 * UrgencyBadge - styled pill for urgency levels
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

  const variant =
    variants[urgency as keyof typeof variants] || variants.moderate;
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

/**
 * Mask phone number (Req 4.1-4.3)
 * Format: 01XXXXXXXXX → 01XXX***XXX
 */
function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return `${phone.slice(0, 5)}***${phone.slice(-3)}`;
}
