"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Shield,
  Users,
  RefreshCw,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/admin/StatsCards";
import { BloodGroupChart } from "@/components/admin/BloodGroupChart";
import { DistrictChart } from "@/components/admin/DistrictChart";
import { TrendChart } from "@/components/admin/TrendChart";
import { RequestsModerationTable } from "@/components/admin/RequestsModerationTable";
import { UsersManagementTable } from "@/components/admin/UsersManagementTable";
import {
  AdminSlideOverInspector,
  type InspectorItem,
} from "@/components/admin/AdminSlideOverInspector";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  rejectRequest,
  deleteRequest,
  toggleUserBan,
  changeUserRole,
  type AdminStats,
  type ModerationRequest,
  type AdminUser,
} from "@/lib/api/admin";
import { toast } from "sonner";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inspectedItem, setInspectedItem] = useState<InspectorItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use server data directly
  const stats = initialStats;
  const requests = initialRequests;
  const users = initialUsers;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleInspectorReject = async (req: ModerationRequest) => {
    try {
      setIsProcessing(true);
      await rejectRequest(req._id, "Rejected via admin inspector");
      toast.success("Request rejected");
      setInspectedItem(null);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to reject request");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInspectorDelete = async (req: ModerationRequest) => {
    try {
      setIsProcessing(true);
      await deleteRequest(req._id);
      toast.success("Request permanently deleted");
      setInspectedItem(null);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to delete request");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInspectorBan = async (user: AdminUser) => {
    try {
      setIsProcessing(true);
      const willBan = !user.banned;
      await toggleUserBan(
        user._id,
        willBan,
        willBan ? "Banned via admin inspector" : "Unbanned via admin inspector",
      );
      toast.success(
        willBan ? `${user.name} suspended` : `${user.name} access restored`,
      );
      setInspectedItem(null);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInspectorRole = async (user: AdminUser) => {
    try {
      setIsProcessing(true);
      const newRole = user.role === "admin" ? "user" : "admin";
      await changeUserRole(user._id, newRole);
      toast.success(
        newRole === "admin"
          ? `${user.name} promoted to administrator`
          : `${user.name} changed to standard user`,
      );
      setInspectedItem(null);
      handleRefresh();
    } catch (error) {
      toast.error("Failed to change user role");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingRequestsCount = requests.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background pb-12">
      {/* Top Banner / Tactical Command Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-xs sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title & Live Pulse */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson/10 text-crimson border border-crimson/20 shadow-xs shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Admin Operations Center
                  </h1>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                    Live Grid
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Platform telemetry, emergency request moderation, and donor governance
                </p>
              </div>
            </div>

            {/* Header Telemetry Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-xs h-9 px-3 gap-1.5 shadow-xs touch-manipulation"
                aria-label="Synchronize platform telemetry"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-crimson" : "text-muted-foreground"}`}
                />
                <span>{isRefreshing ? "Syncing..." : "Sync Telemetry"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          {/* Segmented Command Tabs */}
          <div className="flex items-center justify-between overflow-x-auto pb-1">
            <TabsList className="p-1 bg-muted/70 rounded-xl border border-border inline-flex h-auto">
              <TabsTrigger
                value="overview"
                className="gap-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                <BarChart3 className="h-4 w-4 text-crimson" />
                <span>Telemetry</span>
              </TabsTrigger>

              <TabsTrigger
                value="moderation"
                className="gap-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                <Shield className="h-4 w-4 text-amber-500" />
                <span>Moderation Queue</span>
                {pendingRequestsCount > 0 ? (
                  <span className="ml-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-crimson text-[10px] font-bold text-white tabular-nums">
                    {pendingRequestsCount}
                  </span>
                ) : (
                  <span className="ml-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-muted-foreground/20 text-[10px] font-mono tabular-nums text-muted-foreground">
                    {requests.length}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="users"
                className="gap-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                <Users className="h-4 w-4 text-primary" />
                <span>User Accounts</span>
                <span className="ml-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-muted-foreground/20 text-[10px] font-mono tabular-nums text-muted-foreground">
                  {users.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Overview & Telemetry */}
          <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
            {stats ? (
              <>
                {/* 5-Card Stats Strip (Req 18.8) */}
                <StatsCards stats={stats} />

                {/* 2-Column Visual Charts (Req 18.5, 18.6) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BloodGroupChart data={stats.requestsByBloodGroup} />
                  <DistrictChart data={stats.requestsByDistrict} />
                </div>

                {/* Daily Cadence Trend Chart (Req 18.7) */}
                <TrendChart data={stats.requestTrend} />
              </>
            ) : (
              <div className="bg-card border border-border rounded-xl p-10 text-center space-y-2">
                <p className="text-muted-foreground text-sm">
                  No telemetry metrics currently available.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Request Moderation */}
          <TabsContent value="moderation" className="space-y-4 focus-visible:outline-none">
            <RequestsModerationTable
              requests={requests}
              onRefresh={handleRefresh}
              onInspect={(req) => setInspectedItem({ type: "request", data: req })}
            />
          </TabsContent>

          {/* Tab 3: User Governance */}
          <TabsContent value="users" className="space-y-4 focus-visible:outline-none">
            <UsersManagementTable
              users={users}
              currentUserId={session?.user?.id || ""}
              onRefresh={handleRefresh}
              onInspect={(u) => setInspectedItem({ type: "user", data: u })}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Slide-Over Inspector Drawer */}
      <AdminSlideOverInspector
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onRejectRequest={handleInspectorReject}
        onDeleteRequest={handleInspectorDelete}
        onBanUser={handleInspectorBan}
        onRoleUser={handleInspectorRole}
        currentUserId={session?.user?.id || ""}
        isProcessing={isProcessing}
      />
    </div>
  );
}

