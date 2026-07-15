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
import { apiFetch } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "My Profile | BloodOS",
  description: "Manage your account and view your donation activity",
};

/**
 * Fetch user profile - Server-side with authentication
 */
async function fetchUserProfile(): Promise<UserDto> {
  const response = await apiFetch('/api/users/me');

  if (response.status === 401) {
    // Redirect to login if unauthorized
    redirect("/signin?callbackUrl=/profile");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  return response.json();
}

export default async function ProfilePage() {
  // Fetch user profile server-side
  const user = await fetchUserProfile();

  return <ProfileContent initialUser={user} />;
}
