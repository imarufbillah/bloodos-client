/**
 * Admin Dashboard Content Component (Client Component)
 * 
 * Receives server-fetched initial data and handles interactive features like
 * tab switching, refresh actions, and moderation actions.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Shield, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/admin/StatsCards";
import { BloodGroupChart } from "@/components/admin/BloodGroupChart";
import { DistrictChart } from "@/components/admin/DistrictChart";
import { TrendChart } from "@/components/admin/TrendChart";
import { RequestsModerationTable } from "@/components/admin/RequestsModerationTable";
import { UsersManagementTable } from "@/components/admin/UsersManagementTable";
import { useSession } from "@/lib/auth-client";
import type { AdminStats, ModerationRequest, AdminUser } from "@/lib/api/admin";

type AdminDashboardContentProps = {
  initialStats: AdminStats;
  initialRequests: ModerationRequest[];
  initialUsers: AdminUser[];
};

export function AdminDashboardContent({
  initialStats,
  initialRequests,
  initialUsers,
}: AdminDashboardContentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Use server data directly
  const stats = initialStats;
  const requests = initialRequests;
  const users = initialUsers;

  // Handle refresh - triggers server refetch
  const handleRefreshStats = () => {
    router.refresh();
  };

  const handleRefreshRequests = () => {
    router.refresh();
  };

  const handleRefreshUsers = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-slate bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Shield className="h-6 w-6 text-crimson" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-ink">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate mt-1">
                Manage requests, users, and view platform statistics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="moderation" className="gap-2">
              <Shield className="h-4 w-4" />
              Moderation
              {requests.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-crimson text-xs text-white">
                  {requests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats ? (
              <>
                {/* Stats Cards (Req 18.8) */}
                <StatsCards stats={stats} />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Blood Group Chart (Req 18.5) */}
                  <BloodGroupChart data={stats.requestsByBloodGroup} />

                  {/* District Chart (Req 18.6) */}
                  <DistrictChart data={stats.requestsByDistrict} />
                </div>

                {/* Trend Chart (Req 18.7) */}
                <TrendChart data={stats.requestTrend} />
              </>
            ) : (
              <div className="bg-paper border border-slate rounded-lg p-8 text-center">
                <p className="text-slate">No statistics available</p>
              </div>
            )}
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-ink">
                  Request Moderation
                </h2>
                <p className="text-sm text-slate mt-1">
                  Review and manage blood requests (Req 18.9-18.12)
                </p>
              </div>
              <button
                onClick={handleRefreshRequests}
                className="text-sm text-crimson hover:underline"
              >
                Refresh
              </button>
            </div>

            <RequestsModerationTable
              requests={requests}
              onRefresh={handleRefreshRequests}
            />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-ink">
                  User Management
                </h2>
                <p className="text-sm text-slate mt-1">
                  Manage user accounts and permissions (Req 5f, 10.5-10.6)
                </p>
              </div>
              <button
                onClick={handleRefreshUsers}
                className="text-sm text-crimson hover:underline"
              >
                Refresh
              </button>
            </div>

            <UsersManagementTable
              users={users}
              currentUserId={session?.user?.id || ""}
              onRefresh={handleRefreshUsers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
