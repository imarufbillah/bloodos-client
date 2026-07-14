"use client";

/**
 * PostedRequestsSection - User's blood requests with status
 * Phase 8j - User Profile page
 *
 * Design direction:
 * - Shows user's created blood requests
 * - Status badges use consistent pill language from Phase 7h
 * - Quick actions: View Details, Manage
 * - Reverse chronological order
 *
 * Functional requirements:
 * - Fetches requests where userId matches current user
 * - Shows request status, urgency, blood group
 * - Links to request detail and manage pages
 */

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Droplet,
  Clock,
  ExternalLink,
  Settings,
  AlertCircle,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import type { BloodRequest, PaginatedResponse } from "@/types/shared";

interface PostedRequestsSectionProps {
  userId: string;
}

export function PostedRequestsSection({ userId }: PostedRequestsSectionProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user's own requests
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/requests/mine`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load your requests");
        }

        const data: PaginatedResponse<BloodRequest> = await response.json();
        setRequests(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load requests"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h2 className="text-lg font-semibold">Posted Requests</h2>
          <p className="text-sm text-muted-foreground">
            Blood requests you have created
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/requests/manage")}
        >
          <Settings className="mr-1.5" />
          Manage All
        </Button>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-lg border border-border bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">
                Failed to Load Requests
              </h3>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <FileText className="size-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold text-muted-foreground mb-1">
            No Requests Yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't posted any blood requests
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/requests/add")}
          >
            Post a Request
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const neededByDate = new Date(request.neededByDate);
            const isUrgent =
              neededByDate.getTime() - new Date().getTime() <
              48 * 60 * 60 * 1000; // Within 48 hours
            const isPast = neededByDate < new Date();

            return (
              <div
                key={request._id}
                className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-3">
                  {/* Header: Patient Name + Badges */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-base">
                        {request.patientName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {request.hospitalName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={request.status} />
                      <UrgencyBadge urgency={request.urgency} />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid gap-2 sm:grid-cols-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Droplet className="size-4 text-muted-foreground" />
                      <span className="font-mono font-semibold">
                        {request.bloodGroup}
                      </span>
                      <span className="text-muted-foreground">
                        ({request.unitsNeeded}{" "}
                        {request.unitsNeeded === 1 ? "unit" : "units"})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-4" />
                      <span>{request.district}</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        isPast
                          ? "text-destructive"
                          : isUrgent
                          ? "text-ochre"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Clock className="size-4" />
                      <span className="font-mono tabular-data">
                        {isPast ? "Expired" : format(neededByDate, "MMM dd")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/requests/${request._id}`)}
                    >
                      <ExternalLink className="mr-1.5" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Show all link if more than 5 requests */}
          {requests.length > 5 && (
            <div className="text-center pt-2">
              <Button
                variant="link"
                onClick={() => router.push("/requests/manage")}
              >
                View all {requests.length} requests →
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
