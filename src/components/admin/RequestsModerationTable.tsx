/**
 * Requests Moderation Table
 * Dense data table for admin moderation (Req 18.9-18.12)
 * Columns: ID, Patient, Blood Group, Status, Created, Actions
 * Actions: Reject, View/Edit, Delete (no Approve since requests are auto-approved on creation)
 */

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { XCircle, Eye, Trash2 } from "lucide-react";
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

interface RequestsModerationTableProps {
  requests: ModerationRequest[];
  onRefresh: () => void;
}

export function RequestsModerationTable({
  requests,
  onRefresh,
}: RequestsModerationTableProps) {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] =
    useState<ModerationRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"reject" | "delete">("delete");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReject = async () => {
    if (!selectedRequest) return;
    try {
      await rejectRequest(selectedRequest._id, "Rejected by admin");
      toast.success("Request rejected successfully");
      onRefresh();
    } catch (error) {
      toast.error("Failed to reject request");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;
    try {
      await deleteRequest(selectedRequest._id);
      toast.success("Request deleted successfully");
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete request");
      console.error(error);
    }
  };

  const openDialog = (
    request: ModerationRequest,
    type: "reject" | "delete"
  ) => {
    setSelectedRequest(request);
    setDialogType(type);
    setDialogOpen(true);
  };

  if (requests.length === 0) {
    return (
      <div className="bg-paper border border-slate rounded-lg p-8 text-center">
        <p className="text-slate">No requests require moderation</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-paper border border-slate rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-slate sticky top-0">
              <tr>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  ID
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Patient
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Blood Group
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Status
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Created
                </th>
                <th className="text-right font-semibold text-ink px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate">
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate">
                    {request._id.slice(-8)}
                  </td>
                  <td className="px-4 py-3 text-ink font-medium">
                    {request.patientName}
                  </td>
                  <td className="px-4 py-3">
                    <BloodGroupBadge bloodGroup={request.bloodGroup as any} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={request.status as any} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate tabular-data">
                    {format(new Date(request.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDialog(request, "reject")}
                        disabled={isProcessing}
                        title="Reject Request"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          router.push(`/requests/${request._id}`)
                        }
                        disabled={isProcessing}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDialog(request, "delete")}
                        disabled={isProcessing}
                        title="Delete Request"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          dialogType === "delete" ? "Delete Request" : "Reject Request"
        }
        description={
          dialogType === "delete"
            ? "Are you sure you want to delete this blood request? This action cannot be undone."
            : "Are you sure you want to reject this blood request?"
        }
        confirmText={dialogType === "delete" ? "Delete" : "Reject"}
        variant={dialogType === "delete" ? "destructive" : "default"}
        onConfirm={dialogType === "delete" ? handleDelete : handleReject}
      />
    </>
  );
}
