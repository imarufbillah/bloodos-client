"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  AlertTriangle,
  Activity,
  Droplet,
  Clock,
  Building2,
  Calendar,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Radio,
  FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { Pagination } from "@/components/shared/Pagination";
import type {
  BloodRequest,
  PaginatedResponse,
  RequestStatus,
} from "@/types/shared";
import { apiFetch } from "@/lib/api-client";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

type ManageRequestsContentProps = {
  initialData: PaginatedResponse<BloodRequest>;
  initialPage: number;
};

type StatusFilter = "ALL" | "ACTIVE" | "FULFILLED" | "CLOSED";

export function ManageRequestsContent({
  initialData,
  initialPage,
}: ManageRequestsContentProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");

  // Server data
  const requests = initialData.data;
  const pagination = {
    page: initialData.page,
    limit: initialData.limit,
    totalPages: initialData.totalPages,
    totalCount: initialData.totalCount,
    hasNextPage: initialData.hasNextPage,
    hasPrevPage: initialData.hasPrevPage,
  };

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<{
    isOpen: boolean;
    requestId: string | null;
    patientName: string | null;
  }>({
    isOpen: false,
    requestId: null,
    patientName: null,
  });

  // Action status loading
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  // Telemetry metrics calculation
  const metrics = React.useMemo(() => {
    let openCount = 0;
    let inProgressCount = 0;
    let fulfilledCount = 0;
    let closedCount = 0;
    let totalUnits = 0;

    requests.forEach((req) => {
      totalUnits += req.unitsNeeded || 1;
      if (req.status === "open") openCount++;
      else if (req.status === "in_progress") inProgressCount++;
      else if (req.status === "fulfilled") fulfilledCount++;
      else if (req.status === "cancelled" || req.status === "expired") closedCount++;
    });

    return {
      total: pagination.totalCount || requests.length,
      active: openCount + inProgressCount,
      open: openCount,
      inProgress: inProgressCount,
      fulfilled: fulfilledCount,
      closed: closedCount,
      totalUnits,
    };
  }, [requests, pagination.totalCount]);

  // Client-side filtering for search & status tabs
  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      // Status filter
      if (statusFilter === "ACTIVE") {
        if (req.status !== "open" && req.status !== "in_progress") return false;
      } else if (statusFilter === "FULFILLED") {
        if (req.status !== "fulfilled") return false;
      } else if (statusFilter === "CLOSED") {
        if (req.status !== "cancelled" && req.status !== "expired") return false;
      }

      // Search query filter (patient, hospital, district)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPatient = req.patientName.toLowerCase().includes(q);
        const matchesHospital = req.hospitalName.toLowerCase().includes(q);
        const matchesDistrict = req.district.toLowerCase().includes(q);
        const matchesBlood = req.bloodGroup.toLowerCase().includes(q);
        return matchesPatient || matchesHospital || matchesDistrict || matchesBlood;
      }

      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  // Handle page change - triggers server refetch via router.push
  const handlePageChange = (page: number) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setCurrentPage(page);
    router.push(`/requests/manage?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle status change (Mark Fulfilled / Cancel)
  const handleStatusChange = async (
    requestId: string,
    newStatus: RequestStatus,
  ) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
    setActionLoading(requestId);

    try {
      const response = await apiFetch(`/api/requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update status");
      }

      toast.success(
        `Request ${newStatus === "fulfilled" ? "marked as fulfilled" : "cancelled"} successfully`,
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete (after confirmation)
  const handleDelete = async () => {
    if (!deleteDialog.requestId) return;

    triggerTactileFeedback(HAPTIC_PATTERNS.HEAVY);
    setActionLoading(deleteDialog.requestId);

    try {
      const response = await apiFetch(
        `/api/requests/${deleteDialog.requestId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete request");
      }

      toast.success("Request removed from dispatch system");
      setDeleteDialog({ isOpen: false, requestId: null, patientName: null });

      if (requests.length === 1 && currentPage > 1) {
        router.push(`/requests/manage?page=${currentPage - 1}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete request",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (requestId: string, patientName: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setDeleteDialog({
      isOpen: true,
      requestId,
      patientName,
    });
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, requestId: null, patientName: null });
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      {/* Header Banner */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-xs">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal/10 text-teal border border-teal/20 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Operations Console
                </span>
                <span className="font-mono text-xs text-muted-foreground hidden sm:inline-block">
                  • Coordinator Dispatch
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Manage Blood Requests
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Monitor live donor responses, track hospital transfusions, mark fulfillment, or cancel active broadcasts.
              </p>
            </div>

            <Button
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                router.push("/requests/add");
              }}
              className="h-11 rounded-xl bg-crimson hover:bg-crimson/90 text-paper font-semibold text-xs uppercase tracking-wider gap-2 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create Blood Request</span>
            </Button>
          </div>

          {/* Telemetry Summary Cards Strip */}
          {requests.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
              <div className="p-3.5 rounded-xl border border-border/80 bg-card/80 flex flex-col justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Total Managed
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
                    {metrics.total}
                  </span>
                  <Activity className="h-4 w-4 text-muted-foreground/60" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-crimson/30 bg-crimson/5 flex flex-col justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-crimson font-medium">
                  Active Dispatch
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-2xl font-bold text-crimson tabular-nums">
                    {metrics.active}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-teal/30 bg-teal/5 flex flex-col justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-teal font-medium">
                  Fulfilled
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-2xl font-bold text-teal tabular-nums">
                    {metrics.fulfilled}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-teal" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/80 bg-card/80 flex flex-col justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Bags Requested
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
                    {metrics.totalUnits}
                  </span>
                  <Droplet className="h-4 w-4 text-crimson fill-crimson" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Console Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filter & Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-card border border-border/80 p-3.5 rounded-2xl shadow-xs">
          {/* Segmented Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "ALL", label: "All Requests" },
                { id: "ACTIVE", label: "Active Dispatch" },
                { id: "FULFILLED", label: "Fulfilled" },
                { id: "CLOSED", label: "Cancelled / Expired" },
              ] as const
            ).map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                    setStatusFilter(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Query Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search patient, hospital, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 rounded-xl bg-background text-xs border-border/70 font-mono"
            />
          </div>
        </div>

        {/* Requests Render */}
        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
              <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground mb-1">
              {requests.length === 0 ? "No Blood Requests Posted" : "No Matching Requests Found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-5 leading-relaxed">
              {requests.length === 0
                ? "You haven't posted any blood donation requests yet. Create an emergency broadcast to reach matching donors in your district."
                : "No requests match your selected status tab or search query. Try clearing the filter."}
            </p>
            {requests.length === 0 ? (
              <Button
                onClick={() => router.push("/requests/add")}
                className="rounded-xl bg-crimson text-paper font-semibold text-xs"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Post First Request
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("ALL");
                  setSearchQuery("");
                }}
                className="rounded-xl text-xs font-mono"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredRequests.map((request) => {
              const isActionLoading = actionLoading === request._id;
              // Can only fulfill from in_progress status (state machine rule)
              const canFulfill = request.status === "in_progress";
              const canCancel =
                request.status === "open" || request.status === "in_progress";

              return (
                <div
                  key={request._id}
                  className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 hover:border-border transition-all shadow-xs space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Patient & Medical Metadata */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-crimson/10 border border-crimson/20 text-crimson shrink-0">
                        <span className="font-mono font-bold text-base leading-none">
                          {request.bloodGroup}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                          {request.unitsNeeded} {request.unitsNeeded === 1 ? "Unit" : "Units"}
                        </span>
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-foreground">
                            {request.patientName}
                          </h3>
                          <StatusBadge status={request.status} />
                          {request.urgency && (
                            <UrgencyBadge urgency={request.urgency} />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                          <span className="flex items-center gap-1 text-foreground font-medium">
                            <Building2 className="h-3.5 w-3.5 text-teal" />
                            <span>{request.hospitalName}</span>
                          </span>
                          <span>• {request.district}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Needed:{" "}
                              {new Date(request.neededByDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </span>
                          <span className="text-muted-foreground/70">
                            Created:{" "}
                            {new Date(request.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Operational Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
                      {/* View Dispatch Detail */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                          router.push(`/requests/${request._id}`);
                        }}
                        disabled={isActionLoading}
                        className="rounded-xl text-xs font-mono h-9 gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Dispatch</span>
                      </Button>

                      {/* Fulfill Action */}
                      {canFulfill && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request._id, "fulfilled")}
                          disabled={isActionLoading}
                          className="rounded-xl text-xs font-mono h-9 gap-1.5 text-teal border-teal/30 hover:bg-teal/10 hover:text-teal"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Mark Fulfilled</span>
                        </Button>
                      )}

                      {/* Cancel Action */}
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request._id, "cancelled")}
                          disabled={isActionLoading}
                          className="rounded-xl text-xs font-mono h-9 gap-1.5 text-ochre border-ochre/30 hover:bg-ochre/10 hover:text-ochre"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Cancel Broadcast</span>
                        </Button>
                      )}

                      {/* Delete Action */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(request._id, request.patientName)}
                        disabled={isActionLoading}
                        className="rounded-xl text-xs font-mono h-9 text-destructive hover:bg-destructive/10 hover:text-destructive px-2.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>

                  {/* Additional notes preview if present */}
                  {request.additionalNotes && (
                    <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground leading-relaxed flex items-start gap-2 bg-muted/20 p-2.5 rounded-xl">
                      <span className="font-mono font-bold text-[10px] uppercase text-muted-foreground shrink-0">
                        Notes:
                      </span>
                      <p className="line-clamp-2">{request.additionalNotes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pt-4">
            <Pagination metadata={pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <DialogTitle className="font-heading font-bold text-lg">
              Delete Blood Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Are you sure you want to permanently delete the emergency request for{" "}
              <span className="font-semibold text-foreground">
                {deleteDialog.patientName}
              </span>
              ? This action will remove the broadcast from the live radar and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={actionLoading !== null}
              className="rounded-xl text-xs font-mono"
            >
              Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading !== null}
              className="rounded-xl text-xs font-mono gap-1.5"
            >
              {actionLoading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Broadcast</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

