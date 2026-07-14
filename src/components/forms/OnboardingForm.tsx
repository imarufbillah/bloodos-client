"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  onboardingSchema,
  type OnboardingFormData,
} from "@/lib/validators/onboarding.schema";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DISTRICTS_BY_DIVISION } from "@/lib/constants/districts";
import { apiFetch } from "@/lib/api-client";

/**
 * OnboardingForm Component
 * Phase 8n - Complete donor profile after signup
 * 
 * Populates Req 1.8 fields to enable:
 * - Donor matching (Req 9) via district + bloodGroup
 * - Eligibility calculation (Req 2.3) via lastDonationDate
 * - Contact for requests (Req 4) via phone
 * 
 * Design notes:
 * - All fields optional - user can skip
 * - Single centered column, quiet register aesthetic
 * - lastDonationDate visually de-emphasized (self-reported, not verified)
 * - Submits to PATCH /api/users/me (unit 5h)
 */
export function OnboardingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      isDonor: false,
      phone: "",
      lastDonationDate: "",
    },
  });

  const isDonor = watch("isDonor");

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);

    try {
      // Build request body with only provided fields
      const payload: Record<string, any> = {};
      
      if (data.district) payload.district = data.district;
      if (data.bloodGroup) payload.bloodGroup = data.bloodGroup;
      if (data.phone) payload.phone = data.phone;
      payload.isDonor = data.isDonor;
      if (data.lastDonationDate) {
        payload.lastDonationDate = new Date(data.lastDonationDate).toISOString();
      }

      // Submit to backend
      const response = await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      toast.success("Profile completed successfully!");
      router.push("/"); // Redirect to home
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to complete profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* District */}
      <div className="space-y-2">
        <Label htmlFor="district" className="text-sm font-medium text-foreground">
          District
        </Label>
        <Select
          id="district"
          {...register("district")}
          aria-invalid={!!errors.district}
          disabled={isSubmitting}
        >
          <option value="">Select your district</option>
          {Object.entries(DISTRICTS_BY_DIVISION).map(([division, districts]) => (
            <optgroup key={division} label={division}>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
        {errors.district && (
          <p className="text-xs text-destructive">{errors.district.message}</p>
        )}
      </div>

      {/* Blood Group */}
      <div className="space-y-2">
        <Label htmlFor="bloodGroup" className="text-sm font-medium text-foreground">
          Blood Group
        </Label>
        <Select
          id="bloodGroup"
          {...register("bloodGroup")}
          aria-invalid={!!errors.bloodGroup}
          disabled={isSubmitting}
        >
          <option value="">Select your blood group</option>
          {BLOOD_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </Select>
        {errors.bloodGroup && (
          <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="01XXXXXXXXX"
          {...register("phone")}
          aria-invalid={!!errors.phone}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          11 digits starting with 01
        </p>
      </div>

      {/* Is Donor Checkbox */}
      <div className="flex items-center gap-2 rounded-lg border border-input bg-background p-3">
        <input
          type="checkbox"
          id="isDonor"
          {...register("isDonor")}
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
        <Label
          htmlFor="isDonor"
          className="text-sm font-medium leading-none cursor-pointer select-none"
        >
          I am willing to donate blood
        </Label>
      </div>

      {/* Last Donation Date - only show if isDonor is checked */}
      {isDonor && (
        <div className="space-y-2 rounded-lg border border-muted bg-muted/20 p-4">
          <Label
            htmlFor="lastDonationDate"
            className="text-xs font-medium text-muted-foreground"
          >
            Last Donation Date{" "}
            <span className="font-normal italic">(optional)</span>
          </Label>
          <Input
            id="lastDonationDate"
            type="date"
            {...register("lastDonationDate")}
            aria-invalid={!!errors.lastDonationDate}
            disabled={isSubmitting}
          />
          {errors.lastDonationDate && (
            <p className="text-xs text-destructive">
              {errors.lastDonationDate.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground leading-relaxed">
            Self-reported — used only to estimate your eligibility window, not
            verified. You can log verified donations later from your profile.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Saving..." : "Complete Profile"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={handleSkip}
          disabled={isSubmitting}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-center text-xs text-muted-foreground">
        You can always update this information later from your profile
      </p>
    </form>
  );
}
