import { Plus, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      {/* Header Banner Skeleton */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-xs">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-6 w-36 bg-muted/60 animate-pulse rounded-md" />
              <div className="h-8 w-64 sm:w-80 bg-muted animate-pulse rounded-lg" />
              <div className="h-4 w-96 max-w-full bg-muted/60 animate-pulse rounded" />
            </div>
            <Button disabled className="h-11 rounded-xl bg-muted text-transparent">
              <Plus className="h-4 w-4" />
              <span>Create Blood Request</span>
            </Button>
          </div>

          {/* Telemetry Strip Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border/80 bg-card/80 space-y-2">
                <div className="h-3 w-20 bg-muted/60 animate-pulse rounded" />
                <div className="h-7 w-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-card border border-border/80 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-muted animate-pulse rounded-xl" />
            <div className="h-8 w-28 bg-muted/60 animate-pulse rounded-xl" />
            <div className="h-8 w-20 bg-muted/60 animate-pulse rounded-xl" />
          </div>
          <div className="h-9 w-full md:w-72 bg-muted/60 animate-pulse rounded-xl" />
        </div>

        {/* Request Cards Skeleton */}
        <div className="space-y-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-muted animate-pulse shrink-0" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                      <div className="h-5 w-20 bg-muted/60 animate-pulse rounded" />
                    </div>
                    <div className="h-4 w-64 bg-muted/50 animate-pulse rounded" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 lg:pt-0">
                  <div className="h-9 w-28 bg-muted/60 animate-pulse rounded-xl" />
                  <div className="h-9 w-28 bg-muted/60 animate-pulse rounded-xl" />
                  <div className="h-9 w-9 bg-muted/60 animate-pulse rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

