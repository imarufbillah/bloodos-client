"use client";

/**
 * AddRequestForm - Blood request creation form
 * Phase 8h - Create Request page
 *
 * Design direction (from unit 8h):
 * - Logical field grouping: patient → medical → location → timing
 * - No unnecessary steps
 * - Urgency selector uses the 6a pill language live as a preview
 * - Inline validation errors
 * - Form uses the same input styling as other forms for consistency
 *
 * Functional requirements:
 * - Req 20.3: All required fields per API contract
 * - Req 20.4: Zod validation mirrors backend validator
 * - Req 20.5: Submit to POST /api/requests
 * - Req 20.10: Success toast + redirect to /requests/manage
 * 
 * Phase 8n integration:
 * - Check if user has completed profile (district, bloodGroup, phone)
 * - Redirect to /onboarding if incomplete
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";

import {
  createRequestSchema,
  URGENCY_OPTIONS,
  type CreateRequestFormData,
} from "@/lib/validators/request.schema";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DISTRICTS } from "@/lib/constants/districts";
import type { Urgency } from "@/types/shared";
import { apiFetch } from "@/lib/api-client";

interface FormErrors {
  [key: string]: string;
}

export function AddRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedUrgency, setSelectedUrgency] = useState<Urgency | "">("");

  // Check if user has completed required profile fields (Phase 8n)
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const response = await apiFetch("/api/users/me");

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const user = await response.json();

        // Check if required fields are present
        if (!user.district || !user.bloodGroup || !user.phone) {
          toast.info("Please complete your profile first", {
            description: "We need your district, blood group, and phone number to post requests.",
          });
          router.push("/onboarding");
          return;
        }

        setIsCheckingProfile(false);
      } catch (error) {
        console.error("Profile check error:", error);
        toast.error("Failed to verify profile");
        setIsCheckingProfile(false);
      }
    };

    checkProfileCompletion();
  }, [router]);

  // Get minimum date (today) for date input
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Parse form data
    const data = {
      patientName: formData.get("patientName") as string,
      bloodGroup: formData.get("bloodGroup") as string,
      unitsNeeded: Number(formData.get("unitsNeeded")),
      hospitalName: formData.get("hospitalName") as string,
      hospitalAddress: formData.get("hospitalAddress") as string,
      district: formData.get("district") as string,
      urgency: formData.get("urgency") as string,
      neededByDate: formData.get("neededByDate") as string,
      contactPhone: formData.get("contactPhone") as string,
      additionalNotes: formData.get("additionalNotes") as string,
    };

    try {
      // Validate with Zod
      const validated = createRequestSchema.parse(data);

      // Submit to API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for JWT
          body: JSON.stringify(validated),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create request");
      }

      // Success (Req 20.10)
      toast.success("Blood request created successfully", {
        description: "Your request has been posted and donors will be notified.",
      });

      // Redirect to manage requests page
      router.push("/requests/manage");
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Validation errors
        const fieldErrors: FormErrors = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please check the form for errors");
      } else {
        // API or network errors
        toast.error(
          err instanceof Error ? err.message : "Failed to create request"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isCheckingProfile ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-sm text-muted-foreground">Verifying profile...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Patient Information Section */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold">Patient Information</h2>
          <p className="text-sm text-muted-foreground">
            Basic details about the patient requiring blood
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientName">
            Patient Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="patientName"
            name="patientName"
            type="text"
            placeholder="Enter patient's full name"
            required
            aria-invalid={!!errors.patientName}
            aria-describedby={
              errors.patientName ? "patientName-error" : undefined
            }
          />
          {errors.patientName && (
            <p
              id="patientName-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.patientName}
            </p>
          )}
        </div>
      </section>

      {/* Medical Information Section */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold">Medical Requirements</h2>
          <p className="text-sm text-muted-foreground">
            Specific blood requirements for the patient
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">
              Blood Group <span className="text-destructive">*</span>
            </Label>
            <Select
              id="bloodGroup"
              name="bloodGroup"
              required
              error={errors.bloodGroup}
              aria-invalid={!!errors.bloodGroup}
              aria-describedby={errors.bloodGroup ? "bloodGroup-error" : undefined}
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>
            {errors.bloodGroup && (
              <p
                id="bloodGroup-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.bloodGroup}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitsNeeded">
              Units Needed <span className="text-destructive">*</span>
            </Label>
            <Input
              id="unitsNeeded"
              name="unitsNeeded"
              type="number"
              min="1"
              max="10"
              placeholder="1-10"
              required
              aria-invalid={!!errors.unitsNeeded}
              aria-describedby={
                errors.unitsNeeded ? "unitsNeeded-error" : undefined
              }
            />
            {errors.unitsNeeded && (
              <p
                id="unitsNeeded-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.unitsNeeded}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Location Information Section */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold">Location</h2>
          <p className="text-sm text-muted-foreground">
            Where the blood donation is needed
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalName">
              Hospital Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hospitalName"
              name="hospitalName"
              type="text"
              placeholder="Enter hospital or medical center name"
              required
              aria-invalid={!!errors.hospitalName}
              aria-describedby={
                errors.hospitalName ? "hospitalName-error" : undefined
              }
            />
            {errors.hospitalName && (
              <p
                id="hospitalName-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.hospitalName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalAddress">
              Hospital Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="hospitalAddress"
              name="hospitalAddress"
              placeholder="Enter complete address with landmarks"
              required
              rows={3}
              aria-invalid={!!errors.hospitalAddress}
              aria-describedby={
                errors.hospitalAddress ? "hospitalAddress-error" : undefined
              }
            />
            {errors.hospitalAddress && (
              <p
                id="hospitalAddress-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.hospitalAddress}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">
              District <span className="text-destructive">*</span>
            </Label>
            <Select
              id="district"
              name="district"
              required
              error={errors.district}
              aria-invalid={!!errors.district}
              aria-describedby={errors.district ? "district-error" : undefined}
            >
              <option value="">Select district</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
            {errors.district && (
              <p
                id="district-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.district}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Timing & Urgency Section */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold">Urgency & Timeline</h2>
          <p className="text-sm text-muted-foreground">
            When the blood is needed
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="urgency">
              Urgency Level <span className="text-destructive">*</span>
            </Label>
            <Select
              id="urgency"
              name="urgency"
              required
              error={errors.urgency}
              aria-invalid={!!errors.urgency}
              aria-describedby={errors.urgency ? "urgency-error" : undefined}
              onChange={(e) =>
                setSelectedUrgency(e.target.value as Urgency | "")
              }
            >
              <option value="">Select urgency level</option>
              {URGENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </Select>
            {errors.urgency && (
              <p
                id="urgency-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.urgency}
              </p>
            )}
            {/* Live urgency preview (design direction: pill language preview) */}
            {selectedUrgency && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Preview:</span>
                <UrgencyBadge urgency={selectedUrgency} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="neededByDate">
              Needed By Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="neededByDate"
              name="neededByDate"
              type="date"
              min={getMinDate()}
              required
              aria-invalid={!!errors.neededByDate}
              aria-describedby={
                errors.neededByDate ? "neededByDate-error" : undefined
              }
            />
            {errors.neededByDate && (
              <p
                id="neededByDate-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.neededByDate}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <p className="text-sm text-muted-foreground">
            How donors can reach you (will be visible to donors)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">
            Contact Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            placeholder="01XXXXXXXXX"
            pattern="01[0-9]{9}"
            required
            aria-invalid={!!errors.contactPhone}
            aria-describedby={
              errors.contactPhone ? "contactPhone-error" : undefined
            }
          />
          <p className="text-xs text-muted-foreground">
            Format: 01XXXXXXXXX (11 digits, Bangladesh mobile number)
          </p>
          {errors.contactPhone && (
            <p
              id="contactPhone-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.contactPhone}
            </p>
          )}
        </div>
      </section>

      {/* Additional Notes Section */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-lg font-semibold">Additional Information</h2>
          <p className="text-sm text-muted-foreground">
            Any other details donors should know (optional)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            placeholder="Any special requirements, visiting hours, parking information, etc."
            rows={4}
            maxLength={1000}
            aria-invalid={!!errors.additionalNotes}
            aria-describedby={
              errors.additionalNotes ? "additionalNotes-error" : undefined
            }
          />
          <p className="text-xs text-muted-foreground">
            Maximum 1000 characters
          </p>
          {errors.additionalNotes && (
            <p
              id="additionalNotes-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.additionalNotes}
            </p>
          )}
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Request..." : "Post Blood Request"}
        </Button>
      </div>
        </>
      )}
    </form>
  );
}
