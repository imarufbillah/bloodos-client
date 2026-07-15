"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { ProfileEditForm } from "@/components/forms/ProfileEditForm";
import { DonationHistorySection } from "@/components/profile/DonationHistorySection";
import { PostedRequestsSection } from "@/components/profile/PostedRequestsSection";
import { ResponseHistorySection } from "@/components/profile/ResponseHistorySection";
import {
  UserAnalyticsDashboard,
  type UserAnalytics,
} from "@/components/profile/UserAnalyticsDashboard";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import type { UserDto } from "@/types/dto/user.dto";

type ProfileContentProps = {
  initialUser: UserDto;
  initialAnalytics: UserAnalytics;
};

export function ProfileContent({
  initialUser,
  initialAnalytics,
}: ProfileContentProps) {
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

      <div className="space-y-8">
        {/* Avatar Upload */}
        <section className="rounded-lg border border-border p-6">
          <AvatarUpload
            currentImage={user.image}
            userName={user.name}
            userEmail={user.email}
            onAvatarUpdate={(imageUrl) => setUser({ ...user, image: imageUrl })}
          />
        </section>

        {/* Section 1: Personal Information */}
        <section className="rounded-lg border border-border p-6">
          <ProfileEditForm user={user} onUpdate={handleUserUpdate} />
        </section>

        {/* Section 2: Analytics Dashboard */}
        <section className="rounded-lg border border-border p-6">
          <UserAnalyticsDashboard analytics={initialAnalytics} />
        </section>

        {/* Section 3: Donation History */}
        <section className="rounded-lg border border-border p-6">
          <DonationHistorySection
            userId={user._id}
            lastDonationDate={user.lastDonationDate as string | null}
          />
        </section>

        {/* Section 4: Posted Requests */}
        <section className="rounded-lg border border-border p-6">
          <PostedRequestsSection userId={user._id} />
        </section>

        {/* Section 5: Response History */}
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
              User ID: <span className="font-mono text-xs">{user._id}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
