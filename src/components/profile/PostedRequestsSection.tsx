"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  MapPin,
  Droplet,
  Clock,
  ExternalLink,
  Settings,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  Activity,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import type { BloodRequest, PaginatedResponse } from "@/types/shared";
import { apiFetch } from "@/lib/api-client";

interface PostedRequestsSectionProps {
  userId?: string;
}

export function PostedRequestsSection({ userId }: PostedRequestsSectionProps) {
  const [requests, setRequests] = React.useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/requests/mine");

      if (!response.ok) {
        throw new Error("Failed to load your posted requests");
      }

      const data: PaginatedResponse<BloodRequest> = await response.json();
      setRequests(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load requests",
      );
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Emergency Blood Requests
          </h2>
          <p className="text-xs text-muted-foreground">
            Hospital blood requests created by your account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/requests/add">
            <Button
              size="sm"
              className="h-9 px-3 rounded-xl bg-crimson hover:bg-crimson/90 text-paper font-semibold text-xs gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Request</span>
            </Button>
          </Link>

          <Link href="/requests/manage">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-xl border-border/80 text-xs font-semibold gap-1.5"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Manage Console</span>
            </Button>
          </Link>
        </div>
      </div>


      {/* Requests List */}
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
          <Button variant="outline" size="sm" onClick={fetchRequests}>
            Try Again
          </Button>
        </div>
      ) : requests.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
          <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              No Blood Requests Created Yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              If a patient or family member needs blood, create an emergency dispatch request to alert compatible donors.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/requests/add">
              <Button size="sm" className="bg-crimson hover:bg-crimson/90 text-paper text-xs gap-1.5 rounded-xl font-semibold">
                <Plus className="h-3.5 w-3.5" />
                <span>Create Emergency Request</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const neededByDate = new Date(request.neededByDate);
            const isPast = neededByDate.getTime() < Date.now();
            const unitsNeeded = request.unitsNeeded || 1;

            return (
              <div
                key={request._id}
                className="group rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-foreground/25 transition-all shadow-2xs space-y-3.5"
              >
                {/* Top Row: Patient Name & Urgency Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/60">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-base text-foreground">
                        {request.patientName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {request.hospitalName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                      Requirement: {unitsNeeded} {unitsNeeded === 1 ? "unit" : "units"} whole blood
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <StatusBadge status={request.status} />
                    <UrgencyBadge urgency={request.urgency} />
                  </div>
                </div>

                {/* Bottom Row: Metadata & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-crimson">
                      <Droplet className="h-3.5 w-3.5 fill-crimson" />
                      <span>{request.bloodGroup}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-ochre" />
                      <span>{request.district}</span>
                    </span>

                    <span className={`flex items-center gap-1 font-mono ${isPast ? "text-destructive" : "text-muted-foreground"}`}>
                      <Clock className="h-3.5 w-3.5" />
                      <span>{isPast ? "Expired" : `Needed by ${format(neededByDate, "MMM dd, yyyy")}`}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/requests/${request._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={`View details for ${request.patientName}'s blood request`}
                        className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold gap-1.5"
                      >
                        <span>View Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
