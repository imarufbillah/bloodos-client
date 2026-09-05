import * as React from "react";

export default function ProfileLoading() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] py-6 sm:py-10 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-6xl w-full space-y-6 sm:space-y-8">
        
        {/* Passport Header Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <div className="h-20 w-20 rounded-full bg-muted/40 animate-pulse shrink-0" />
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-48 bg-muted/50 animate-pulse rounded-xl" />
                  <div className="h-5 w-20 bg-muted/30 animate-pulse rounded-md" />
                </div>
                <div className="h-4 w-36 bg-muted/30 animate-pulse rounded" />
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-6 w-16 bg-muted/40 animate-pulse rounded-md" />
                  <div className="h-6 w-24 bg-muted/40 animate-pulse rounded-md" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <div className="h-10 w-44 bg-muted/40 animate-pulse rounded-xl" />
              <div className="h-14 w-56 bg-muted/30 animate-pulse rounded-xl" />
            </div>
          </div>
        </div>

        {/* Tab Bar Skeleton */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-muted/40 border border-border">
          <div className="h-9 w-32 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-9 w-28 bg-muted/30 animate-pulse rounded-xl" />
          <div className="h-9 w-36 bg-muted/30 animate-pulse rounded-xl" />
          <div className="h-9 w-28 bg-muted/30 animate-pulse rounded-xl" />
        </div>

        {/* Content Viewport Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted/20 border border-border/60 animate-pulse" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl bg-muted/20 border border-border/60 animate-pulse" />
            <div className="h-64 rounded-2xl bg-muted/20 border border-border/60 animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  );
}
