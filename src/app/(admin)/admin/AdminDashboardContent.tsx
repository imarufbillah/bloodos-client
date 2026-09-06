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
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";
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
  const [activeTab, setActiveTab] = useState<"overview" | "moderation" | "users">("overview");

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
      {/* Sticky Operations Command Header with Integrated Subnav */}
      <header className="border-b border-border bg-card/95 backdrop-blur-md sticky top-14 sm:top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row 1: Title & Telemetry Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 sm:pt-5 pb-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson/10 text-crimson border border-crimson/20 shadow-xs shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Admin Operations Center
                  </h1>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                    Live Grid
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Platform telemetry, emergency request moderation, and donor governance across 64 districts
                </p>
              </div>
            </div>

            {/* Header Telemetry Actions */}
            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-xs h-9 px-3.5 gap-2 shadow-xs touch-manipulation font-medium rounded-xl cursor-pointer"
                aria-label="Synchronize platform telemetry"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-crimson" : "text-muted-foreground"}`}
                />
                <span>{isRefreshing ? "Syncing Grid..." : "Sync Telemetry"}</span>
              </Button>
            </div>
          </div>

          {/* Row 2: Tactile Subnavigation Bar */}
          <div
            role="tablist"
            aria-label="Admin operations console navigation"
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 border-t border-border/50"
          >
            {/* Tab 1: Telemetry */}
            <button
              type="button"
              role="tab"
              id="tab-admin-overview"
              aria-selected={activeTab === "overview"}
              aria-controls="panel-admin-overview"
              tabIndex={activeTab === "overview" ? 0 : -1}
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                setActiveTab("overview");
              }}
              className={`group relative flex items-center gap-2 py-3 px-0.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none border-b-2 shrink-0 ${
                activeTab === "overview"
                  ? "border-crimson text-foreground font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3
                className={`h-4 w-4 transition-colors ${
                  activeTab === "overview" ? "text-crimson" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span>Platform Telemetry</span>
            </button>

            {/* Tab 2: Moderation Queue */}
            <button
              type="button"
              role="tab"
              id="tab-admin-moderation"
              aria-selected={activeTab === "moderation"}
              aria-controls="panel-admin-moderation"
              tabIndex={activeTab === "moderation" ? 0 : -1}
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                setActiveTab("moderation");
              }}
              className={`group relative flex items-center gap-2 py-3 px-0.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none border-b-2 shrink-0 ${
                activeTab === "moderation"
                  ? "border-ochre text-foreground font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield
                className={`h-4 w-4 transition-colors ${
                  activeTab === "moderation" ? "text-ochre" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span>Moderation Queue</span>
              {pendingRequestsCount > 0 ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-crimson text-[10px] font-bold text-primary-foreground tabular-nums shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-ping" />
                  {pendingRequestsCount} Pending
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-mono tabular-nums">
                  {requests.length} Total
                </span>
              )}
            </button>

            {/* Tab 3: User Accounts */}
            <button
              type="button"
              role="tab"
              id="tab-admin-users"
              aria-selected={activeTab === "users"}
              aria-controls="panel-admin-users"
              tabIndex={activeTab === "users" ? 0 : -1}
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                setActiveTab("users");
              }}
              className={`group relative flex items-center gap-2 py-3 px-0.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none border-b-2 shrink-0 ${
                activeTab === "users"
                  ? "border-primary text-foreground font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users
                className={`h-4 w-4 transition-colors ${
                  activeTab === "users" ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span>Donor & User Accounts</span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-mono tabular-nums">
                {users.length} Users
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
            setActiveTab(val as "overview" | "moderation" | "users");
          }}
          className="space-y-6"
        >
          {/* Tab 1: Overview & Telemetry */}
          <TabsContent value="overview" id="panel-admin-overview" className="space-y-6 focus-visible:outline-none">
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
      </main>

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

