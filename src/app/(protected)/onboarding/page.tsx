import { Metadata } from "next";
import { apiFetch } from "@/lib/api-server";
import type { UserDto } from "@/types/dto/user.dto";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Emergency Readiness Setup | BloodOS",
  description:
    "Configure your blood group, district, and donor readiness to connect with urgent hospital requests across Bangladesh.",
};

async function fetchInitialUser(): Promise<UserDto | null> {
  try {
    const response = await apiFetch("/api/users/me");
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
}

export default async function OnboardingPage() {
  const initialUser = await fetchInitialUser();

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background">
      <OnboardingFlow initialUser={initialUser} />
    </main>
  );
}
