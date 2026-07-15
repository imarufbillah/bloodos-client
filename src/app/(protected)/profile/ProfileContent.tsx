/**
 * Profile Content Component (Client Component)
 * 
 * Receives server-fetched user data and renders the profile sections.
 * Handles client-side interactions like form submissions and updates.
 */

"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { ProfileEditForm } from "@/components/forms/ProfileEditForm";
import { DonationHistorySection } from "@/components/profile/DonationHistorySection";
import { PostedRequestsSection } from "@/components/profile/PostedRequestsSection";
import { ResponseHistorySection } from "@/components/profile/ResponseHistorySection";
import type { UserDto } from "@/types/dto/user.dto";

type ProfileContentProps = {
  initialUser: UserDto;
};

export function ProfileContent({ initialUser }: ProfileContentProps) {
  const [user, setUser] = useState<UserDto>(initialUser);

  const handleUserUpdate = (updatedUser: UserDto) => {
    setUser(updatedUser);
  };

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
