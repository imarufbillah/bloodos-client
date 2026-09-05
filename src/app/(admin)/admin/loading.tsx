import { Shield, BarChart3, Users, Radio } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      {/* Header Banner Skeleton */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-xs">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-crimson/10 text-crimson border border-crimson/20 shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted/60 animate-pulse rounded-md" />
                <div className="h-7 w-64 bg-muted animate-pulse rounded-xl" />
                <div className="h-4 w-80 bg-muted/50 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Segmented Tabs Skeleton */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/40 border border-border w-fit">
          <div className="h-9 w-32 bg-muted/80 animate-pulse rounded-xl" />
          <div className="h-9 w-36 bg-muted/40 animate-pulse rounded-xl" />
          <div className="h-9 w-28 bg-muted/40 animate-pulse rounded-xl" />
        </div>

        {/* 5 Tactical Stat Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/80 bg-card p-4 space-y-2.5 shadow-2xs"
            >
              <div className="h-3 w-20 bg-muted/60 animate-pulse rounded" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded-lg" />
              <div className="h-3 w-28 bg-muted/40 animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* 2-Column Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-2xs"
            >
              <div className="h-5 w-44 bg-muted animate-pulse rounded-lg" />
              <div className="h-64 bg-muted/20 animate-pulse rounded-xl" />
            </div>
          ))}
        </div>

        {/* Trend Chart Skeleton */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="h-5 w-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-72 bg-muted/20 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
