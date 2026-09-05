"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
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
  Building2,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import type { UserResponseHistoryDto } from "@/types/dto/user.dto";
import type { PaginatedResponse } from "@/types/shared";
import { apiFetch } from "@/lib/api-client";

interface ResponseHistorySectionProps {
  userId?: string;
}

function getResponseStatusDisplay(status: string): {
  icon: React.ReactNode;
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case "offered":
      return {
        icon: <Clock className="h-3 w-3" />,
        label: "OFFERED",
        badgeClass: "bg-ochre/10 text-ochre border-ochre/30",
      };
    case "accepted":
      return {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: "ACCEPTED",
        badgeClass: "bg-teal/10 text-teal border-teal/30",
      };
    case "declined":
      return {
        icon: <XCircle className="h-3 w-3" />,
        label: "DECLINED",
        badgeClass: "bg-muted text-muted-foreground border-border",
      };
    case "completed":
      return {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: "COMPLETED",
        badgeClass: "bg-teal/15 text-teal border-teal/40 font-bold",
      };
    default:
      return {
        icon: <Clock className="h-3 w-3" />,
        label: status.toUpperCase(),
        badgeClass: "bg-muted text-muted-foreground border-border",
      };
  }
}

export function ResponseHistorySection({
  userId,
}: ResponseHistorySectionProps) {
  const [responses, setResponses] = React.useState<UserResponseHistoryDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchResponses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/users/me/responses");

      if (!response.ok) {
        throw new Error("Failed to load your response history");
      }

      const data: PaginatedResponse<UserResponseHistoryDto> =
        await response.json();
      setResponses(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load responses",
      );
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-border/70">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
            My Donor Volunteer Responses
          </h2>
          <p className="text-xs text-muted-foreground">
            Emergency requests you volunteered to donate blood for, including coordination status.
          </p>
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          {responses.length} RESPONSE{responses.length === 1 ? "" : "S"}
        </span>
      </div>

      {/* Responses List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-border/60 bg-muted/20 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/5 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-destructive mx-auto" />
          <p className="text-xs font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchResponses}>
            Try Again
          </Button>
        </div>
      ) : responses.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
          <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              No Volunteer Responses Yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              When you volunteer to donate for an emergency request, your coordination log and contact reveals will appear here.
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
          {responses.map((resp) => {
            const statusDisplay = getResponseStatusDisplay(resp.status);
            const req = resp.request;

            return (
              <div
                key={resp._id}
                className="group rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-foreground/25 transition-all shadow-2xs space-y-3"
              >
                {/* Header: Status + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`font-mono text-[10px] px-2 py-0.5 gap-1 ${statusDisplay.badgeClass}`}>
                      {statusDisplay.icon}
                      <span>{statusDisplay.label}</span>
                    </Badge>

                    {req?.bloodGroup && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-crimson/10 border border-crimson/30 text-crimson font-mono font-bold text-xs">
                        <Droplet className="h-3 w-3 fill-crimson" />
                        <span>{req.bloodGroup}</span>
                      </span>
                    )}

                    <span className="text-sm font-semibold text-foreground truncate">
                      {req?.patientName ? `For ${req.patientName}` : "Emergency Request"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(resp.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                </div>

                {/* Request Details */}
                {req && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                      {req.hospitalName && (
                        <span className="flex items-center gap-1 text-foreground/90 font-medium">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{req.hospitalName}</span>
                        </span>
                      )}

                      {req.district && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-ochre" />
                          <span>{req.district}</span>
                        </span>
                      )}

                      {resp.status === "accepted" && (
                        <span className="inline-flex items-center gap-1 text-teal font-mono font-semibold">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Contact Coordination Open</span>
                        </span>
                      )}
                    </div>

                    <Link href={`/requests/${req._id || (resp as any).requestId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold gap-1.5"
                      >
                        <span>View Request</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
