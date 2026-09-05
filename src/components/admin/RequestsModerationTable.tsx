"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  XCircle,
  Eye,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  rejectRequest,
  deleteRequest,
  type ModerationRequest,
} from "@/lib/api/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BloodGroup, RequestStatus } from "@/types/shared";

interface RequestsModerationTableProps {
  requests: ModerationRequest[];
  onRefresh: () => void;
  onInspect?: (req: ModerationRequest) => void;
}

const REJECT_PRESET_REASONS = [
  "Incomplete hospital details",
  "Duplicate broadcast request",
  "Invalid contact phone number",
  "Requirement fulfilled elsewhere",
  "Spam / fraudulent report",
];

const ALL_BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export function RequestsModerationTable({
  requests,
  onRefresh,
  onInspect,
}: RequestsModerationTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bloodFilter, setBloodFilter] = useState<string>("all");

  const [selectedRequest, setSelectedRequest] =
    useState<ModerationRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"reject" | "delete">("delete");
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        req.patientName.toLowerCase().includes(q) ||
        (req.hospitalName && req.hospitalName.toLowerCase().includes(q)) ||
        (req.district && req.district.toLowerCase().includes(q)) ||
        req._id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || req.status === statusFilter;
      const matchesBlood =
        bloodFilter === "all" || req.bloodGroup === bloodFilter;

      return matchesQuery && matchesStatus && matchesBlood;
    });
  }, [requests, searchQuery, statusFilter, bloodFilter]);

  const handleReject = async () => {
    if (!selectedRequest) return;
    try {
      setIsProcessing(true);
      const reason = rejectReason.trim() || "Rejected by administrator";
      await rejectRequest(selectedRequest._id, reason);
      toast.success("Request rejected successfully", {
        description: `Reason: ${reason}`,
      });
      setDialogOpen(false);
      setRejectReason("");
      onRefresh();
    } catch (error) {
      toast.error("Failed to reject request");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;
    try {
      setIsProcessing(true);
      await deleteRequest(selectedRequest._id);
      toast.success("Request deleted successfully");
      setDialogOpen(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete request");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectDialog = (request: ModerationRequest) => {
    setSelectedRequest(request);
    setDialogType("reject");
    setRejectReason("");
    setDialogOpen(true);
  };

  const openDeleteDialog = (request: ModerationRequest) => {
    setSelectedRequest(request);
    setDialogType("delete");
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Controls / Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          {/* Search Field */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, hospital, district, or ID..."
              className="w-full pl-8.5 pr-4 py-1.5 text-xs sm:text-sm bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search blood requests"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by request status"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Blood Group Filter */}
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              aria-label="Filter by blood group"
            >
              <option value="all">All Blood Groups</option>
              {ALL_BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            {(searchQuery || statusFilter !== "all" || bloodFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setBloodFilter("all");
                }}
                className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-2.5 pt-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground font-mono tabular-nums">{filteredRequests.length}</strong> of{" "}
            <strong className="text-foreground font-mono tabular-nums">{requests.length}</strong> requests
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center space-y-3 shadow-xs">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-heading text-base font-semibold text-foreground">
              No matching blood requests found
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {requests.length === 0
                ? "No requests currently require moderation. The coordination pipeline is clean."
                : "No blood requests match your active search and filter criteria. Try clearing filters."}
            </p>
          </div>
          {(searchQuery || statusFilter !== "all" || bloodFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setBloodFilter("all");
              }}
              className="mt-2 text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (md and above) */}
          <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3.5">ID</th>
                    <th className="text-left px-4 py-3.5">Patient & Location</th>
                    <th className="text-left px-4 py-3.5">Blood Group</th>
                    <th className="text-left px-4 py-3.5">Status</th>
                    <th className="text-left px-4 py-3.5">Created</th>
                    <th className="text-right px-4 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* ID */}
                      <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border">
                          {request._id.slice(-8)}
                        </span>
                      </td>

                      {/* Patient & Hospital */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {request.patientName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {request.hospitalName && (
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="h-3 w-3 text-muted-foreground/70" />
                                {request.hospitalName}
                              </span>
                            )}
                            {request.hospitalName && request.district && <span>•</span>}
                            {request.district && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground/70" />
                                {request.district}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="px-4 py-3.5">
                        <BloodGroupBadge
                          bloodGroup={request.bloodGroup as BloodGroup}
                        />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={request.status as RequestStatus} />
                      </td>

                      {/* Created Date */}
                      <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground tabular-nums">
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {onInspect && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onInspect(request)}
                              disabled={isProcessing}
                              className="h-8 px-2 text-xs text-primary hover:bg-primary/10 gap-1 touch-manipulation font-medium"
                              aria-label={`Inspect ${request.patientName}'s incident in drawer`}
                              title="Quick Inspect Drawer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Inspect</span>
                            </Button>
                          )}

                          {request.status === "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openRejectDialog(request)}
                              disabled={isProcessing}
                              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 touch-manipulation"
                              aria-label={`Reject request for ${request.patientName}`}
                              title="Reject Request"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteDialog(request)}
                            disabled={isProcessing}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 touch-manipulation"
                            aria-label={`Permanently delete request for ${request.patientName}`}
                            title="Delete Request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (under md) */}
          <div className="md:hidden space-y-3">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                        #{request._id.slice(-6)}
                      </span>
                      <StatusBadge status={request.status as RequestStatus} />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground text-base mt-1.5">
                      {request.patientName}
                    </h3>
                  </div>
                  <BloodGroupBadge
                    bloodGroup={request.bloodGroup as BloodGroup}
                  />
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50">
                  {request.hospitalName && (
                    <div className="flex items-center gap-1.5 text-foreground/90">
                      <Building2 className="h-3.5 w-3.5 text-crimson shrink-0" />
                      <span className="truncate">{request.hospitalName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {request.district || "Location unspecified"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {format(new Date(request.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onInspect ? onInspect(request) : router.push(`/requests/${request._id}`)
                    }
                    className="w-full text-xs h-9 min-h-[36px] flex items-center justify-center gap-1.5 touch-manipulation text-primary border-primary/30 hover:bg-primary/10"
                    aria-label={`Inspect ${request.patientName}'s request`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Inspect</span>
                  </Button>

                  {request.status === "pending" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openRejectDialog(request)}
                      disabled={isProcessing}
                      className="w-full text-xs h-9 min-h-[36px] text-amber-600 border-amber-600/30 hover:bg-amber-500/10 flex items-center justify-center gap-1.5 touch-manipulation"
                      aria-label={`Reject ${request.patientName}'s request`}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </Button>
                  ) : (
                    <div />
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(request)}
                    disabled={isProcessing}
                    className="w-full text-xs h-9 min-h-[36px] text-destructive border-destructive/30 hover:bg-destructive/10 flex items-center justify-center gap-1.5 touch-manipulation"
                    aria-label={`Delete ${request.patientName}'s request`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rejection Dialog with Reasons */}
      {dialogType === "reject" && dialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-foreground">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="reject-dialog-title"
                  className="font-heading font-semibold text-lg"
                >
                  Reject Blood Request
                </h3>
                <p className="text-xs text-muted-foreground">
                  Patient: {selectedRequest?.patientName} (ID: #{selectedRequest?._id.slice(-6)})
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              The requester will receive an automated notification containing this rejection rationale.
            </p>

            {/* Quick Reason Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-crimson" />
                Select preset reason:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {REJECT_PRESET_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setRejectReason(reason)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      rejectReason === reason
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reason Textarea */}
            <div className="space-y-1.5">
              <label
                htmlFor="rejection-reason"
                className="text-xs font-semibold text-foreground"
              >
                Or provide specific rejection notes:
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Type specific reason for rejection..."
                className="w-full text-sm p-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReject}
                disabled={isProcessing}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isProcessing ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {dialogType === "delete" && (
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Delete Blood Request"
          description={`Permanently delete blood request for ${selectedRequest?.patientName}? This action immediately cancels all active donor dispatches and cannot be undone.`}
          confirmText="Delete Request"
          variant="destructive"
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
