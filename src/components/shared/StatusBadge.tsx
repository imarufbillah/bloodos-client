/**
 * StatusBadge — Text labels for BloodRequest status
 * Phase 7h — StatusBadge family
 *
 * Visual hierarchy (from 6a design direction):
 * - NOT pills/chips — plain text labels with ink-on-paper palette
 * - Deliberately separate visual language from UrgencyBadge to prevent confusion
 * - Icon + text for accessibility (never color alone)
 *
 * Status values (Req 3.1-3.9):
 * - open: Request is active, accepting responses
 * - in_progress: At least one donor has responded
 * - fulfilled: Request has been completed
 * - cancelled: Request was cancelled by owner/admin
 * - expired: Request passed neededByDate without fulfillment
 *
 * Usage:
 *   <StatusBadge status="open" />
 *   <StatusBadge status="in_progress" />
 *   <StatusBadge status="fulfilled" />
 */

import { type ComponentPropsWithoutRef } from "react";
import {
  RequestStatus,
  type RequestStatus as StatusType,
} from "@/types/shared";
import { cn } from "@/lib/utils";
import {
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export interface StatusBadgeProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  status: StatusType;
}

const STATUS_CONFIG = {
  [RequestStatus.OPEN]: {
    label: "Open",
    icon: Circle,
    className: "text-teal",
  },
  [RequestStatus.IN_PROGRESS]: {
    label: "In Progress",
    icon: Clock,
    className: "text-ochre",
  },
  [RequestStatus.FULFILLED]: {
    label: "Fulfilled",
    icon: CheckCircle2,
    className: "text-teal",
  },
  [RequestStatus.CANCELLED]: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-muted-foreground",
  },
  [RequestStatus.EXPIRED]: {
    label: "Expired",
    icon: AlertTriangle,
    className: "text-slate",
  },
} as const;

export function StatusBadge({
  status,
  className,
  ...props
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        // Base text label structure (NOT a pill/chip)
        "inline-flex items-center gap-1.5 text-sm font-medium leading-none",
        // Status-specific color
        config.className,
        // User overrides
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
