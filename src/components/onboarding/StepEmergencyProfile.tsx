"use client";

import * as React from "react";
import {
  BLOOD_GROUPS,
  type BloodGroup,
} from "@/types/shared";
import {
  DISTRICTS_BY_DIVISION,
  DISTRICTS,
} from "@/lib/constants/districts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Droplet, MapPin, ArrowRight, Check } from "lucide-react";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface StepEmergencyProfileProps {
  bloodGroup: string;
  district: string;
  onBloodGroupChange: (bg: string) => void;
  onDistrictChange: (d: string) => void;
  onNext: () => void;
}

export function StepEmergencyProfile({
  bloodGroup,
  district,
  onBloodGroupChange,
  onDistrictChange,
  onNext,
}: StepEmergencyProfileProps) {
  const [districtSearch, setDistrictSearch] = React.useState("");

  const handleSelectBloodGroup = (bg: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    onBloodGroupChange(bg);
  };

  const handleDistrictSelect = (value: string | null) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    onDistrictChange(value || "");
  };

  const isComplete = Boolean(bloodGroup && district);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Select Your Blood Group & District
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Crucial for precision dispatch when emergency hospital transfusion requests arrive.
        </p>
      </div>

      {/* 1. Blood Group 1-Tap Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
            <Droplet className="h-3.5 w-3.5 text-crimson fill-crimson" />
            <span>Blood Group (ABO/Rh)</span>
          </Label>
          <span className="text-[11px] text-muted-foreground font-mono">
            {bloodGroup ? `Selected: ${bloodGroup}` : "Required for triage"}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = bloodGroup === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => handleSelectBloodGroup(group)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border font-mono font-bold transition-all touch-manipulation active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSelected
                    ? "border-crimson bg-crimson text-paper shadow-sm ring-1 ring-crimson"
                    : "border-border/80 bg-card hover:bg-accent text-foreground hover:border-foreground/30"
                }`}
              >
                <span className="text-lg sm:text-xl tracking-tight leading-none">
                  {group}
                </span>
                <span
                  className={`text-[9px] font-sans font-medium uppercase mt-1 leading-none ${
                    isSelected ? "text-paper/90" : "text-muted-foreground"
                  }`}
                >
                  {group === "O-" && "Universal"}
                  {group === "AB+" && "Receiver"}
                  {group !== "O-" && group !== "AB+" && "Matched"}
                </span>

                {isSelected && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-paper text-crimson">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. District Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="onboarding-district"
            className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5 text-ochre" />
            <span>Primary District (64 Districts)</span>
          </Label>
          <span className="text-[11px] text-muted-foreground">
            Emergency dispatch zone
          </span>
        </div>

        <Select
          value={district}
          onValueChange={handleDistrictSelect}
        >
          <SelectTrigger id="onboarding-district" className="h-11 rounded-xl bg-card border-border/80">
            <SelectValue placeholder="Select your district (e.g. Dhaka, Chittagong)" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {Object.entries(DISTRICTS_BY_DIVISION).map(
              ([division, districts]) => (
                <SelectGroup key={division}>
                  <SelectLabel className="font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1">
                    {division} Division
                  </SelectLabel>
                  {districts.map((dist) => (
                    <SelectItem key={dist} value={dist} className="font-medium text-xs">
                      {dist}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Forward Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={() => {
            triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
            onNext();
          }}
          disabled={!isComplete}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider gap-2 shadow-xs transition-transform active:scale-[0.99]"
        >
          <span>Continue to Donor Readiness</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
