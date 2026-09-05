"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BloodRequest, BloodGroup } from "@/types/shared";
import { Urgency } from "@/types/shared";
import { useSession } from "@/lib/auth-client";
import type { ExtendedUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { RequestCard } from "@/components/requests/RequestCard";
import { toast } from "sonner";
import {
  MapPin,
  Droplet,
  Hospital,
  Phone,
  Clock,
  FileText,
  ArrowLeft,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
  PhoneCall,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShareButton } from "@/components/shared/ShareButton";
import { formatDistanceToNow, format, isPast, isToday, isTomorrow } from "date-fns";
import { apiFetch } from "@/lib/api-client";
import { isCompatible, BLOOD_COMPATIBILITY } from "@/lib/constants/compatibility";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface RequestDetailsContentProps {
  request: BloodRequest;
}

async function fetchRelatedRequests(
  requestId: string
): Promise<BloodRequest[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/requests/related/${requestId}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return [];
    return response.json();
  } catch (err) {
    console.error("Failed to fetch related requests:", err);
    return [];
  }
}

function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return `${phone.slice(0, 5)}***${phone.slice(-3)}`;
}

export default function RequestDetailsContent({
  request,
}: RequestDetailsContentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  const [relatedRequests, setRelatedRequests] = React.useState<BloodRequest[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDonor, setIsDonor] = React.useState<boolean>(false);
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = React.useState(false);
  const [customMessage, setCustomMessage] = React.useState("");
  const [hasResponded, setHasResponded] = React.useState(false);
  const [manualBloodGroup, setManualBloodGroup] = React.useState<string>("");

  const isCritical = request.urgency === Urgency.CRITICAL;
  const isUrgent = request.urgency === Urgency.URGENT;
  const neededByDate = new Date(request.neededByDate);
  const createdAt = new Date(request.createdAt);
  const isExpired = isPast(neededByDate);

  const isOwner = session?.user?.id === request.userId;
  const isAuthenticated = !!session?.user;

  // Compatibility evaluation
  const effectiveBloodGroup = (user?.bloodGroup || manualBloodGroup) as BloodGroup | undefined;
  const compatibleDonorsList = BLOOD_COMPATIBILITY[request.bloodGroup] || [];
  const isUserCompatible = effectiveBloodGroup
    ? isCompatible(effectiveBloodGroup, request.bloodGroup)
    : null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${request.hospitalName}, ${request.hospitalAddress || ""}, ${request.district}, Bangladesh`
  )}`;

  React.useEffect(() => {
    const checkDonorStatus = async () => {
      if (!isAuthenticated) {
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
      }
    };
    checkDonorStatus();
  }, [isAuthenticated]);

  React.useEffect(() => {
    const loadRelated = async () => {
      setIsLoadingRelated(true);
      const related = await fetchRelatedRequests(request._id);
      setRelatedRequests(related);
      setIsLoadingRelated(false);
    };
    loadRelated();
  }, [request._id]);

  const handleOpenCommitModal = () => {
    if (!isAuthenticated) {
      triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
      toast.info("Please sign in to respond to blood requests");
      router.push(`/signin?redirect=/requests/${request._id}`);
      return;
    }

    if (!isDonor) {
      triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
      toast.error("You must register as a donor on your profile before responding.");
      router.push("/profile");
      return;
    }

    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setIsCommitmentModalOpen(true);
  };

  const handleConfirmResponse = async () => {
    setIsSubmitting(true);
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);

    try {
      const response = await apiFetch(`/api/requests/${request._id}/respond`, {
        method: "POST",
        body: JSON.stringify({
          message:
            customMessage.trim() ||
            "I am ready to donate blood for this emergency request.",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to submit response");
        return;
      }

      triggerTactileFeedback(HAPTIC_PATTERNS.EMERGENCY_SOS);
      toast.success("Thank you! Your commitment has been registered.");
      setHasResponded(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeLabel = () => {
    if (isExpired) return "Transfusion window passed";
    if (isToday(neededByDate)) {
      return `Today • ${format(neededByDate, "h:mm a")}`;
    }
    if (isTomorrow(neededByDate)) {
      return `Tomorrow • ${format(neededByDate, "h:mm a")}`;
    }
    return format(neededByDate, "MMM d, yyyy • h:mm a");
  };

  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col bg-background text-foreground pb-24 sm:pb-16">
      {/* 1. Sub-Navbar Command Bar */}
      <section className="border-b border-border bg-card/60 backdrop-blur-md sticky top-14 sm:top-16 z-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/requests"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blood Requests</span>
          </Link>

          <div className="flex items-center gap-3">
            <ShareButton
              title={`${request.bloodGroup} blood needed at ${request.hospitalName}`}
              text={`${request.bloodGroup} blood required for ${request.patientName} at ${request.hospitalName}, ${request.district}. Urgency: ${request.urgency.toUpperCase()}.`}
            />
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Command Dossier */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (8 cols): Clinical Dossier */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Header Requisition Card */}
            <div
              className={`rounded-2xl border p-6 sm:p-8 bg-card shadow-xs space-y-6 relative overflow-hidden ${
                isCritical
                  ? "border-destructive/40 bg-destructive/[0.02]"
                  : "border-border"
              }`}
            >
              {isCritical && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-destructive" />
              )}

              {/* Status & Urgency Tier */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                      isCritical
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : isUrgent
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-teal/10 text-teal border border-teal/20"
                    }`}
                  >
                    {isCritical && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                      </span>
                    )}
                    <span>{request.urgency.toUpperCase()}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border text-xs font-mono font-semibold text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                    <span>{request.status.toUpperCase()}</span>
                  </div>
                </div>

                <span className="text-xs font-mono text-muted-foreground">
                  Ref: BLD-REQ-{request._id.slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Patient Name Heading */}
              <div className="space-y-1">
                <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {request.patientName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Hospital requisition logged {formatDistanceToNow(createdAt, { addSuffix: true })}
                </p>
              </div>

              {/* Key Medical Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 border-t border-border/60">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">Blood Group</span>
                  <div className="flex items-center gap-1.5 font-heading text-2xl font-bold text-primary">
                    <Droplet className="h-5 w-5 text-primary" />
                    <span>{request.bloodGroup}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">Units Required</span>
                  <div className="font-heading text-2xl font-bold text-foreground">
                    {request.unitsNeeded} <span className="text-xs font-normal text-muted-foreground">Bags</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1 col-span-2 sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">Transfusion Target</span>
                  <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-foreground">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className={isCritical ? "text-destructive" : ""}>{getTimeLabel()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hospital Logistics & Route Navigation Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground">
                  <Hospital className="h-5 w-5 text-teal" />
                  <span>Hospital & Location</span>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline font-mono"
                  aria-label={`View ${request.hospitalName} on Google Maps (opens in a new tab)`}
                >
                  <span>Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">Facility</span>
                  <p className="font-semibold text-sm text-foreground">{request.hospitalName}</p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">District</span>
                  <div className="flex items-center gap-1 font-semibold text-sm text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-teal shrink-0" aria-hidden="true" />
                    <span>{request.district}, Bangladesh</span>
                  </div>
                </div>
              </div>

              {request.hospitalAddress && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground block">Facility Address:</span>
                  <p className="leading-relaxed">{request.hospitalAddress}</p>
                </div>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
                aria-label={`Get directions to ${request.hospitalName} in Google Maps`}
              >
                <Button variant="outline" className="w-full text-xs gap-2 font-semibold h-10">
                  <Navigation className="h-4 w-4 text-teal" aria-hidden="true" />
                  <span>Open Route in Google Maps</span>
                </Button>
              </a>
            </div>

            {/* Clinical Indications & Additional Notes */}
            {request.additionalNotes && (
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground">
                  <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Clinical Notes & Remarks</span>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {request.additionalNotes}
                </div>
              </div>
            )}

            {/* Contact Safeguard & Verification Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground">
                <Phone className="h-5 w-5 text-teal" aria-hidden="true" />
                <span>Contact Verification & Safeguards</span>
              </div>

              <div className="p-5 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Emergency Contact Phone</span>
                  <p className="font-mono text-lg font-bold text-foreground tracking-wider">
                    {isOwner || hasResponded
                      ? request.contactPhone
                      : maskPhone(request.contactPhone)}
                  </p>
                </div>

                {isOwner || hasResponded ? (
                  <a href={`tel:${request.contactPhone}`} aria-label={`Call emergency attendant at ${request.contactPhone}`}>
                    <Button size="sm" className="bg-teal text-teal-foreground hover:bg-teal/90 gap-2 font-semibold">
                      <PhoneCall className="h-4 w-4" aria-hidden="true" />
                      <span>Direct Call</span>
                    </Button>
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal/10 border border-teal/20 text-teal text-xs font-mono">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    <span>Redacted for Privacy</span>
                  </div>
                )}
              </div>

              {!isOwner && !hasResponded && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  To protect patient families from unsolicited calls, the attendant&apos;s verified phone number is unlocked upon confirming your willingness to donate.
                </p>
              )}
            </div>

            {/* Related Regional Emergency Requests */}
            {relatedRequests.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    Other Requests in {request.district}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Additional verified blood requisitions in this district.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedRequests.map((related, index) => (
                    <RequestCard
                      key={related._id}
                      request={related}
                      staggerIndex={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Donor Response & Compatibility Terminal */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            {/* Primary Commitment Terminal Card */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xs">
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Donor Action Terminal
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Confirm your readiness to donate blood for this patient.
                </p>
              </div>

              {/* Biological Compatibility Module */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-foreground">Compatibility</span>
                  <span className="text-[11px] font-mono text-muted-foreground">Target: {request.bloodGroup}</span>
                </div>

                {effectiveBloodGroup ? (
                  <div
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      isUserCompatible
                        ? "bg-teal/10 border-teal/30 text-teal"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      {isUserCompatible ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                      )}
                      <span>
                        {isUserCompatible
                          ? `Compatible Match (${effectiveBloodGroup})`
                          : `Incompatible (${effectiveBloodGroup} to ${request.bloodGroup})`}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-tight">
                      {isUserCompatible
                        ? "Your blood group is clinically compatible with this requisition."
                        : "Whole blood transfusion from this group carries biological incompatibility."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-muted-foreground">
                      Check your blood type compatibility:
                    </p>
                    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select your blood group to test compatibility">
                      {Object.values(BLOOD_COMPATIBILITY).map((_, i) => {
                        const bgKey = Object.keys(BLOOD_COMPATIBILITY)[i] as BloodGroup;
                        return (
                          <button
                            key={bgKey}
                            type="button"
                            onClick={() => {
                              triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                              setManualBloodGroup(bgKey);
                            }}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              manualBloodGroup === bgKey
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/70"
                            }`}
                            aria-pressed={manualBloodGroup === bgKey}
                            aria-label={`Test compatibility for blood group ${bgKey}`}
                          >
                            {bgKey}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                  <span>Acceptable groups: </span>
                  <span className="font-mono font-bold text-foreground">
                    {compatibleDonorsList.join(", ")}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isOwner ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-muted/60 text-center text-xs text-muted-foreground">
                    You created this blood requisition.
                  </div>
                  <Link href="/requests/manage" className="block">
                    <Button variant="outline" className="w-full text-xs font-semibold h-10">
                      Manage My Requests
                    </Button>
                  </Link>
                </div>
              ) : hasResponded ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-teal/10 border border-teal/30 text-teal text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                      <Check className="h-4 w-4" />
                      <span>Commitment Registered</span>
                    </div>
                    <p className="text-[11px] opacity-90">
                      Contact number unlocked. Please coordinate with the attendant.
                    </p>
                  </div>
                  <a href={`tel:${request.contactPhone}`} className="block">
                    <Button className="w-full bg-teal text-teal-foreground hover:bg-teal/90 text-xs font-semibold h-11 gap-2">
                      <PhoneCall className="h-4 w-4" />
                      <span>Call Attendant</span>
                    </Button>
                  </a>
                </div>
              ) : (
                <Button
                  onClick={handleOpenCommitModal}
                  size="lg"
                  className={`w-full h-12 text-xs sm:text-sm font-semibold gap-2 shadow-xs transition-all duration-150 active:scale-[0.98] ${
                    isCritical
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <HeartHandshake className="h-5 w-5" />
                  <span>Volunteer to Donate</span>
                </Button>
              )}

              {/* 3-Point Donor Readiness Checklist */}
              <div className="space-y-3 pt-4 border-t border-border/60 text-xs">
                <span className="font-mono font-semibold text-foreground block text-[11px] uppercase tracking-wider">
                  Donor Self-Screening
                </span>
                <ul className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal mt-0.5 shrink-0" />
                    <span>At least <strong>56 days</strong> since your last whole blood donation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal mt-0.5 shrink-0" />
                    <span>No active fever, infection symptoms, or acute antibiotics.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal mt-0.5 shrink-0" />
                    <span>Able to reach {request.hospitalName} within the needed window.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 24/7 Helpline Support Box */}
            <div className="p-4 rounded-2xl border border-border bg-muted/30 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>Need Coordination Support?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Our volunteer escalation team is available for urgent coordination assistance:
              </p>
              <a
                href="tel:+8801700000000"
                className="font-mono text-primary font-bold hover:underline block pt-1"
              >
                +880 1700-000000
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Interactive Commitment & Readiness Dialog */}
      <Dialog open={isCommitmentModalOpen} onOpenChange={setIsCommitmentModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="h-4 w-4" />
              <span>Confirm Volunteer Commitment</span>
            </div>
            <DialogTitle className="font-heading text-xl font-bold text-foreground">
              Volunteer to Donate
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Confirm your willingness to donate blood for <strong>{request.patientName}</strong> at <strong>{request.hospitalName}</strong> in <strong>{request.district}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Summary Box */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Required Blood Group:</span>
                <span className="font-mono font-bold text-primary">{request.bloodGroup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quantity Needed:</span>
                <span className="font-bold text-foreground">{request.unitsNeeded} Bags</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Transfusion Target:</span>
                <span className="font-medium text-foreground">{getTimeLabel()}</span>
              </div>
            </div>

            {/* Attendant Note Field */}
            <div className="space-y-1.5">
              <label htmlFor="attendant-message" className="text-[11px] font-medium text-foreground block">
                Message to Hospital Attendant (Optional):
              </label>
              <input
                id="attendant-message"
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="e.g. I live nearby and can arrive within 30 minutes."
                className="w-full h-10 px-3 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="p-3 rounded-lg bg-teal/10 border border-teal/20 text-teal text-[11px] leading-relaxed">
              Upon confirming, the attendant&apos;s phone number is unlocked for direct calling, and they will receive an instant notification of your response.
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsCommitmentModalOpen(false)}
              className="text-xs h-10 flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmResponse}
              disabled={isSubmitting}
              className="text-xs font-semibold h-10 flex-1 bg-primary text-primary-foreground gap-2"
            >
              {isSubmitting ? (
                <span>Registering...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Confirm & Unlock Phone</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
