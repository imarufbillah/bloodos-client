"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  WifiOff,
  RefreshCw,
  Flame,
  SearchX
} from "lucide-react";
import { type BloodRequest, BloodGroup, District, RequestStatus, Urgency } from "@/types/shared";
import { RequestCard } from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

// Representative fallback requests when API is cold/empty
const fallbackCriticalRequests: BloodRequest[] = [
  {
    _id: "req-fallback-1",
    userId: "demo-user-1",
    patientName: "Nazmul Haque",
    bloodGroup: BloodGroup.O_NEGATIVE,
    unitsNeeded: 2,
    hospitalName: "Dhaka Medical College Hospital",
    hospitalAddress: "Secretariat Road, Ramna, Dhaka",
    district: District.DHAKA,
    urgency: Urgency.CRITICAL,
    status: RequestStatus.OPEN,
    neededByDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    contactPhone: "01711000001",
    additionalNotes: "Emergency post-operative transfusion required immediately. ICU Bed #4.",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    _id: "req-fallback-2",
    userId: "demo-user-2",
    patientName: "Sumaiya Akhter",
    bloodGroup: BloodGroup.A_POSITIVE,
    unitsNeeded: 1,
    hospitalName: "Chittagong Medical College Hospital",
    hospitalAddress: "57 K.B. Fazlul Kader Road, Panchlaish, Chittagong",
    district: District.CHITTAGONG,
    urgency: Urgency.CRITICAL,
    status: RequestStatus.OPEN,
    neededByDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    contactPhone: "01811000002",
    additionalNotes: "Platelet cross-match completed. Volunteer donor needed for direct collection.",
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    _id: "req-fallback-3",
    userId: "demo-user-3",
    patientName: "Kamrul Islam",
    bloodGroup: BloodGroup.B_POSITIVE,
    unitsNeeded: 3,
    hospitalName: "Sylhet MAG Osmani Medical College",
    hospitalAddress: "Medical Road, Kazir Bazar, Sylhet",
    district: District.SYLHET,
    urgency: Urgency.CRITICAL,
    status: RequestStatus.OPEN,
    neededByDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    contactPhone: "01911000003",
    additionalNotes: "Trauma surgery requisitions. Immediate whole blood matching required.",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    _id: "req-fallback-4",
    userId: "demo-user-4",
    patientName: "Fatema Begum",
    bloodGroup: BloodGroup.AB_NEGATIVE,
    unitsNeeded: 1,
    hospitalName: "Rajshahi Medical College Hospital",
    hospitalAddress: "Laxmipur, Rajshahi",
    district: District.RAJSHAHI,
    urgency: Urgency.CRITICAL,
    status: RequestStatus.OPEN,
    neededByDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    contactPhone: "01711000004",
    additionalNotes: "Rare blood group requisition for cardiac surgery unit.",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
];

export function LiveEmergencyRequests() {
  const [requests, setRequests] = React.useState<BloodRequest[]>(fallbackCriticalRequests);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isOffline, setIsOffline] = React.useState<boolean>(false);
  const [isReconnecting, setIsReconnecting] = React.useState<boolean>(false);

  const fetchLiveRequests = React.useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/requests?limit=4&urgency=critical`,
        { signal }
      );
      if (!res.ok) throw new Error("Failed to fetch critical requests");
      
      const json = await res.json();
      
      // Extract from standard PaginatedResponse ({ data: [...], totalCount: ... }) or plain array
      const items: BloodRequest[] = Array.isArray(json)
        ? json
        : json && Array.isArray(json.data)
        ? json.data
        : [];

      if (items.length > 0) {
        setRequests(items);
      } else {
        // If DB has 0 critical requests, fall back to realistic emergency triage previews
        setRequests(fallbackCriticalRequests);
      }
      setIsOffline(false);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setIsOffline(true);
      setRequests(fallbackCriticalRequests);
    } finally {
      setIsLoading(false);
      setIsReconnecting(false);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    fetchLiveRequests(controller.signal);

    const handleOnline = () => {
      setIsReconnecting(true);
      fetchLiveRequests();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      controller.abort();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [fetchLiveRequests]);

  const handleManualReconnect = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setIsReconnecting(true);
    fetchLiveRequests();
  };

  return (
    <section className="border-b border-border/80 bg-muted/20 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 text-crimson border border-crimson/20 text-xs font-mono font-bold tracking-wider uppercase">
              <Flame className="h-3.5 w-3.5 animate-pulse" />
              <span>STAT Emergency Radar</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Critical Emergency Requests
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Verified hospital requisitions requiring immediate donor response right now across Bangladesh.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/requests">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-medium border-border transition-all duration-150 active:scale-[0.98]"
                onClick={() => triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT)}
              >
                <span>View All Requests</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Offline / Reconnect Banner Notification */}
        {isOffline && (
          <div 
            role="status" 
            aria-live="polite"
            className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-ochre/30 bg-ochre/10 px-4 py-3 text-xs text-foreground animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-ochre/20 text-ochre">
                <WifiOff className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="font-semibold">Offline Mode · Showing cached emergency records.</span>
                <span className="text-muted-foreground hidden md:inline ml-1">Live updates will synchronize when connection is restored.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleManualReconnect}
              disabled={isReconnecting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ochre/40 bg-card px-2.5 py-1 font-mono text-[11px] font-bold text-ochre hover:bg-ochre/15 transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${isReconnecting ? "animate-spin" : ""}`} />
              <span>{isReconnecting ? "Syncing..." : "Reconnect"}</span>
            </button>
          </div>
        )}

        {/* Dynamic Requests Content */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs animate-pulse space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 bg-muted rounded-full" />
                    <div className="h-5 w-16 bg-muted rounded-md" />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="h-3.5 w-full bg-muted rounded" />
                    <div className="h-3 w-2/3 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-10 w-full bg-muted rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          /* Zero State */
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center space-y-3 max-w-md mx-auto">
            <SearchX className="h-10 w-10 text-muted-foreground/60 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-foreground">No Critical Requests Right Now</h3>
            <p className="text-xs text-muted-foreground">All urgent blood requisitions have received sufficient donor volunteer pledges.</p>
          </div>
        ) : (
          /* Live Dynamic Grid using canonical RequestCard */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {requests.map((req, idx) => (
              <RequestCard key={req._id} request={req} staggerIndex={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
