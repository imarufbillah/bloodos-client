import { RequestsGridSkeleton } from "@/components/shared/SkeletonLoaders";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header Skeleton */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="h-9 w-48 bg-muted animate-pulse rounded" />
              <div className="h-5 w-72 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
            <div className="h-10 flex-1 min-w-50 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </section>

      {/* Results Grid Skeleton */}
      <section className="container mx-auto max-w-7xl px-4 py-8">
        <RequestsGridSkeleton count={12} />
      </section>
    </div>
  );
}
