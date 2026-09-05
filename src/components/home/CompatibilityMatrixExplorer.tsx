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

const groupInsights: Record<BloodGroup, { hero: string; fact: string; bdShare: string }> = {
  [BloodGroup.A_POSITIVE]: {
    hero: "A+ is the second most common blood type in Bangladesh (~24%).",
    fact: "Can receive red blood cells from A+, A-, O+, and O- donors in hospitals across the country.",
    bdShare: "~24% National Share",
  },
  [BloodGroup.A_NEGATIVE]: {
    hero: "A- is a rare and precious blood group in South Asia (<2%).",
    fact: "Can donate red blood cells to A+, A-, AB+, and AB- recipients safely.",
    bdShare: "< 2% Rare Group",
  },
  [BloodGroup.B_POSITIVE]: {
    hero: "B+ is the single most prevalent blood type in Bangladesh (~32%).",
    fact: "Due to population demographics, B+ represents the highest volume of emergency hospital requests.",
    bdShare: "~32% High Demand",
  },
  [BloodGroup.B_NEGATIVE]: {
    hero: "B- is rare (<1.5%) and critically vital during trauma and surgery.",
    fact: "Can donate to B+, B-, AB+, and AB- patients in emergency wards.",
    bdShare: "< 1.5% Rare Group",
  },
  [BloodGroup.AB_POSITIVE]: {
    hero: "AB+ is the Universal Recipient for red blood cells.",
    fact: "Can safely receive blood from ANY blood group. AB+ plasma is also universally compatible.",
    bdShare: "~9% Universal Receiver",
  },
  [BloodGroup.AB_NEGATIVE]: {
    hero: "AB- is the rarest standard blood type in Bangladesh (<0.5%).",
    fact: "Can receive red cells from all negative blood groups (AB-, A-, B-, O-).",
    bdShare: "< 0.5% Extremely Rare",
  },
  [BloodGroup.O_POSITIVE]: {
    hero: "O+ is the primary whole blood pillar in emergency wards (~31%).",
    fact: "Can be transfused to any Rh-positive patient (O+, A+, B+, AB+), matching ~85% of recipients.",
    bdShare: "~31% National Pillar",
  },
  [BloodGroup.O_NEGATIVE]: {
    hero: "O- is the Universal Red Blood Cell Donor (<1.5% in BD).",
    fact: "Can save any patient regardless of blood group during catastrophic emergency triage.",
    bdShare: "< 1.5% Universal Lifesaver",
  },
};

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

  const currentInsight = groupInsights[activeGroup];
  const isUniversalDonor = activeGroup === BloodGroup.O_NEGATIVE;
  const isUniversalReceiver = activeGroup === BloodGroup.AB_POSITIVE;

  // 56-day cooldown status
  const isEligibleToDonate = lastDonatedDaysAgo >= 56;
  const daysUntilEligible = Math.max(0, 56 - lastDonatedDaysAgo);

  return (
    <section className="border-b border-border/80 bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Blood Compatibility & Eligibility Engine
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            ABO/Rh compatibility rules and the clinical 56-day cooldown between whole blood donations.
          </p>
        </div>

        {/* 2-Column Grid: Compatibility Matrix + Cooldown Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Interactive ABO/Rh Explorer (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">
                Select Blood Group
              </span>
              <span className="text-xs text-muted-foreground">
                Interactive Donor & Recipient Matrix
              </span>
            </div>

            {/* Blood Group Pill Tabs */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5" role="tablist" aria-label="Blood group compatibility selector">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = activeGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`View compatibility for ${bg} blood group`}
                    onClick={() => setActiveGroup(bg)}
                    className={`h-12 rounded-lg font-mono font-bold text-sm transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
                      isSelected
                        ? "bg-crimson text-paper shadow-md scale-105 animate-chip-pop ring-2 ring-crimson ring-offset-1"
                        : "bg-muted/70 hover:bg-muted text-foreground border border-border/80 hover:border-border"
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>

            {/* Demographic Insight Card */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2 transition-all duration-200">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-crimson/10 text-crimson font-bold">
                    {activeGroup}
                  </span>
                  <span>{currentInsight.hero}</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full border border-teal/20 shrink-0">
                  {currentInsight.bdShare}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentInsight.fact}
              </p>
            </div>

            {/* Special Designation Banner */}
            {isUniversalDonor && (
              <div className="rounded-xl border border-crimson/30 bg-crimson/10 p-3.5 flex items-center gap-3 text-xs text-crimson font-medium animate-in fade-in-0 slide-in-from-top-1 duration-200">
                <Sparkles className="h-5 w-5 shrink-0" />
                <span>
                  <strong>O- is the Universal Red Blood Cell Donor:</strong> Can be transfused to patients of ANY blood group in dire emergencies.
                </span>
              </div>
            )}
            {isUniversalReceiver && (
              <div className="rounded-xl border border-teal/30 bg-teal/10 p-3.5 flex items-center gap-3 text-xs text-teal font-medium animate-in fade-in-0 slide-in-from-top-1 duration-200">
                <Sparkles className="h-5 w-5 shrink-0" />
                <span>
                  <strong>AB+ is the Universal Recipient:</strong> Can safely receive red blood cells from ANY blood group.
                </span>
              </div>
            )}

            {/* Compatibility Breakdown Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Compatible Donors (Can receive from) */}
              <div className="rounded-xl border border-teal/25 bg-teal/[0.04] dark:bg-teal/[0.08] p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-teal flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-teal animate-pulse" />
                  <span>Can Receive Blood From:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isAllowed = compatibleDonors.includes(bg);
                    return (
                      <span
                        key={bg}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-all duration-200 ${
                          isAllowed
                            ? "bg-teal/20 text-teal border border-teal/40 scale-100 opacity-100 shadow-xs ring-1 ring-teal/20"
                            : "bg-muted text-muted-foreground/30 border border-transparent scale-95 opacity-40 line-through"
                        }`}
                      >
                        {bg}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Compatible Recipients (Can give to) */}
              <div className="rounded-xl border border-crimson/25 bg-crimson/[0.04] dark:bg-crimson/[0.08] p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-crimson flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-crimson animate-pulse" />
                  <span>Can Donate Blood To:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isAllowed = compatibleRecipients.includes(bg);
                    return (
                      <span
                        key={bg}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-all duration-200 ${
                          isAllowed
                            ? "bg-crimson/20 text-crimson border border-crimson/40 scale-100 opacity-100 shadow-xs ring-1 ring-crimson/20"
                            : "bg-muted text-muted-foreground/30 border border-transparent scale-95 opacity-40 line-through"
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
            <div className={`rounded-xl border p-4 space-y-2.5 transition-all duration-300 ${
              isEligibleToDonate
                ? "border-teal/30 bg-teal/5 text-teal shadow-xs scale-[1.01]"
                : "border-ochre/30 bg-ochre/5 text-foreground scale-100"
            }`}>
              <div className="flex items-center gap-2">
                {isEligibleToDonate ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-teal shrink-0 animate-in zoom-in-75 duration-200" />
                    <span className="font-bold text-sm text-teal">Eligible to Donate Blood</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-ochre shrink-0 animate-in zoom-in-75 duration-200" />
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
