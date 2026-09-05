"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import {
  type BloodGroup,
  type District,
} from "@/types/shared";
import type { UserDto } from "@/types/dto/user.dto";
import { SerologicalRadarPreview } from "./SerologicalRadarPreview";
import { StepEmergencyProfile } from "./StepEmergencyProfile";
import { StepDonorReadiness } from "./StepDonorReadiness";
import { StepActivationSuccess } from "./StepActivationSuccess";
import { Droplet, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingFlowProps {
  initialUser?: UserDto | null;
}

export function OnboardingFlow({ initialUser }: OnboardingFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form State
  const [bloodGroup, setBloodGroup] = React.useState<string>(
    initialUser?.bloodGroup || ""
  );
  const [district, setDistrict] = React.useState<string>(
    initialUser?.district || ""
  );
  const [isDonor, setIsDonor] = React.useState<boolean>(
    initialUser?.isDonor ?? false
  );
  const [phone, setPhone] = React.useState<string>(
    initialUser?.phone || ""
  );
  const [lastDonationDate, setLastDonationDate] = React.useState<string>(
    initialUser?.lastDonationDate
      ? new Date(initialUser.lastDonationDate).toISOString().split("T")[0] || ""
      : ""
  );

  // Validation Errors
  const [phoneError, setPhoneError] = React.useState<string | undefined>();
  const [dateError, setDateError] = React.useState<string | undefined>();

  const handleNextToStep2 = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateStep2 = (): boolean => {
    let isValid = true;
    setPhoneError(undefined);
    setDateError(undefined);

    // Validate phone if provided
    if (phone && phone.trim() !== "") {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (!/^01[0-9]{9}$/.test(cleanPhone)) {
        setPhoneError("Phone must be an 11-digit Bangladesh number (e.g. 01712345678)");
        isValid = false;
      }
    }

    // Validate donation date if provided
    if (lastDonationDate) {
      const donationTime = new Date(lastDonationDate).getTime();
      const now = Date.now();
      if (isNaN(donationTime)) {
        setDateError("Invalid date provided");
        isValid = false;
      } else if (donationTime > now) {
        setDateError("Donation date cannot be in the future");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmitOnboarding = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        isDonor,
      };

      if (bloodGroup) payload.bloodGroup = bloodGroup;
      if (district) payload.district = district;
      if (phone && phone.trim() !== "") {
        payload.phone = phone.replace(/[^0-9]/g, "");
      }
      if (lastDonationDate) {
        payload.lastDonationDate = new Date(lastDonationDate).toISOString();
      }

      const response = await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update profile");
      }

      toast.success("Emergency profile configured successfully!");
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Onboarding submission error:", error);
      toast.error(error.message || "An unexpected error occurred while saving profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl w-full space-y-6">
        
        {/* Onboarding Header */}
        <header className="flex items-center justify-between pb-4 border-b border-border/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-crimson text-paper shadow-2xs">
              <Droplet className="h-4 w-4 fill-paper" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-base text-foreground leading-tight">
                Emergency Readiness Setup
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                BloodOS National Network
              </p>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-3">
            {currentStep < 3 && (
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] tabular-nums ${
                    currentStep === 1
                      ? "bg-crimson text-paper"
                      : "bg-teal/20 text-teal"
                  }`}
                >
                  1
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] tabular-nums ${
                    currentStep === 2
                      ? "bg-crimson text-paper"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </span>
              </div>
            )}

            {currentStep < 3 && (
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                >
                  Skip
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        {currentStep === 3 ? (
          <div className="max-w-xl mx-auto py-4">
            <StepActivationSuccess
              bloodGroup={bloodGroup}
              district={district}
              isDonor={isDonor}
              phone={phone}
              userName={initialUser?.name || "Volunteer Member"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Live Serological Radar (Aha Moment) */}
            <div className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-20">
              <SerologicalRadarPreview
                bloodGroup={bloodGroup}
                district={district}
                isDonor={isDonor}
                phone={phone}
                lastDonationDate={lastDonationDate}
                userName={initialUser?.name || "Volunteer Member"}
                currentStep={currentStep}
              />
            </div>

            {/* Right Column: Step Input Container */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs">
                {currentStep === 1 && (
                  <StepEmergencyProfile
                    bloodGroup={bloodGroup}
                    district={district}
                    onBloodGroupChange={setBloodGroup}
                    onDistrictChange={setDistrict}
                    onNext={handleNextToStep2}
                  />
                )}

                {currentStep === 2 && (
                  <StepDonorReadiness
                    isDonor={isDonor}
                    phone={phone}
                    lastDonationDate={lastDonationDate}
                    onIsDonorChange={setIsDonor}
                    onPhoneChange={setPhone}
                    onLastDonationDateChange={setLastDonationDate}
                    onBack={handleBackToStep1}
                    onSubmit={handleSubmitOnboarding}
                    isSubmitting={isSubmitting}
                    phoneError={phoneError}
                    dateError={dateError}
                  />
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

