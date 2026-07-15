import { type ComponentPropsWithoutRef } from "react";
import { type BloodGroup } from "@/types/shared";
import { cn } from "@/lib/utils";

export interface BloodGroupBadgeProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> {
  bloodGroup: BloodGroup;
  /**
   * Size variant
   * - sm: 10px text, 16px height (for dense tables)
   * - md: 12px text, 20px height (default, for cards)
   * - lg: 14px text, 24px height (for headers)
   */
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "text-[10px] h-4 px-1.5",
  md: "text-xs h-5 px-2",
  lg: "text-sm h-6 px-2.5",
} as const;

export function BloodGroupBadge({
  bloodGroup,
  size = "md",
  className,
  ...props
}: BloodGroupBadgeProps) {
  return (
    <span
      className={cn(
        // Base chip structure — monospace, compact, muted
        "inline-flex items-center justify-center rounded font-mono font-medium tabular-data",
        // Muted ink-on-paper palette (never urgency colors)
        "bg-muted text-foreground border border-border",
        // Size variant
        SIZE_CLASSES[size],
        // User overrides
        className,
      )}
      {...props}
    >
      {bloodGroup}
    </span>
  );
}
