/**
 * Admin Dashboard Page
 * Main admin interface with stats, charts, and management tables (Req 18.1-18.13)
 * Tabs: Overview (stats + charts), Moderation, Users
 */

"use client";

import { useEffect, useState } from "react";
import { BarChart3, Shield, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/admin/StatsCards";
import { BloodGroupChart } from "@/components/admin/BloodGroupChart";
import { DistrictChart } from "@/components/admin/DistrictChart";
import { TrendChart } from "@/components/admin/TrendChart";
import { RequestsModerationTable } from "@/components/admin/RequestsModerationTable";
import { UsersManagementTable } from "@/components/admin/UsersManagementTable";
import {
  getAdminStats,
  getModerationRequests,
  getUsers,
  type AdminStats,
  type ModerationRequest,
  type AdminUser,
} from "@/lib/api/admin";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [requests, setRequests] = useState<ModerationRequest[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
      console.error(error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const data = await getModerationRequests();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load moderation requests");
      console.error(error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadRequests();
    loadUsers();
  }, []);

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
            {isLoadingStats ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-sm text-slate">Loading statistics...</p>
                </div>
              </div>
            ) : stats ? (
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
                <p className="text-slate">Failed to load statistics</p>
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
                onClick={loadRequests}
                disabled={isLoadingRequests}
                className="text-sm text-crimson hover:underline disabled:opacity-50"
              >
                {isLoadingRequests ? "Loading..." : "Refresh"}
              </button>
            </div>

            {isLoadingRequests ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-sm text-slate">Loading requests...</p>
                </div>
              </div>
            ) : (
              <RequestsModerationTable
                requests={requests}
                onRefresh={loadRequests}
              />
            )}
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
                onClick={loadUsers}
                disabled={isLoadingUsers}
                className="text-sm text-crimson hover:underline disabled:opacity-50"
              >
                {isLoadingUsers ? "Loading..." : "Refresh"}
              </button>
            </div>

            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-sm text-slate">Loading users...</p>
                </div>
              </div>
            ) : (
              <UsersManagementTable
                users={users}
                currentUserId={session?.user?.id || ""}
                onRefresh={loadUsers}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
