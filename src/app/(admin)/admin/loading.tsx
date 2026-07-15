/**
 * Loading UI for Admin Dashboard
 * 
 * Automatically displayed by Next.js while the server component
 * is fetching admin data.
 */

import { Shield, BarChart3, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-slate bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Shield className="h-6 w-6 text-crimson" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-80 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2" disabled>
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="moderation" className="gap-2" disabled>
              <Shield className="h-4 w-4" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2" disabled>
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-6 space-y-2"
              >
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="h-5 w-40 bg-muted animate-pulse rounded mb-4" />
                <div className="h-64 bg-muted/30 animate-pulse rounded" />
              </div>
            ))}
          </div>

          {/* Trend Chart Skeleton */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="h-5 w-48 bg-muted animate-pulse rounded mb-4" />
            <div className="h-80 bg-muted/30 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
