"use client";

/**
 * User Profile Page - /profile
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
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, AlertCircle } from "lucide-react";

import { ProfileEditForm } from "@/components/forms/ProfileEditForm";
import { DonationHistorySection } from "@/components/profile/DonationHistorySection";
import { PostedRequestsSection } from "@/components/profile/PostedRequestsSection";
import { ResponseHistorySection } from "@/components/profile/ResponseHistorySection";
import type { UserDto } from "@/types/dto/user.dto";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch current user profile (Req 13.2)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized - redirect to login
            router.push("/login");
            return;
          }
          throw new Error("Failed to load profile");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleUserUpdate = (updatedUser: UserDto) => {
    setUser(updatedUser);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>

          {/* Sections skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-6 space-y-4"
            >
              <div className="h-6 w-40 bg-muted rounded animate-pulse" />
              <div className="h-32 bg-muted/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="size-6 text-destructive mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-1">
                Failed to Load Profile
              </h2>
              <p className="text-sm text-destructive/80 mb-4">
                {error || "Unable to fetch your profile data"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-destructive underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
            <User className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account and view your donation activity
            </p>
          </div>
        </div>
      </header>

      {/* Four Sections (Req 13.3) */}
      <div className="space-y-8">
        {/* Section 1: Personal Information (Req 13.4, 13.5) */}
        <section className="rounded-lg border border-border p-6">
          <ProfileEditForm user={user} onUpdate={handleUserUpdate} />
        </section>

        {/* Section 2: Donation History (Req 13.7, 13.8, 13.9) */}
        <section className="rounded-lg border border-border p-6">
          <DonationHistorySection
            userId={user._id}
            lastDonationDate={user.lastDonationDate as string | null}
          />
        </section>

        {/* Section 3: Posted Requests */}
        <section className="rounded-lg border border-border p-6">
          <PostedRequestsSection userId={user._id} />
        </section>

        {/* Section 4: Response History (Req 13.10) */}
        <section className="rounded-lg border border-border p-6">
          <ResponseHistorySection userId={user._id} />
        </section>
      </div>

      {/* Account Info Footer */}
      <footer className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <p>
              Account created:{" "}
              <span className="font-mono tabular-data">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
          <div>
            <p>
              User ID:{" "}
              <span className="font-mono text-xs">{user._id}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
