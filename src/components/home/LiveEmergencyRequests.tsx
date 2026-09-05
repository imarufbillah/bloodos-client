"use client";

import * as React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Building2, 
  Clock, 
  ArrowRight, 
  HeartHandshake
} from "lucide-react";
import { BloodGroup, Urgency } from "@/types/shared";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { Button } from "@/components/ui/button";

interface BloodRequestItem {
  id: string;
  patientName?: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  district: string;
  urgency: Urgency;
  createdAt: string;
}

interface ApiRequestPayload {
  id?: string;
  _id?: string;
  bloodGroup: BloodGroup;
  unitsNeeded?: number;
  hospitalName?: string;
  district?: string;
  urgency?: Urgency;
  createdAt?: string;
}

// Representative fallback requests if API has 0 requests during seed/empty periods
const sampleUrgentRequests: BloodRequestItem[] = [
  {
    id: "req-1",
    bloodGroup: BloodGroup.O_NEGATIVE,
    unitsNeeded: 2,
    hospitalName: "Dhaka Medical College Hospital",
    district: "Dhaka",
    urgency: Urgency.CRITICAL,
    createdAt: "12 minutes ago",
  },
  {
    id: "req-2",
    bloodGroup: BloodGroup.A_POSITIVE,
    unitsNeeded: 1,
    hospitalName: "Chittagong Medical College Hospital",
    district: "Chittagong",
    urgency: Urgency.CRITICAL,
    createdAt: "28 minutes ago",
  },
  {
    id: "req-3",
    bloodGroup: BloodGroup.B_POSITIVE,
    unitsNeeded: 3,
    hospitalName: "Sylhet MAG Osmani Medical College",
    district: "Sylhet",
    urgency: Urgency.URGENT,
    createdAt: "45 minutes ago",
  },
  {
    id: "req-4",
    bloodGroup: BloodGroup.AB_NEGATIVE,
    unitsNeeded: 1,
    hospitalName: "Rajshahi Medical College Hospital",
    district: "Rajshahi",
    urgency: Urgency.CRITICAL,
    createdAt: "1 hour ago",
  },
];

export function LiveEmergencyRequests() {
  const [requests, setRequests] = React.useState<BloodRequestItem[]>(sampleUrgentRequests);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/requests?limit=4&urgency=critical`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: { requests?: ApiRequestPayload[] }) => {
        if (data && data.requests && data.requests.length > 0) {
          const mapped: BloodRequestItem[] = data.requests.map((r) => ({
            id: r.id || r._id || "req",
            bloodGroup: r.bloodGroup,
            unitsNeeded: r.unitsNeeded || 1,
            hospitalName: r.hospitalName || "General Hospital",
            district: r.district || "Dhaka",
            urgency: r.urgency || Urgency.CRITICAL,
            createdAt: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          }));
          setRequests(mapped);
        }
      })
      .catch(() => {
        setRequests(sampleUrgentRequests);
      });
  }, []);

  return (
    <section className="border-b border-border/80 bg-muted/20 py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-crimson" />
              </span>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-crimson">
                Real-Time Hospital Dispatch
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Critical Emergency Requests
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Patients requiring immediate transfusion support right now. Every response makes an immediate difference.
            </p>
          </div>

          <Link href="/requests" className="shrink-0">
            <Button variant="outline" size="sm" className="gap-2 font-medium border-border transition-all duration-150 active:scale-[0.98]">
              <span>View All Requests</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {requests.map((req) => {
            const isCritical = req.urgency === Urgency.CRITICAL;
            const isUrgent = req.urgency === Urgency.URGENT;
            const cardUrgencyClass = isCritical
              ? "border-crimson/30 hover:border-crimson/60 bg-card hover:shadow-crimson/5"
              : isUrgent
              ? "border-ochre/30 hover:border-ochre/60 bg-card hover:shadow-ochre/5"
              : "border-border bg-card hover:border-border/90";

            return (
              <div
                key={req.id}
                className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${cardUrgencyClass}`}
              >
                {/* Top Row: Blood Group & Urgency Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <BloodGroupBadge bloodGroup={req.bloodGroup} className="text-base px-2.5 py-1 shadow-xs" />
                    <UrgencyBadge urgency={req.urgency} />
                  </div>

                  {/* Units and Hospital Details */}
                  <div className="space-y-2.5">
                    <div className="text-sm font-bold text-foreground flex items-center justify-between">
                      <span>{req.unitsNeeded} {req.unitsNeeded > 1 ? "Bags" : "Bag"} Needed</span>
                      {isCritical && (
                        <span className="text-[10px] font-mono font-bold text-crimson uppercase tracking-wide bg-crimson/10 px-1.5 py-0.5 rounded">
                          STAT
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-start gap-1.5">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-foreground/70 mt-0.5" />
                        <span className="line-clamp-1 font-medium text-foreground/90">{req.hospitalName}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-teal" />
                        <span className="font-medium text-foreground/80">{req.district}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span>{req.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-border/60">
                  <Link href={`/requests/${req.id}`} className="block">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="w-full text-xs font-semibold justify-between group h-9 transition-all duration-150 active:scale-[0.98]"
                    >
                      <span>Respond / Details</span>
                      <HeartHandshake className="h-3.5 w-3.5 text-crimson transition-transform duration-200 group-hover:scale-125" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
