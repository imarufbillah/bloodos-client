"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface StepDonorReadinessProps {
  isDonor: boolean;
  phone: string;
  lastDonationDate: string;
  onIsDonorChange: (val: boolean) => void;
  onPhoneChange: (val: string) => void;
  onLastDonationDateChange: (val: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  phoneError?: string;
  dateError?: string;
}

export function StepDonorReadiness({
  isDonor,
  phone,
  lastDonationDate,
  onIsDonorChange,
  onPhoneChange,
  onLastDonationDateChange,
  onBack,
  onSubmit,
  isSubmitting,
  phoneError,
  dateError,
}: StepDonorReadinessProps) {
  const handleToggleDonor = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    onIsDonorChange(!isDonor);
  };

  const handleQuickNeverDonated = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    onLastDonationDateChange("");
  };

  const handleQuickOverTwoMonths = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const date = new Date();
    date.setDate(date.getDate() - 60);
    onLastDonationDateChange(date.toISOString().split("T")[0] || "");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Donor Readiness & Contact
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Set volunteer donor availability and verify emergency contact.
        </p>
      </div>

      {/* 1. Volunteer Availability Toggle */}
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isDonor}
        aria-label="Volunteer as an active whole blood donor"
        onClick={handleToggleDonor}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggleDonor();
          }
        }}
        className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isDonor
            ? "border-teal bg-teal/5 ring-1 ring-teal/30"
            : "border-border/80 bg-card hover:bg-muted/40"
        }`}
      >
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-colors mt-0.5 ${
            isDonor
              ? "border-teal bg-teal text-paper"
              : "border-muted-foreground/40 bg-background"
          }`}
        >
          {isDonor && <CheckCircle2 className="h-3.5 w-3.5" />}
        </div>

        <div className="space-y-1 flex-1">
          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 leading-tight">
            <span>Volunteer as an Active Blood Donor</span>
            <Heart className={`h-3.5 w-3.5 ${isDonor ? "text-crimson fill-crimson" : "text-muted-foreground"}`} />
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Receive SMS/app notifications when emergency requests arise in your district.
          </p>
        </div>
      </div>

      {/* 2. Contact Phone */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="onboarding-phone"
            className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5"
          >
            <Phone className="h-3.5 w-3.5 text-teal" />
            <span>Mobile Phone Number</span>
          </Label>
          <span className="text-[11px] font-mono text-muted-foreground">
            11 Digits (BD)
          </span>
        </div>

        <Input
          id="onboarding-phone"
          type="tel"
          placeholder="01XXXXXXXXX"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-card border-border/80 font-mono text-sm tracking-wider"
        />

        {phoneError ? (
          <p className="text-xs text-destructive">{phoneError}</p>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <Lock className="h-3 w-3 text-teal shrink-0" />
            <span>Privacy Masked: Displayed as 01XXX***XXX to unverified users.</span>
          </div>
        )}
      </div>

      {/* 3. Biological Rest & Last Donation Date */}
      {isDonor && (
        <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="onboarding-date"
              className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5 text-crimson" />
              <span>Last Whole Blood Donation Date</span>
            </Label>
            <span className="text-[10px] font-mono text-muted-foreground">
              Optional
            </span>
          </div>

          <Input
            id="onboarding-date"
            type="date"
            value={lastDonationDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => onLastDonationDateChange(e.target.value)}
            disabled={isSubmitting}
            className="h-10 rounded-xl bg-card border-border/80 font-mono text-xs"
          />

          {dateError && (
            <p className="text-xs text-destructive">{dateError}</p>
          )}

          {/* Quick Selection Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickNeverDonated}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                !lastDonationDate
                  ? "border-teal/50 bg-teal/10 text-teal font-semibold"
                  : "border-border/60 bg-card hover:bg-muted text-muted-foreground"
              }`}
            >
              Never donated before
            </button>
            <button
              type="button"
              onClick={handleQuickOverTwoMonths}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-border/60 bg-card hover:bg-muted text-muted-foreground font-mono transition-colors"
            >
              Over 2 months ago (Eligible)
            </button>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          aria-label="Go back to step 1"
          onClick={() => {
            triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
            onBack();
          }}
          disabled={isSubmitting}
          className="h-11 px-4 rounded-xl border-border/80 text-xs font-semibold uppercase tracking-wider gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          onClick={() => {
            triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
            onSubmit();
          }}
          disabled={isSubmitting}
          className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider gap-2 shadow-2xs transition-transform active:scale-[0.99]"
        >
          {isSubmitting ? (
            <span>Activating Profile...</span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Complete Profile & Activate</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

