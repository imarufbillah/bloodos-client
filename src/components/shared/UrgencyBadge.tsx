import { type ComponentPropsWithoutRef } from "react";
import { Urgency, type Urgency as UrgencyType } from "@/types/shared";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, Info } from "lucide-react";

export interface UrgencyBadgeProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> {
  urgency: UrgencyType;
}

const URGENCY_CONFIG = {
  [Urgency.CRITICAL]: {
    label: "Critical",
    icon: AlertCircle,
    className: "bg-crimson text-paper border-crimson font-semibold shadow-sm",
  },
  [Urgency.URGENT]: {
    label: "Urgent",
    icon: Clock,
    className: "bg-ochre text-ink border-ochre font-semibold shadow-sm",
  },
  [Urgency.MODERATE]: {
    label: "Moderate",
    icon: Info,
    className: "bg-transparent text-slate border-slate border font-medium",
  },
} as const;

export function UrgencyBadge({
  urgency,
  className,
  ...props
}: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[urgency];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        // Base pill structure
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs leading-none",
        // Urgency-specific styling
        config.className,
        // User overrides
        className,
      )}
      {...props}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
