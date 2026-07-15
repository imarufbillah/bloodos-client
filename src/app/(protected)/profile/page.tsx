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
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileContent } from "./ProfileContent";
import type { UserDto } from "@/types/dto/user.dto";

export const metadata: Metadata = {
  title: "My Profile | BloodOS",
  description: "Manage your account and view your donation activity",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetch user profile - Server-side with authentication
 */
async function fetchUserProfile(sessionToken?: string): Promise<UserDto> {
  const url = `${API_BASE_URL}/api/users/me`;

  const response = await fetch(url, {
    headers: {
      ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    },
    // No caching for user profile data
    cache: "no-store",
  });

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
  // Get session token from cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");
  const sessionToken = sessionCookie?.value;

  // Fetch user profile server-side
  const user = await fetchUserProfile(sessionToken);

  return <ProfileContent initialUser={user} />;
}
