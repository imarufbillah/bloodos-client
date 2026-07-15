import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileContent } from "./ProfileContent";
import type { UserDto } from "@/types/dto/user.dto";
import type { UserAnalytics } from "@/components/profile/UserAnalyticsDashboard";
import { apiFetch } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "My Profile | BloodOS",
  description: "Manage your account and view your donation activity",
};

async function fetchUserProfile(): Promise<UserDto> {
  const response = await apiFetch("/api/users/me");

  if (response.status === 401) {
    redirect("/signin?callbackUrl=/profile");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  return response.json();
}

async function fetchUserAnalytics(): Promise<UserAnalytics> {
  const response = await apiFetch("/api/users/me/analytics");

  if (!response.ok) {
    return {
      totalRequests: 0,
      requestsByStatus: {},
      fulfillmentRate: 0,
      responsesReceived: 0,
      totalResponses: 0,
      responsesByStatus: {},
      responseSuccessRate: 0,
      totalDonations: 0,
      verifiedDonations: 0,
      livesSaved: 0,
      activityTimeline: [],
      impact: {
        requestsCreated: 0,
        requestsFulfilled: 0,
        responsesGiven: 0,
        donationsCompleted: 0,
        livesSaved: 0,
      },
    };
  }

  return response.json();
}

export default async function ProfilePage() {
  const [user, analytics] = await Promise.all([
    fetchUserProfile(),
    fetchUserAnalytics(),
  ]);

  return <ProfileContent initialUser={user} initialAnalytics={analytics} />;
}
