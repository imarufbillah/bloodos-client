"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Pagination } from "@/components/shared/Pagination";
import type {
  BloodRequest,
  PaginatedResponse,
  RequestStatus,
} from "@/types/shared";
import { apiFetch } from "@/lib/api-client";

/**
 * ManageRequestsContent — Client component for managing user's blood requests
 * (Refactored for Server Components)
 *
 * Improvements:
 * - Receives initialData from server component
 * - Uses router.push for pagination (triggers server refetch)
 * - No initial data fetching in useEffect
 * - Optimistic UI updates with initialData
 */

type ManageRequestsContentProps = {
  initialData: PaginatedResponse<BloodRequest>;
  initialPage: number;
};

export function ManageRequestsContent({
  initialData,
  initialPage,
}: ManageRequestsContentProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  
  // Use server data directly
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

  // Loading state for actions
  const [actionLoading, setActionLoading] = React.useState<string | null>(
    null
  );

  // Handle page change - triggers server refetch via router.push
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/requests/manage?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle status change (Mark Fulfilled / Cancel)
  const handleStatusChange = async (
    requestId: string,
    newStatus: RequestStatus
  ) => {
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
        `Request ${newStatus === "fulfilled" ? "marked as fulfilled" : "cancelled"} successfully`
      );

      // Refresh the page to get updated data from server
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete (after confirmation)
  const handleDelete = async () => {
    if (!deleteDialog.requestId) return;

    setActionLoading(deleteDialog.requestId);

    try {
      const response = await apiFetch(`/api/requests/${deleteDialog.requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete request");
      }

      toast.success("Request deleted successfully");

      // Close dialog
      setDeleteDialog({ isOpen: false, requestId: null, patientName: null });

      // If we're on a page > 1 and this was the last item, go to previous page
      if (requests.length === 1 && currentPage > 1) {
        router.push(`/requests/manage?page=${currentPage - 1}`);
      } else {
        // Refresh the page to get updated data from server
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (requestId: string, patientName: string) => {
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

  // Empty state
  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Manage Requests</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  View and manage your blood donation requests
                </p>
              </div>
              <Button onClick={() => router.push("/requests/add")}>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              No Requests Found
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven&apos;t posted any blood donation requests yet. Create
              your first request to get started.
            </p>
            <Button onClick={() => router.push("/requests/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Requests</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                View and manage your blood donation requests
              </p>
            </div>
            <Button onClick={() => router.push("/requests/add")}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Blood Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((request) => {
                  const isActionLoading = actionLoading === request._id;
                  // Can only fulfill from in_progress status (state machine rule)
                  const canFulfill = request.status === "in_progress";
                  const canCancel =
                    request.status === "open" ||
                    request.status === "in_progress";

                  return (
                    <tr
                      key={request._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium">{request.patientName}</div>
                        <div className="text-sm text-muted-foreground font-mono tabular-data">
                          {request.hospitalName}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <BloodGroupBadge bloodGroup={request.bloodGroup} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-mono tabular-data">
                          {new Date(request.neededByDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono tabular-data">
                          Created{" "}
                          {new Date(request.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/requests/${request._id}`)
                            }
                            disabled={isActionLoading}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>

                          {canFulfill && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(request._id, "fulfilled")
                              }
                              disabled={isActionLoading}
                              className="text-teal hover:text-teal hover:bg-teal/10"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="sr-only">Mark Fulfilled</span>
                            </Button>
                          )}

                          {canCancel && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(request._id, "cancelled")
                              }
                              disabled={isActionLoading}
                              className="text-ochre hover:text-ochre hover:bg-ochre/10"
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Cancel</span>
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              openDeleteDialog(request._id, request.patientName)
                            }
                            disabled={isActionLoading}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {requests.map((request) => {
              const isActionLoading = actionLoading === request._id;
              // Can only fulfill from in_progress status (state machine rule)
              const canFulfill = request.status === "in_progress";
              const canCancel =
                request.status === "open" || request.status === "in_progress";

              return (
                <div key={request._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {request.patientName}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono tabular-data truncate">
                        {request.hospitalName}
                      </p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="flex items-center gap-4">
                    <BloodGroupBadge bloodGroup={request.bloodGroup} />
                    <div className="text-sm font-mono tabular-data text-muted-foreground">
                      {new Date(request.neededByDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/requests/${request._id}`)}
                      disabled={isActionLoading}
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>

                    {canFulfill && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(request._id, "fulfilled")
                        }
                        disabled={isActionLoading}
                        className="flex-1"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Fulfill
                      </Button>
                    )}

                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(request._id, "cancelled")
                        }
                        disabled={isActionLoading}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openDeleteDialog(request._id, request.patientName)
                      }
                      disabled={isActionLoading}
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              metadata={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the request for{" "}
              <span className="font-semibold text-foreground">
                {deleteDialog.patientName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={actionLoading !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading !== null}
            >
              {actionLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
