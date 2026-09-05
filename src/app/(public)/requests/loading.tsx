export default function Loading() {
  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col bg-background pb-24 sm:pb-16">
      {/* Header Skeleton */}
      <section className="border-b border-border bg-muted/20 py-8 sm:py-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-muted animate-pulse rounded-xl" />
              <div className="h-4 w-96 max-w-full bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="h-10 w-36 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </section>

      {/* Filter Ribbon Skeleton */}
      <section className="border-b border-border bg-card py-4 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-8 w-11 bg-muted animate-pulse rounded-xl shrink-0" />
              ))}
            </div>
            <div className="h-10 w-full lg:w-80 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center gap-2">
                <div className="h-10 flex-1 rounded-xl bg-muted animate-pulse" />
                <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
