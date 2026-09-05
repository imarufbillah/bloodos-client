"use client";

import * as React from "react";
import { 
  Droplet, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles
} from "lucide-react";
import { BloodGroup, BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { getCompatibleDonors, getCompatibleRecipients } from "@/lib/constants/compatibility";

export function CompatibilityMatrixExplorer() {
  const [activeGroup, setActiveGroup] = React.useState<BloodGroup>(BloodGroup.O_POSITIVE);
  
  // Cooldown tool state
  const [lastDonatedDaysAgo, setLastDonatedDaysAgo] = React.useState<number>(65);

  const compatibleDonors = React.useMemo(() => {
    return getCompatibleDonors(activeGroup);
  }, [activeGroup]);

  const compatibleRecipients = React.useMemo(() => {
    return getCompatibleRecipients(activeGroup);
  }, [activeGroup]);

  const isUniversalDonor = activeGroup === BloodGroup.O_NEGATIVE;
  const isUniversalReceiver = activeGroup === BloodGroup.AB_POSITIVE;

  // 56-day cooldown status
  const isEligibleToDonate = lastDonatedDaysAgo >= 56;
  const daysUntilEligible = Math.max(0, 56 - lastDonatedDaysAgo);

  return (
    <section className="border-b border-border/80 bg-background py-16 sm:py-20" id="compatibility">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
            <Droplet className="h-3.5 w-3.5" />
            <span>MEDICAL COMPATIBILITY & COOLDOWN RULES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Blood Compatibility & Eligibility Engine
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Understanding ABO/Rh compatibility and the standard 56-day cooldown between whole blood donations ensures safe and timely transfusions.
          </p>
        </div>

        {/* 2-Column Grid: Compatibility Matrix + Cooldown Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Interactive ABO/Rh Explorer (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="text-sm font-bold text-foreground mb-1">
                Select a Blood Group to inspect compatibility:
              </div>
              <p className="text-xs text-muted-foreground">
                See who can safely donate to this group and who can receive from it.
              </p>
            </div>

            {/* Blood Group Pill Tabs */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = activeGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setActiveGroup(bg)}
                    className={`h-12 rounded-lg font-mono font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
                      isSelected
                        ? "bg-crimson text-paper shadow-md scale-105"
                        : "bg-muted/70 hover:bg-muted text-foreground border border-border/80"
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>

            {/* Special Designation Banner */}
            {isUniversalDonor && (
              <div className="rounded-xl border border-crimson/30 bg-crimson/10 p-3.5 flex items-center gap-3 text-xs text-crimson font-medium">
                <Sparkles className="h-5 w-5 shrink-0" />
                <span>
                  <strong>O- is the Universal Red Blood Cell Donor:</strong> Can be transfused to patients of ANY blood group in dire emergencies.
                </span>
              </div>
            )}
            {isUniversalReceiver && (
              <div className="rounded-xl border border-teal/30 bg-teal/10 p-3.5 flex items-center gap-3 text-xs text-teal font-medium">
                <Sparkles className="h-5 w-5 shrink-0" />
                <span>
                  <strong>AB+ is the Universal Recipient:</strong> Can safely receive red blood cells from ANY blood group.
                </span>
              </div>
            )}

            {/* Compatibility Breakdown Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Compatible Donors (Can receive from) */}
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-teal" />
                  <span>Can Receive Blood From:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isAllowed = compatibleDonors.includes(bg);
                    return (
                      <span
                        key={bg}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-bold ${
                          isAllowed
                            ? "bg-teal/15 text-teal border border-teal/30"
                            : "bg-muted text-muted-foreground/40 border border-transparent line-through"
                        }`}
                      >
                        {bg}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Compatible Recipients (Can give to) */}
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-crimson" />
                  <span>Can Donate Blood To:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isAllowed = compatibleRecipients.includes(bg);
                    return (
                      <span
                        key={bg}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-bold ${
                          isAllowed
                            ? "bg-crimson/15 text-crimson border border-crimson/30"
                            : "bg-muted text-muted-foreground/40 border border-transparent line-through"
                        }`}
                      >
                        {bg}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: 56-Day Cooldown Calculator (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal" />
                <h3 className="text-sm font-bold text-foreground">56-Day Cooldown Calculator</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Whole blood donation requires a minimum 56-day gap to replenish hemoglobin and iron stores safely.
              </p>
            </div>

            {/* Interactive Days Slider */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Last donated:</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {lastDonatedDaysAgo} days ago
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={lastDonatedDaysAgo}
                onChange={(e) => setLastDonatedDaysAgo(Number(e.target.value))}
                className="w-full accent-crimson cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>Today (0d)</span>
                <span className="text-teal font-semibold">56 Days</span>
                <span>120 Days</span>
              </div>
            </div>

            {/* Eligibility Result Box */}
            <div className={`rounded-xl border p-4 space-y-2.5 ${
              isEligibleToDonate
                ? "border-teal/30 bg-teal/5 text-teal"
                : "border-ochre/30 bg-ochre/5 text-foreground"
            }`}>
              <div className="flex items-center gap-2">
                {isEligibleToDonate ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-teal shrink-0" />
                    <span className="font-bold text-sm text-teal">Eligible to Donate Blood</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-ochre shrink-0" />
                    <span className="font-bold text-sm text-foreground">Cooldown in Progress ({daysUntilEligible} days left)</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isEligibleToDonate
                  ? "Your body has fully regenerated red blood cells. You can accept emergency requests immediately."
                  : `Please wait ${daysUntilEligible} more days before donating whole blood to ensure donor safety and iron recovery.`}
              </p>
            </div>

            {/* Basic Requirements Checklist */}
            <div className="space-y-2 pt-1 border-t border-border/70">
              <div className="text-xs font-semibold text-foreground">Standard Criteria:</div>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  <span>Age 18–60 years & Minimum weight 45kg (50kg for males)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  <span>Hemoglobin ≥ 12.5 g/dL with normal blood pressure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
