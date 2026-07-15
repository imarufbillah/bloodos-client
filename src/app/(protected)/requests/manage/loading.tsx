/**
 * Loading UI for Manage Requests Page
 * 
 * Automatically displayed by Next.js while the server component
 * is fetching user's requests or during route transitions.
 */

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-9 w-56 bg-muted animate-pulse rounded" />
              <div className="h-5 w-80 bg-muted animate-pulse rounded" />
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Table Header Skeleton */}
          <div className="hidden md:block">
            <div className="border-b border-border bg-muted/50 p-4">
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded ml-auto" />
              </div>
            </div>
            
            {/* Table Rows Skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards Skeleton */}
          <div className="md:hidden divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-9 bg-muted animate-pulse rounded" />
                  <div className="h-9 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
