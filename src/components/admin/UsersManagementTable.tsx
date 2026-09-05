"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Shield,
  Ban,
  User,
  Search,
  Filter,
  AlertTriangle,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import { toggleUserBan, changeUserRole, type AdminUser } from "@/lib/api/admin";
import { toast } from "sonner";
import { BloodGroup } from "@/types/shared";

interface UsersManagementTableProps {
  users: AdminUser[];
  currentUserId: string;
  onRefresh: () => void;
  onInspect?: (user: AdminUser) => void;
}

const BAN_PRESET_REASONS = [
  "Violating community standards",
  "Repeated fraudulent requests",
  "Unreachable emergency contact",
  "Inappropriate conduct reported",
  "Suspicious account activity",
];

export function UsersManagementTable({
  users,
  currentUserId,
  onRefresh,
  onInspect,
}: UsersManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"ban" | "unban" | "role">("ban");
  const [banReason, setBanReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.district && u.district.toLowerCase().includes(q)) ||
        (u.bloodGroup && u.bloodGroup.toLowerCase().includes(q));

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "banned" ? u.banned : !u.banned);

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleBanToggle = async () => {
    if (!selectedUser) return;
    try {
      setIsProcessing(true);
      const willBan = !selectedUser.banned;
      const reason = willBan
        ? banReason.trim() || "Banned by administrator"
        : "Unbanned by administrator";

      await toggleUserBan(selectedUser._id, willBan, reason);
      toast.success(
        willBan
          ? `${selectedUser.name} has been banned`
          : `${selectedUser.name} has been unbanned`,
      );
      setDialogOpen(false);
      setBanReason("");
      onRefresh();
    } catch (error) {
      toast.error("Failed to update user ban status");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      setIsProcessing(true);
      const newRole = selectedUser.role === "admin" ? "user" : "admin";
      await changeUserRole(selectedUser._id, newRole);
      toast.success(
        `Changed ${selectedUser.name}'s role to ${newRole === "admin" ? "Administrator" : "Standard User"}`,
      );
      setDialogOpen(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to change user role");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openBanDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setDialogType(user.banned ? "unban" : "ban");
    setBanReason("");
    setDialogOpen(true);
  };

  const openRoleDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setDialogType("role");
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
              placeholder="Search user name, email, district, blood group..."
              className="w-full pl-8.5 pr-4 py-1.5 text-xs sm:text-sm bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search users"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by user role"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Standard Users</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by user status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="banned">Suspended Only</option>
            </select>

            {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setStatusFilter("all");
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
            Showing <strong className="text-foreground font-mono tabular-nums">{filteredUsers.length}</strong> of{" "}
            <strong className="text-foreground font-mono tabular-nums">{users.length}</strong> users
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center space-y-3 shadow-xs">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-heading text-base font-semibold text-foreground">
              No matching users found
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {users.length === 0
                ? "No user accounts registered yet."
                : "No users match your active filter criteria. Try resetting your search."}
            </p>
          </div>
          {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
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
                    <th className="text-left px-4 py-3.5">User Identity</th>
                    <th className="text-left px-4 py-3.5">Role</th>
                    <th className="text-left px-4 py-3.5">Blood Group</th>
                    <th className="text-left px-4 py-3.5">District</th>
                    <th className="text-left px-4 py-3.5">Account Status</th>
                    <th className="text-left px-4 py-3.5">Joined</th>
                    <th className="text-right px-4 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => {
                    const isCurrentUser = user._id === currentUserId;
                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* User Identity */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-crimson/10 text-crimson flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-crimson/20">
                              {user.name ? user.name.charAt(0) : "U"}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground truncate">
                                  {user.name}
                                </span>
                                {isCurrentUser && (
                                  <span className="text-[10px] font-semibold tracking-wide bg-primary/10 text-primary px-1.5 py-0.2 rounded border border-primary/20">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                              user.role === "admin"
                                ? "bg-crimson/10 text-crimson border border-crimson/20"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <Shield className="h-3 w-3" />
                            ) : (
                              <User className="h-3 w-3" />
                            )}
                            <span className="capitalize">{user.role}</span>
                          </span>
                        </td>

                        {/* Blood Group */}
                        <td className="px-4 py-3.5">
                          {user.bloodGroup ? (
                            <BloodGroupBadge
                              bloodGroup={user.bloodGroup as BloodGroup}
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs font-mono">—</span>
                          )}
                        </td>

                        {/* District */}
                        <td className="px-4 py-3.5 text-xs text-foreground">
                          {user.district ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {user.district}
                            </span>
                          ) : (
                            <span className="text-muted-foreground font-mono">—</span>
                          )}
                        </td>

                        {/* Account Status */}
                        <td className="px-4 py-3.5">
                          {user.banned ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                              <Ban className="h-3 w-3" />
                              Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                              Active
                            </span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground tabular-nums">
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            {onInspect && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onInspect(user)}
                                disabled={isProcessing}
                                className="h-8 px-2 text-xs text-primary hover:bg-primary/10 gap-1 touch-manipulation font-medium"
                                aria-label={`Inspect ${user.name}'s account in drawer`}
                                title="Quick Inspect Drawer"
                              >
                                <User className="h-3.5 w-3.5" />
                                <span>Inspect</span>
                              </Button>
                            )}

                            {/* Ban / Unban Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openBanDialog(user)}
                              disabled={isProcessing || isCurrentUser}
                              className={`h-8 text-xs px-2.5 touch-manipulation ${
                                user.banned
                                  ? "text-teal-600 border-teal-500/30 hover:bg-teal-500/10"
                                  : "text-destructive border-destructive/30 hover:bg-destructive/10"
                              }`}
                              aria-label={
                                isCurrentUser
                                  ? "Cannot ban yourself"
                                  : user.banned
                                    ? `Unban user ${user.name}`
                                    : `Ban user ${user.name}`
                              }
                              title={
                                isCurrentUser
                                  ? "Cannot ban your own account"
                                  : user.banned
                                    ? "Unban user"
                                    : "Ban user"
                              }
                            >
                              {user.banned ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Unban
                                </>
                              ) : (
                                <>
                                  <Ban className="h-3 w-3 mr-1" />
                                  Ban
                                </>
                              )}
                            </Button>

                            {/* Promote / Demote Role Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRoleDialog(user)}
                              disabled={isProcessing || isCurrentUser}
                              className="h-8 text-xs px-2.5 touch-manipulation"
                              aria-label={
                                isCurrentUser
                                  ? "Cannot change your own role"
                                  : user.role === "admin"
                                    ? `Demote ${user.name} to standard user`
                                    : `Promote ${user.name} to administrator`
                              }
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
                                  <Shield className="h-3 w-3 mr-1 text-crimson" />
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

          {/* Mobile Card View (under md) */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => {
              const isCurrentUser = user._id === currentUserId;
              return (
                <div
                  key={user._id}
                  className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3"
                >
                  {/* Header Row with Avatar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-crimson/10 text-crimson flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-crimson/20">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading font-semibold text-foreground text-sm">
                            {user.name}
                          </h3>
                          {isCurrentUser && (
                            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.2 rounded border border-primary/20">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {user.bloodGroup && (
                      <BloodGroupBadge
                        bloodGroup={user.bloodGroup as BloodGroup}
                      />
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border/50">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                        Role & Status
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            user.role === "admin"
                              ? "bg-crimson/10 text-crimson border border-crimson/20"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.banned ? (
                          <span className="text-[11px] font-semibold text-destructive inline-flex items-center gap-0.5">
                            <Ban className="h-2.5 w-2.5" /> Banned
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-teal-600 inline-flex items-center gap-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" /> Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                        District / Joined
                      </span>
                      <p className="text-foreground font-medium truncate">
                        {user.district || "—"}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {onInspect ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onInspect(user)}
                        className="w-full text-xs h-9 min-h-[36px] touch-manipulation text-primary border-primary/30 hover:bg-primary/10"
                        aria-label={`Inspect ${user.name}'s profile`}
                      >
                        <User className="h-3.5 w-3.5 mr-1" />
                        Inspect
                      </Button>
                    ) : (
                      <div />
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openBanDialog(user)}
                      disabled={isProcessing || isCurrentUser}
                      className={`w-full text-xs h-9 min-h-[36px] touch-manipulation ${
                        user.banned
                          ? "text-teal-600 border-teal-500/30 hover:bg-teal-500/10"
                          : "text-destructive border-destructive/30 hover:bg-destructive/10"
                      }`}
                      aria-label={
                        isCurrentUser
                          ? "Cannot ban yourself"
                          : user.banned
                            ? `Unban ${user.name}`
                            : `Ban ${user.name}`
                      }
                    >
                      {user.banned ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Unban
                        </>
                      ) : (
                        <>
                          <Ban className="h-3.5 w-3.5 mr-1" />
                          Ban
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openRoleDialog(user)}
                      disabled={isProcessing || isCurrentUser}
                      className="w-full text-xs h-9 min-h-[36px] touch-manipulation"
                      aria-label={
                        isCurrentUser
                          ? "Cannot change your own role"
                          : user.role === "admin"
                            ? `Demote ${user.name}`
                            : `Promote ${user.name}`
                      }
                    >
                      {user.role === "admin" ? (
                        <>
                          <User className="h-3.5 w-3.5 mr-1" />
                          Demote
                        </>
                      ) : (
                        <>
                          <Shield className="h-3.5 w-3.5 mr-1 text-crimson" />
                          Promote
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Ban Reason Dialog */}
      {dialogType === "ban" && dialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ban-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-foreground">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="ban-dialog-title"
                  className="font-heading font-semibold text-lg"
                >
                  Suspend User Account
                </h3>
                <p className="text-xs text-muted-foreground">
                  User: {selectedUser?.name} ({selectedUser?.email})
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Suspending this user revokes their access to create broadcasts, claim donations, and coordinate emergencies.
            </p>

            {/* Quick Reason Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-crimson" />
                Select preset reason:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {BAN_PRESET_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setBanReason(reason)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      banReason === reason
                        ? "bg-destructive text-destructive-foreground border-destructive"
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
                htmlFor="ban-reason-input"
                className="text-xs font-semibold text-foreground"
              >
                Or provide specific audit notes:
              </label>
              <textarea
                id="ban-reason-input"
                rows={3}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Type reason for suspension..."
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
                onClick={handleBanToggle}
                disabled={isProcessing}
                variant="destructive"
              >
                {isProcessing ? "Suspending..." : "Suspend Account"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Unban Confirmation Dialog */}
      {dialogType === "unban" && (
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Reactivate User Account"
          description={`Restore full platform and emergency coordination access for ${selectedUser?.name}?`}
          confirmText="Reactivate Account"
          variant="default"
          onConfirm={handleBanToggle}
        />
      )}

      {/* Role Change Confirmation Dialog */}
      {dialogType === "role" && (
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={
            selectedUser?.role === "admin"
              ? "Demote to Standard User"
              : "Promote to Administrator"
          }
          description={
            selectedUser?.role === "admin"
              ? `Remove administrator privileges from ${selectedUser?.name}? They will lose access to platform moderation and telemetry.`
              : `Elevate ${selectedUser?.name} to administrator? They will gain access to platform moderation, user governance, and telemetry.`
          }
          confirmText={
            selectedUser?.role === "admin"
              ? "Demote to User"
              : "Promote to Admin"
          }
          variant={selectedUser?.role === "admin" ? "destructive" : "default"}
          onConfirm={handleRoleChange}
        />
      )}
    </div>
  );
}

