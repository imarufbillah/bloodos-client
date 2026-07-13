"use client";

/**
 * ResponseHistorySection - User's donor responses to blood requests
 * Phase 8j - User Profile page
 *
 * Design direction:
 * - Shows responses user has made as a donor
 * - Includes parent request context (patient name, hospital, status)
 * - Response status badges (offered, accepted, declined, completed)
 * - Links to original request for details
 *
 * Functional requirements:
 * - Req 13.10: GET /api/users/me/responses (inferred from plan §0.E)
 * - Returns response history with parent request summary
 * - Reverse chronological order
 */

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Droplet,
  ExternalLink,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import type { UserResponseHistoryDto } from "@/types/dto/user.dto";
import type { PaginatedResponse } from "@/types/shared";

interface ResponseHistorySectionProps {
  userId: string;
}

/**
 * Get icon and color for response status
 */
function getResponseStatusDisplay(status: string): {
  icon: React.ReactNode;
  label: string;
  className: string;
} {
  switch (status) {
    case "offered":
      return {
        icon: <Clock className="size-3.5" />,
        label: "Offered",
        className: "bg-ochre/10 text-ochre",
      };
    case "accepted":
      return {
        icon: <CheckCircle2 className="size-3.5" />,
        label: "Accepted",
        className: "bg-teal/10 text-teal",
      };
    case "declined":
      return {
        icon: <XCircle className="size-3.5" />,
        label: "Declined",
        className: "bg-slate/10 text-slate",
      };
    case "completed":
      return {
        icon: <CheckCircle2 className="size-3.5" />,
        label: "Completed",
        className: "bg-teal/10 text-teal",
      };
    default:
      return {
        icon: <Clock className="size-3.5" />,
        label: status,
        className: "bg-muted text-muted-foreground",
      };
  }
}

export function ResponseHistorySection({ userId }: ResponseHistorySectionProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<UserResponseHistoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/me/responses`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load response history");
        }

        const data: PaginatedResponse<UserResponseHistoryDto> =
          await response.json();
        setResponses(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load responses"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, []);

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-2">
        <h2 className="text-lg font-semibold">Response History</h2>
        <p className="text-sm text-muted-foreground">
          Blood requests you have responded to as a donor
        </p>
      </div>

      {/* Responses List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-lg border border-border bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">
                Failed to Load Responses
              </h3>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : responses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <MessageSquare className="size-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold text-muted-foreground mb-1">
            No Responses Yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't responded to any blood requests yet
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/requests")}
          >
            Browse Requests
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {responses.map((response) => {
            const responseDate = new Date(response.createdAt);
            const statusDisplay = getResponseStatusDisplay(response.status);
            const requestNeededBy = new Date(response.request.neededByDate);
            const isRequestExpired = requestNeededBy < new Date();

            return (
              <div
                key={response._id}
                className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-3">
                  {/* Header: Response Status + Date */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusDisplay.className}`}
                      >
                        {statusDisplay.icon}
                        {statusDisplay.label}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono tabular-data">
                        {format(responseDate, "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-base">
                          {response.request.patientName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {response.request.hospitalName}
                        </p>
                      </div>
                      <UrgencyBadge urgency={response.request.urgency as any} />
                    </div>

                    {/* Request Details Grid */}
                    <div className="grid gap-2 sm:grid-cols-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Droplet className="size-4 text-muted-foreground" />
                        <span className="font-mono font-semibold">
                          {response.request.bloodGroup}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="size-4" />
                        <span>{response.request.district}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 ${
                          isRequestExpired
                            ? "text-muted-foreground line-through"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Calendar className="size-4" />
                        <span className="font-mono tabular-data">
                          {format(requestNeededBy, "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>

                    {/* Request Status */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        Request Status:
                      </span>
                      <span className="font-medium capitalize">
                        {response.request.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* User's Message (if provided) */}
                  {response.message && (
                    <div className="rounded-md bg-muted/50 p-3 text-sm">
                      <p className="text-muted-foreground italic">
                        "{response.message}"
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/requests/${response.requestId}`)
                      }
                    >
                      <ExternalLink className="mr-1.5" />
                      View Request
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Info if many responses */}
          {responses.length > 5 && (
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Showing recent responses. Older responses may be archived.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
