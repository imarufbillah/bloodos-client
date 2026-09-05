import { OnboardingForm } from "@/components/forms/OnboardingForm";

export const metadata = {
  title: "Complete Your Profile | BloodOS",
  description: "Help us match you with blood requests in your area",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="container mx-auto max-w-7xl px-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">
              Complete Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Help us match you with blood requests in your area
            </p>
          </div>

          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
