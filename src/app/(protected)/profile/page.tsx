/**
 * User Profile Page - /profile (Refactored for Server Components)
 * Phase 8j - User Profile
 *
 * Design direction (from unit 8j):
 * - Four clearly separated sections: Personal Info, Donation History, Posted Requests, Response History
 * - Inline edit rather than a separate edit page (Req 13.4)
 * - Eligibility countdown computed client-side from lastDonationDate (Req 13.7)
 * - Donation history paginated past 10 (Req 13.9)
 *
 * Functional requirements:
 * - Req 13.2: Auth required
 * - Req 13.3: All 4 sections present with correct fields
 * - Req 13.4: Inline edit → PATCH /api/users/me
 * - Req 13.5: Only updates whitelisted fields
 * - Req 13.7: Days-until-eligible calc matches 90-day rule (Phase 3a)
 * - Req 13.8: Donation history reverse chronological
 * - Req 13.9: Paginated past 10 donations
 * - Req 13.10: Response history with parent request context
 * 
 * Improvements (Phase 2):
 * - Server-side data fetching with authentication
 * - Automatic loading/error boundaries
 * - Reduced client bundle size
 * - Better initial page load performance
 */

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
