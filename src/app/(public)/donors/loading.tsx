import { DonorsGridSkeleton } from "@/components/shared/SkeletonLoaders";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-16">
      {/* Page Header Skeleton */}
      <section className="border-b border-border/70 bg-card/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="h-5 w-48 bg-muted animate-pulse rounded-full" />
              <div className="h-9 w-64 sm:w-80 bg-muted animate-pulse rounded-xl" />
              <div className="h-4 w-full max-w-xl bg-muted animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-16 w-40 bg-muted animate-pulse rounded-2xl" />
              <div className="h-11 w-36 bg-muted animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Command Strip Skeleton */}
      <section className="border-b border-border/80 bg-background/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-3.5">
          {/* Blood group pills placeholder */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="h-9 w-24 bg-muted animate-pulse rounded-xl" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-9 w-12 bg-muted animate-pulse rounded-xl shrink-0" />
            ))}
          </div>

          {/* Secondary inputs placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-4 h-10 bg-muted animate-pulse rounded-xl" />
            <div className="lg:col-span-3 h-10 bg-muted animate-pulse rounded-xl" />
            <div className="lg:col-span-4 h-10 bg-muted animate-pulse rounded-xl" />
            <div className="lg:col-span-1 h-10 bg-muted animate-pulse rounded-xl hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Results Grid Skeleton */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        <DonorsGridSkeleton count={12} />
      </main>
    </div>
  );
}

