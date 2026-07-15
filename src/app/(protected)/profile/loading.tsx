/**
 * Loading UI for Profile Page
 * 
 * Automatically displayed by Next.js while the server component
 * is fetching user profile data.
 */

import { User } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Page Header Skeleton */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
            <User className="size-5" />
          </div>
          <div className="space-y-2">
            <div className="h-7 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-80 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </header>

      {/* Sections Skeleton */}
      <div className="space-y-8">
        {/* Personal Information Skeleton */}
        <section className="rounded-lg border border-border p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-10 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded mt-4" />
          </div>
        </section>

        {/* Donation History Skeleton */}
        <section className="rounded-lg border border-border p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Posted Requests Skeleton */}
        <section className="rounded-lg border border-border p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-56 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Response History Skeleton */}
        <section className="rounded-lg border border-border p-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-56 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-72 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer Skeleton */}
      <footer className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      </footer>
    </div>
  );
}
