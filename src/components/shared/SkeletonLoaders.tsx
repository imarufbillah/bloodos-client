import { cn } from "@/lib/utils";

// ============================================================================
// Base Skeleton Primitive
// ============================================================================

interface SkeletonProps {
  className?: string;
  /**
   * Disable pulse animation (defaults to respecting prefers-reduced-motion)
   */
  noPulse?: boolean;
}

/**
 * Base skeleton primitive - reusable for any skeleton shape
 */
export function Skeleton({ className, noPulse = false }: SkeletonProps) {
  return (
    <div
      className={cn("rounded bg-muted", !noPulse && "animate-pulse", className)}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// RequestCardSkeleton (shape-matched to RequestCard)
// ============================================================================

interface RequestCardSkeletonProps {
  /**
   * Stagger index for card-fade-in animation (same as actual cards)
   */
  staggerIndex?: number;
  className?: string;
}

export function RequestCardSkeleton({
  staggerIndex = 0,
  className,
}: RequestCardSkeletonProps) {
  return (
    <div
      className={cn(
        "card-grid-item relative flex flex-col overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
      style={{ "--stagger-index": staggerIndex } as React.CSSProperties}
      role="status"
      aria-label="Loading blood request"
    >
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Header: Kicker + Badge */}
        <div className="flex items-start justify-between gap-3">
          {/* Kicker line (blood group + district) */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-1" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-16" />
          </div>

          {/* Urgency badge placeholder */}
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Patient Name - matches Fraunces heading size */}
        <Skeleton className="h-5 w-3/4" />

        {/* Hospital Info block */}
        <div className="flex items-start gap-2">
          <Skeleton className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>

        {/* Units Needed */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Needed By Date */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Description block (2 lines) */}
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>

        {/* Status Badge */}
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        </div>

        {/* Footer: Timestamp + Button */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DonorCardSkeleton (shape-matched to DonorCard)
// ============================================================================

interface DonorCardSkeletonProps {
  /**
   * Stagger index for card-fade-in animation (same as actual cards)
   */
  staggerIndex?: number;
  className?: string;
}

export function DonorCardSkeleton({
  staggerIndex = 0,
  className,
}: DonorCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs",
        className,
      )}
      style={{
        animationDelay: `${Math.min(staggerIndex * 40, 400)}ms`,
      }}
      role="status"
      aria-label="Loading donor profile"
    >
      <div className="space-y-3.5">
        {/* Header: District + Eligibility Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Hero Identity: Blood Group + Name */}
        <div className="flex items-center gap-3 pt-0.5">
          <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>

        {/* Donation History Telemetry Block */}
        <div className="rounded-xl bg-muted/40 p-3 border border-border/50 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="flex items-center justify-between border-t border-border/40 pt-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>

        {/* Contact info placeholders */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5" />
            <Skeleton className="h-3.5 w-36" />
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="pt-3.5 mt-3.5 border-t border-border/60">
        <Skeleton className="h-11 sm:h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ============================================================================
// Grid Skeletons (for directory pages)
// ============================================================================

interface RequestsGridSkeletonProps {
  /**
   * Number of skeleton cards to render
   */
  count?: number;
  className?: string;
}

/**
 * RequestsGridSkeleton — Grid of request card skeletons
 * Used on /requests page during initial load or filter changes
 */
export function RequestsGridSkeleton({
  count = 12,
  className,
}: RequestsGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
      role="status"
      aria-label="Loading blood requests"
    >
      {Array.from({ length: count }, (_, i) => (
        <RequestCardSkeleton key={i} staggerIndex={i} />
      ))}
    </div>
  );
}

interface DonorsGridSkeletonProps {
  /**
   * Number of skeleton cards to render
   */
  count?: number;
  className?: string;
}

/**
 * DonorsGridSkeleton — Grid of donor card skeletons
 * Used on /donors page during initial load or filter changes
 */
export function DonorsGridSkeleton({
  count = 12,
  className,
}: DonorsGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
      role="status"
      aria-label="Loading donors"
    >
      {Array.from({ length: count }, (_, i) => (
        <DonorCardSkeleton key={i} staggerIndex={i} />
      ))}
    </div>
  );
}

// ============================================================================
// Table Row Skeletons (for admin dashboard)
// ============================================================================

interface TableRowSkeletonProps {
  /**
   * Number of columns
   */
  columns?: number;
  className?: string;
}

/**
 * TableRowSkeleton — Single table row skeleton
 * Used in admin dashboard moderation tables
 */
export function TableRowSkeleton({
  columns = 5,
  className,
}: TableRowSkeletonProps) {
  return (
    <tr className={className} role="status" aria-label="Loading table row">
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

interface TableSkeletonProps {
  /**
   * Number of rows
   */
  rows?: number;
  /**
   * Number of columns
   */
  columns?: number;
  className?: string;
}

/**
 * TableSkeleton — Full table skeleton
 * Used in admin dashboard during data load
 */
export function TableSkeleton({
  rows = 10,
  columns = 5,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Detail Page Skeletons
// ============================================================================

/**
 * RequestDetailSkeleton — Loading state for /requests/:id page
 * Mirrors the detail page layout with sections
 */
export function RequestDetailSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("space-y-6", className)}
      role="status"
      aria-label="Loading request details"
    >
      {/* Header section */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}

/**
 * ProfileSectionSkeleton — Loading state for profile page sections
 * Used for donation history, posted requests, response history
 */
export function ProfileSectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("space-y-4", className)}
      role="status"
      aria-label="Loading profile section"
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* List items */}
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border border-border rounded-lg"
          >
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Note: All components are exported individually with their declarations above
