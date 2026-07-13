"use client";

/**
 * DonationHistorySection - User's donation history with eligibility countdown
 * Phase 8j - User Profile page
 *
 * Design direction:
 * - Reverse chronological order (Req 13.8)
 * - Paginated past 10 records (Req 13.9)
 * - Eligibility countdown computed client-side (Req 13.7)
 * - Shows verification status (verified/unverified)
 * - Monospace for dates and countdown numbers (data, not prose)
 *
 * Functional requirements:
 * - Req 13.8: GET /api/users/me/donations - reverse chronological
 * - Req 13.9: Paginated if >10 donations
 * - Req 13.7: Days-until-eligible calc matches 90-day rule from backend (3a)
 * - Shows verified badge for admin-verified donations
 */

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Droplet,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { Pagination } from "@/components/shared/Pagination";
import type {
  UserDonationHistoryDto,
  PaginatedResponse,
} from "@/types/dto/user.dto";
import type { PaginatedResponse as PaginatedResponseType } from "@/types/shared";

interface DonationHistorySectionProps {
  userId: string;
  lastDonationDate: string | null;
}

/**
 * Calculate days remaining until eligible to donate again
 * Matches backend eligibility service (Phase 3a) - 90-day cooldown
 */
function calculateEligibilityCountdown(lastDonationDate: string | null): {
  isEligible: boolean;
  daysRemaining: number;
  nextEligibleDate: Date | null;
} {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      daysRemaining: 0,
      nextEligibleDate: null,
    };
  }

  const lastDonation = new Date(lastDonationDate);
  const today = new Date();
  const daysSinceLastDonation = Math.floor(
    (today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 90-day cooldown requirement (Req 2.3)
  const COOLDOWN_DAYS = 90;
  const daysRemaining = Math.max(0, COOLDOWN_DAYS - daysSinceLastDonation);
  const isEligible = daysRemaining === 0;

  // Calculate next eligible date
  const nextEligibleDate = isEligible
    ? null
    : new Date(lastDonation.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

  return {
    isEligible,
    daysRemaining,
    nextEligibleDate,
  };
}

export function DonationHistorySection({
  userId,
  lastDonationDate,
}: DonationHistorySectionProps) {
  const [donations, setDonations] = useState<
    PaginatedResponseType<UserDonationHistoryDto>
  >({
    data: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate eligibility countdown (Req 13.7)
  const eligibility = calculateEligibilityCountdown(lastDonationDate);

  const fetchDonations = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/me/donations?page=${page}&limit=10`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load donation history");
      }

      const data = await response.json();
      setDonations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load donation history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handlePageChange = (page: number) => {
    fetchDonations(page);
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-2">
        <h2 className="text-lg font-semibold">Donation History</h2>
        <p className="text-sm text-muted-foreground">
          Your blood donation records and eligibility status
        </p>
      </div>

      {/* Eligibility Countdown (Req 13.7) */}
      <div
        className={`rounded-lg border p-4 ${
          eligibility.isEligible
            ? "border-teal bg-teal/5"
            : "border-ochre bg-ochre/5"
        }`}
      >
        <div className="flex items-start gap-3">
          {eligibility.isEligible ? (
            <CheckCircle2 className="size-5 text-teal mt-0.5" />
          ) : (
            <Clock className="size-5 text-ochre mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-base">
              {eligibility.isEligible
                ? "Eligible to Donate"
                : "Currently Ineligible"}
            </h3>
            {eligibility.isEligible ? (
              <p className="text-sm text-muted-foreground mt-1">
                You are eligible to donate blood. Thank you for your
                willingness to help save lives.
              </p>
            ) : (
              <div className="space-y-1 mt-1">
                <p className="text-sm text-muted-foreground">
                  You can donate again in{" "}
                  <span className="font-mono font-semibold tabular-data">
                    {eligibility.daysRemaining}
                  </span>{" "}
                  {eligibility.daysRemaining === 1 ? "day" : "days"}
                </p>
                {eligibility.nextEligibleDate && (
                  <p className="text-sm text-muted-foreground">
                    Next eligible date:{" "}
                    <span className="font-mono tabular-data">
                      {format(eligibility.nextEligibleDate, "MMM dd, yyyy")}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donations List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg border border-border bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">
                Failed to Load Donations
              </h3>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : donations.data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Droplet className="size-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold text-muted-foreground mb-1">
            No Donation History
          </h3>
          <p className="text-sm text-muted-foreground">
            Your blood donation records will appear here once you donate
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {donations.data.map((donation) => {
              const donationDate = new Date(donation.donationDate);
              const isRecent =
                new Date().getTime() - donationDate.getTime() <
                30 * 24 * 60 * 60 * 1000; // Within 30 days

              return (
                <div
                  key={donation._id}
                  className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Date and Blood Group */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span className="font-mono text-sm tabular-data">
                            {format(donationDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs font-mono font-semibold">
                          <Droplet className="size-3" />
                          {donation.bloodGroup}
                        </span>
                        {isRecent && (
                          <span className="text-xs text-teal font-medium">
                            Recent
                          </span>
                        )}
                      </div>

                      {/* Hospital and Location */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {donation.hospitalName}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" />
                          <span>{donation.district}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    <div>
                      {donation.verified ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal/10 text-teal text-xs font-medium">
                          <CheckCircle2 className="size-3.5" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                          <Clock className="size-3.5" />
                          Pending
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Details (if verified) */}
                  {donation.verified && donation.verifiedAt && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        Verified on{" "}
                        <span className="font-mono tabular-data">
                          {format(new Date(donation.verifiedAt), "MMM dd, yyyy")}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination (Req 13.9) */}
          {donations.totalPages > 1 && (
            <div className="pt-4">
              <Pagination
                metadata={donations}
                onPageChange={handlePageChange}
                showTotalCount={true}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
