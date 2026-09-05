"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Droplet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Award,
  FileCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { UserDonationHistoryDto } from "@/types/dto/user.dto";
import type { PaginatedResponse } from "@/types/shared";
import { apiFetch } from "@/lib/api-client";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface DonationHistorySectionProps {
  userId?: string;
  lastDonationDate: string | null;
}

/**
 * 56-day biological cooldown computation (WHO / Bangladesh Red Crescent standard)
 */
function calculateEligibilityCountdown(lastDonationDate: string | null): {
  isEligible: boolean;
  daysRemaining: number;
  progressPercent: number;
  nextEligibleDate: Date | null;
} {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      daysRemaining: 0,
      progressPercent: 100,
      nextEligibleDate: null,
    };
  }

  const lastDonation = new Date(lastDonationDate);
  const today = new Date();
  const daysSinceLastDonation = Math.floor(
    (today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24),
  );

  const COOLDOWN_DAYS = 56;
  const daysRemaining = Math.max(0, COOLDOWN_DAYS - daysSinceLastDonation);
  const isEligible = daysRemaining === 0;
  const progressPercent = Math.min(100, Math.round((daysSinceLastDonation / COOLDOWN_DAYS) * 100));

  const nextEligibleDate = isEligible
    ? null
    : new Date(lastDonation.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

  return {
    isEligible,
    daysRemaining,
    progressPercent,
    nextEligibleDate,
  };
}

export function DonationHistorySection({
  lastDonationDate,
}: DonationHistorySectionProps) {
  const [donations, setDonations] = React.useState<
    PaginatedResponse<UserDonationHistoryDto>
  >({
    data: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] =
    React.useState<UserDonationHistoryDto | null>(null);

  const eligibility = calculateEligibilityCountdown(lastDonationDate);

  const fetchDonations = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/api/users/me/donations?page=${page}&limit=10`,
      );

      if (!response.ok) {
        throw new Error("Failed to load donation history");
      }

      const data = await response.json();
      setDonations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load donation history",
      );
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDonations();
  }, []);

  const handlePageChange = (page: number) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    fetchDonations(page);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-border/70">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Donation History & Certificates
          </h2>
          <p className="text-xs text-muted-foreground">
            Verified whole blood donations and biological recovery tracking.
          </p>
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          {donations.totalCount} RECORD{donations.totalCount === 1 ? "" : "S"}
        </span>
      </div>

      {/* 56-Day Biological Rest Meter */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition-all ${
          eligibility.isEligible
            ? "border-teal/30 bg-teal/5"
            : "border-ochre/30 bg-ochre/5"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              eligibility.isEligible
                ? "bg-teal/10 text-teal"
                : "bg-ochre/10 text-ochre"
            }`}
          >
            {eligibility.isEligible ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">
                {eligibility.isEligible
                  ? "Eligible for Emergency Whole Blood Donation"
                  : "Biological Recovery Cooldown Active"}
              </h3>
              <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                {eligibility.isEligible ? "100% READY" : `${eligibility.daysRemaining}d REMAINING`}
              </span>
            </div>

            <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  eligibility.isEligible ? "bg-teal" : "bg-ochre"
                }`}
                style={{ width: `${eligibility.progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {eligibility.isEligible
                ? "Your 56-day rest cycle is complete. You can respond to urgent transfusion broadcasts."
                : eligibility.nextEligibleDate
                ? `Next eligible donation date: ${format(eligibility.nextEligibleDate, "MMM dd, yyyy")} (${eligibility.daysRemaining} days remaining).`
                : "Recovery cooldown active."}
            </p>
          </div>
        </div>
      </div>


      {/* Donations List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-border/60 bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-destructive mx-auto" />
          <p className="text-xs font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchDonations(1)}>
            Try Again
          </Button>
        </div>
      ) : donations.data.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
          <Droplet className="h-8 w-8 text-muted-foreground/40 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              No Donation Records Logged Yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              When you fulfill an emergency blood request, your verified donation history and certificates will appear here.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/requests">
              <Button size="sm" className="bg-crimson hover:bg-crimson/90 text-paper text-xs gap-1.5 rounded-xl font-semibold">
                <Droplet className="h-3.5 w-3.5 fill-paper" />
                <span>Browse Emergency Requests</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.data.map((donation) => (
            <div
              key={donation._id}
              className="group rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-foreground/25 transition-all shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-crimson/10 border border-crimson/30 text-crimson font-mono font-bold text-xs">
                    <Droplet className="h-3 w-3 fill-crimson" />
                    <span>{donation.bloodGroup}</span>
                  </span>

                  <span className="font-semibold text-sm text-foreground">
                    Whole Blood Donation
                  </span>

                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] px-2 py-0.5 gap-1 ${
                      donation.verified
                        ? "bg-teal/10 text-teal border-teal/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {donation.verified ? (
                      <>
                        <ShieldCheck className="h-3 w-3" />
                        <span>HOSPITAL VERIFIED</span>
                      </>
                    ) : (
                      <span>SELF-REPORTED</span>
                    )}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{format(new Date(donation.donationDate), "MMM dd, yyyy")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  {donation.hospitalName && (
                    <span className="flex items-center gap-1 text-foreground/90 font-medium">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{donation.hospitalName}</span>
                    </span>
                  )}
                  {donation.district && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-ochre" />
                      <span>{donation.district}</span>
                    </span>
                  )}
                </div>

                {donation.verified && (
                  <button
                    type="button"
                    aria-label={`View official lifesaver certificate for whole blood donation on ${format(new Date(donation.donationDate), "MMM dd, yyyy")}`}
                    onClick={() => setSelectedDonation(donation)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline self-start sm:self-auto font-mono"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>View Digital Certificate</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {donations.totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                metadata={donations}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Digital Donation Certificate Dialog */}
      <Dialog open={!!selectedDonation} onOpenChange={(open) => !open && setSelectedDonation(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6 space-y-4">
          <DialogHeader className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal border border-teal/30">
              <Award className="h-6 w-6" />
            </div>
            <DialogTitle className="font-heading text-xl font-bold text-foreground">
              Official Lifesaver Certificate
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Verified clinical blood donation recorded on the BloodOS National Registry.
            </DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Donation Date:</span>
                <span className="font-semibold text-foreground">
                  {format(new Date(selectedDonation.donationDate), "MMMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Blood Type:</span>
                <span className="font-bold text-crimson">
                  {selectedDonation.bloodGroup} (1 Unit Whole Blood)
                </span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Medical Facility:</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]">
                  {selectedDonation.hospitalName || "Verified Hospital"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">District / Region:</span>
                <span className="font-semibold text-foreground">
                  {selectedDonation.district || "Bangladesh"}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={() => setSelectedDonation(null)}
            className="w-full rounded-xl bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider"
          >
            Close Certificate
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
