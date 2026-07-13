/**
 * Users Management Table
 * Admin user management with ban/unban and role change (Req 5f, 10.5/10.6)
 */

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Shield, Ban, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import {
  toggleUserBan,
  changeUserRole,
  type AdminUser,
} from "@/lib/api/admin";
import { toast } from "sonner";

interface UsersManagementTableProps {
  users: AdminUser[];
  currentUserId: string;
  onRefresh: () => void;
}

export function UsersManagementTable({
  users,
  currentUserId,
  onRefresh,
}: UsersManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"ban" | "unban" | "role">(
    "ban"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBanToggle = async () => {
    if (!selectedUser) return;
    try {
      const willBan = !selectedUser.banned;
      await toggleUserBan(
        selectedUser._id,
        willBan,
        willBan ? "Banned by admin" : "Unbanned by admin"
      );
      toast.success(
        willBan ? "User banned successfully" : "User unbanned successfully"
      );
      onRefresh();
    } catch (error) {
      toast.error("Failed to update user ban status");
      console.error(error);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      const newRole = selectedUser.role === "admin" ? "user" : "admin";
      await changeUserRole(selectedUser._id, newRole);
      toast.success(`User role changed to ${newRole}`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to change user role");
      console.error(error);
    }
  };

  const openDialog = (
    user: AdminUser,
    type: "ban" | "unban" | "role"
  ) => {
    setSelectedUser(user);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (dialogType === "role") {
      return handleRoleChange();
    } else {
      return handleBanToggle();
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-paper border border-slate rounded-lg p-8 text-center">
        <p className="text-slate">No users found</p>
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
                  Name
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Email
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Role
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Blood Group
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  District
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Status
                </th>
                <th className="text-left font-semibold text-ink px-4 py-3">
                  Joined
                </th>
                <th className="text-right font-semibold text-ink px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate">
              {users.map((user) => {
                const isCurrentUser = user._id === currentUserId;
                return (
                  <tr
                    key={user._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-ink font-medium">
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-slate">(You)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate text-xs">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded ${
                          user.role === "admin"
                            ? "bg-crimson/10 text-crimson"
                            : "bg-muted text-slate"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.bloodGroup ? (
                        <BloodGroupBadge bloodGroup={user.bloodGroup as any} />
                      ) : (
                        <span className="text-slate text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate text-xs">
                      {user.district || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                          <Ban className="h-3 w-3" />
                          Banned
                        </span>
                      ) : (
                        <span className="text-xs text-teal font-medium">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate tabular-data">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openDialog(
                              user,
                              user.banned ? "unban" : "ban"
                            )
                          }
                          disabled={isProcessing || isCurrentUser}
                          title={
                            isCurrentUser
                              ? "Cannot ban yourself"
                              : user.banned
                                ? "Unban user"
                                : "Ban user"
                          }
                        >
                          {user.banned ? "Unban" : "Ban"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user, "role")}
                          disabled={isProcessing || isCurrentUser}
                          title={
                            isCurrentUser
                              ? "Cannot change your own role"
                              : user.role === "admin"
                                ? "Demote to user"
                                : "Promote to admin"
                          }
                        >
                          {user.role === "admin" ? (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              Demote
                            </>
                          ) : (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Promote
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          dialogType === "ban"
            ? "Ban User"
            : dialogType === "unban"
              ? "Unban User"
              : selectedUser?.role === "admin"
                ? "Demote User"
                : "Promote User"
        }
        description={
          dialogType === "ban"
            ? `Are you sure you want to ban ${selectedUser?.name}? They will no longer be able to access the platform.`
            : dialogType === "unban"
              ? `Are you sure you want to unban ${selectedUser?.name}? They will regain access to the platform.`
              : selectedUser?.role === "admin"
                ? `Are you sure you want to demote ${selectedUser?.name} to a regular user? They will lose admin privileges.`
                : `Are you sure you want to promote ${selectedUser?.name} to admin? They will gain full admin privileges.`
        }
        confirmText={
          dialogType === "ban"
            ? "Ban User"
            : dialogType === "unban"
              ? "Unban User"
              : selectedUser?.role === "admin"
                ? "Demote"
                : "Promote"
        }
        variant={dialogType === "ban" ? "destructive" : "default"}
        onConfirm={handleConfirm}
      />
    </>
  );
}
