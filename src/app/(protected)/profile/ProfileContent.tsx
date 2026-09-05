"use client";

import * as React from "react";
import { ProfilePassportHeader } from "@/components/profile/ProfilePassportHeader";
import { UserAnalyticsDashboard, type UserAnalytics } from "@/components/profile/UserAnalyticsDashboard";
import { DonationHistorySection } from "@/components/profile/DonationHistorySection";
import { PostedRequestsSection } from "@/components/profile/PostedRequestsSection";
import { ResponseHistorySection } from "@/components/profile/ResponseHistorySection";
import { ProfileEditForm } from "@/components/forms/ProfileEditForm";
import type { UserDto } from "@/types/dto/user.dto";
import {
  Activity,
  Heart,
  FileText,
  Clock,
  Settings,
  ShieldCheck,
  Droplet,
  Users,
} from "lucide-react";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

type TabKey = "overview" | "requests" | "responses" | "donations" | "settings";

interface ProfileContentProps {
  initialUser: UserDto;
  initialAnalytics: UserAnalytics;
}

export function ProfileContent({
  initialUser,
  initialAnalytics,
}: ProfileContentProps) {
  const [user, setUser] = React.useState<UserDto>(initialUser);
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");

  const handleTabSelect = (tab: TabKey) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] py-6 sm:py-10 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-6xl w-full space-y-6 sm:space-y-8">
        
        {/* 1. Unified Emergency Passport Header */}
        <ProfilePassportHeader user={user} onUpdateUser={setUser} />

        {/* 2. Tactical Segmented Command Tabs */}
        <div className="sticky top-14 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 bg-background/95 backdrop-blur-md pt-2 pb-2">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border overflow-x-auto no-scrollbar touch-manipulation">
            
            <button
              type="button"
              onClick={() => handleTabSelect("overview")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                activeTab === "overview"
                  ? "bg-card text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-crimson shrink-0" />
              <span>Overview & Impact</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("requests")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                activeTab === "requests"
                  ? "bg-card text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Heart className="h-3.5 w-3.5 text-crimson shrink-0" />
              <span>My Requests</span>
              {initialAnalytics?.totalRequests > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                  {initialAnalytics.totalRequests}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("responses")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                activeTab === "responses"
                  ? "bg-card text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Users className="h-3.5 w-3.5 text-teal shrink-0" />
              <span>Volunteer Responses</span>
              {initialAnalytics?.totalResponses > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                  {initialAnalytics.totalResponses}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("donations")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                activeTab === "donations"
                  ? "bg-card text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Droplet className="h-3.5 w-3.5 text-ochre shrink-0" />
              <span>Donation Log</span>
              {initialAnalytics?.totalDonations > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                  {initialAnalytics.totalDonations}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("settings")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                activeTab === "settings"
                  ? "bg-card text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>Settings</span>
            </button>

          </div>
        </div>

        {/* 3. Tab Content Viewport */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 md:p-8 shadow-xs">
          {activeTab === "overview" && (
            <UserAnalyticsDashboard analytics={initialAnalytics} />
          )}

          {activeTab === "requests" && (
            <PostedRequestsSection userId={user._id} />
          )}

          {activeTab === "responses" && (
            <ResponseHistorySection userId={user._id} />
          )}

          {activeTab === "donations" && (
            <DonationHistorySection
              userId={user._id}
              lastDonationDate={user.lastDonationDate as string | null}
            />
          )}

          {activeTab === "settings" && (
            <ProfileEditForm user={user} onUpdate={setUser} />
          )}
        </div>

        {/* 4. Privacy & Coordination Notice Footer */}
        <footer className="pt-2 text-center space-y-1 text-xs text-muted-foreground font-mono">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" />
            <span>BloodOS Verified Responder Network • Data Protected under Bangladesh Privacy Standards</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
