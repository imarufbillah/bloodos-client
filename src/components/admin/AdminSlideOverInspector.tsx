"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  Shield,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Trash2,
  Ban,
  Activity,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BloodGroupBadge } from "@/components/shared/BloodGroupBadge";
import type { ModerationRequest, AdminUser } from "@/lib/api/admin";
import type { BloodGroup, RequestStatus } from "@/types/shared";
import Link from "next/link";

export type InspectorItem =
  | { type: "request"; data: ModerationRequest }
  | { type: "user"; data: AdminUser };

interface AdminSlideOverInspectorProps {
  item: InspectorItem | null;
  onClose: () => void;
  onRejectRequest?: (req: ModerationRequest) => void;
  onDeleteRequest?: (req: ModerationRequest) => void;
  onBanUser?: (user: AdminUser) => void;
  onRoleUser?: (user: AdminUser) => void;
  currentUserId?: string;
  isProcessing?: boolean;
}

export function AdminSlideOverInspector({
  item,
  onClose,
  onRejectRequest,
  onDeleteRequest,
  onBanUser,
  onRoleUser,
  currentUserId,
  isProcessing = false,
}: AdminSlideOverInspectorProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          item.type === "request"
            ? `Inspector: Request #${item.data._id.slice(-6)}`
            : `Inspector: User ${item.data.name}`
        }
        className="relative z-10 w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 ease-out"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {item.type === "request" ? (
                <Droplets className="h-4 w-4 text-crimson" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {item.type === "request" ? "Emergency Incident" : "User Account"}
              </p>
              <h2 className="font-heading text-base font-bold text-foreground">
                {item.type === "request" ? item.data.patientName : item.data.name}
              </h2>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg touch-manipulation"
            aria-label="Close inspector drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {item.type === "request" ? (
            /* Request Details */
            <div className="space-y-5 text-sm">
              {/* Status and Blood Group Banner */}
              <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-xl border border-border">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Status
                  </span>
                  <div>
                    <StatusBadge status={item.data.status as RequestStatus} />
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Blood Group
                  </span>
                  <div>
                    <BloodGroupBadge
                      bloodGroup={item.data.bloodGroup as BloodGroup}
                    />
                  </div>
                </div>
              </div>

              {/* Case Telemetry */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Incident Information
                </h3>

                <div className="divide-y divide-border border-y border-border">
                  <div className="flex justify-between items-center py-2.5 text-xs">
                    <span className="text-muted-foreground">Incident ID</span>
                    <span className="font-mono text-foreground font-medium bg-muted px-1.5 py-0.5 rounded border border-border">
                      {item.data._id}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 text-xs">
                    <span className="text-muted-foreground">Broadcast Date</span>
                    <span className="font-mono tabular-nums text-foreground">
                      {format(new Date(item.data.createdAt), "PPpp")}
                    </span>
                  </div>

                  {item.data.neededByDate && (
                    <div className="flex justify-between items-center py-2.5 text-xs">
                      <span className="text-muted-foreground">Required By</span>
                      <span className="font-mono tabular-nums text-crimson font-medium">
                        {format(new Date(item.data.neededByDate), "PPpp")}
                      </span>
                    </div>
                  )}

                  {item.data.urgency && (
                    <div className="flex justify-between items-center py-2.5 text-xs">
                      <span className="text-muted-foreground">Urgency Level</span>
                      <span className="capitalize font-medium text-amber-600">
                        {item.data.urgency}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-start py-2.5 text-xs">
                    <span className="text-muted-foreground">Medical Facility</span>
                    <span className="text-foreground font-medium text-right max-w-[220px]">
                      {item.data.hospitalName || "Unspecified Hospital"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 text-xs">
                    <span className="text-muted-foreground">District / Region</span>
                    <span className="text-foreground font-medium">
                      {item.data.district || "Unspecified District"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Public Page Link */}
              <div className="pt-1">
                <Link
                  href={`/requests/${item.data._id}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border border-border bg-muted/40 text-foreground hover:bg-muted transition-colors"
                >
                  <span>Open Public Case Page</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </div>
            </div>
          ) : (
            /* User Details */
            <div className="space-y-5 text-sm">
              {/* User Avatar & Identity Card */}
              <div className="p-4 bg-muted/40 rounded-xl border border-border flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-full bg-crimson/10 text-crimson flex items-center justify-center font-bold text-base uppercase shrink-0 border border-crimson/20">
                  {item.data.name ? item.data.name.charAt(0) : "U"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-foreground truncate text-base">
                      {item.data.name}
                    </h3>
                    {item.data._id === currentUserId && (
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.2 rounded border border-primary/20">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.data.email}
                  </p>
                </div>
              </div>

              {/* Account Status Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-xl border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Role
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-foreground capitalize">
                    {item.data.role === "admin" ? (
                      <Shield className="h-3.5 w-3.5 text-crimson" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    {item.data.role}
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-xl border border-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Status
                  </span>
                  <div>
                    {item.data.banned ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                        <Ban className="h-3 w-3" /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" /> Active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Telemetry */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  User Details
                </h3>

                <div className="divide-y divide-border border-y border-border">
                  <div className="flex justify-between items-center py-2.5 text-xs">
                    <span className="text-muted-foreground">User ID</span>
                    <span className="font-mono text-foreground font-medium bg-muted px-1.5 py-0.5 rounded border border-border">
                      {item.data._id}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 text-xs">
                    <span className="text-muted-foreground">Blood Group</span>
                    {item.data.bloodGroup ? (
                      <BloodGroupBadge
                        bloodGroup={item.data.bloodGroup as BloodGroup}
                      />
                    ) : (
                      <span className="text-muted-foreground font-mono">—</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-2.5 text-xs">
                    <span className="text-muted-foreground">District</span>
                    <span className="text-foreground font-medium">
                      {item.data.district || "Unspecified"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 text-xs">
                    <span className="text-muted-foreground">Registration Date</span>
                    <span className="font-mono tabular-nums text-foreground">
                      {format(new Date(item.data.createdAt), "PP")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          {item.type === "request" ? (
            <div className="flex items-center gap-2">
              {item.data.status === "pending" && onRejectRequest && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRejectRequest(item.data as ModerationRequest)}
                  disabled={isProcessing}
                  className="flex-1 text-xs h-9 min-h-[36px] text-amber-600 border-amber-600/30 hover:bg-amber-500/10 touch-manipulation"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Reject Request
                </Button>
              )}

              {onDeleteRequest && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteRequest(item.data as ModerationRequest)}
                  disabled={isProcessing}
                  className="flex-1 text-xs h-9 min-h-[36px] text-destructive border-destructive/30 hover:bg-destructive/10 touch-manipulation"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete Broadcast
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onBanUser && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBanUser(item.data as AdminUser)}
                  disabled={isProcessing || item.data._id === currentUserId}
                  className={`flex-1 text-xs h-9 min-h-[36px] touch-manipulation ${
                    item.data.banned
                      ? "text-teal-600 border-teal-500/30 hover:bg-teal-500/10"
                      : "text-destructive border-destructive/30 hover:bg-destructive/10"
                  }`}
                >
                  {item.data.banned ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Restore Access
                    </>
                  ) : (
                    <>
                      <Ban className="h-3.5 w-3.5 mr-1" />
                      Suspend Account
                    </>
                  )}
                </Button>
              )}

              {onRoleUser && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRoleUser(item.data as AdminUser)}
                  disabled={isProcessing || item.data._id === currentUserId}
                  className="flex-1 text-xs h-9 min-h-[36px] touch-manipulation"
                >
                  {item.data.role === "admin" ? (
                    <>
                      <User className="h-3.5 w-3.5 mr-1" />
                      Demote to User
                    </>
                  ) : (
                    <>
                      <Shield className="h-3.5 w-3.5 mr-1 text-crimson" />
                      Promote to Admin
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
