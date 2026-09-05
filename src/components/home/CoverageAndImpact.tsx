"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { DISTRICTS_BY_DIVISION } from "@/lib/constants/districts";
import { Button } from "@/components/ui/button";

const divisionHighlights = [
  { name: "Dhaka", count: "13 Districts", hospitals: "DMCH, BSMMU, NICVD, SSMCH" },
  { name: "Chittagong", count: "11 Districts", hospitals: "CMCH, USTC, Imperial Hospital" },
  { name: "Rajshahi", count: "8 Districts", hospitals: "RMCH, Islami Bank Hospital" },
  { name: "Khulna", count: "10 Districts", hospitals: "KMCH, Gazi Medical College" },
  { name: "Sylhet", count: "4 Districts", hospitals: "MAG Osmani Medical, Jalalabad Ragib-Rabeya" },
  { name: "Barisal", count: "6 Districts", hospitals: "Sher-e-Bangla Medical College" },
  { name: "Rangpur", count: "8 Districts", hospitals: "Rangpur Medical College, Prime Medical" },
  { name: "Mymensingh", count: "4 Districts", hospitals: "Mymensingh Medical College Hospital" },
];

export function CoverageAndImpact() {
  const [selectedDivision, setSelectedDivision] = React.useState<string>("Dhaka");

  const activeDistricts = React.useMemo(() => {
    return DISTRICTS_BY_DIVISION[selectedDivision as keyof typeof DISTRICTS_BY_DIVISION] || [];
  }, [selectedDivision]);

  return (
    <section className="border-b border-border/80 bg-muted/30 py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1 text-xs font-semibold text-crimson">
              <MapPin className="h-3.5 w-3.5" />
              <span>NATIONWIDE EMERGENCY COVERAGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              64 Districts. 8 Divisions. 1 Unified Network.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              From tertiary referral medical centers to rural upazila health complexes, BloodOS connects donors wherever an emergency unfolds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/donors">
              <Button variant="outline" size="sm" className="gap-2 font-medium border-border">
                <span>Search by District</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Division Selector & District Pills Grid */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Administrative Division:
          </div>

          {/* Division Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {divisionHighlights.map((div) => {
              const isSelected = selectedDivision === div.name;
              return (
                <button
                  key={div.name}
                  type="button"
                  onClick={() => setSelectedDivision(div.name)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-crimson bg-crimson/10 text-crimson font-bold shadow-sm scale-102"
                      : "border-border/80 bg-muted/40 hover:bg-muted text-foreground text-xs font-medium"
                  }`}
                >
                  <span className="text-sm font-semibold">{div.name}</span>
                  <span className="text-[10px] text-muted-foreground">{div.count}</span>
                </button>
              );
            })}
          </div>

          {/* District Badges of Selected Division */}
          <div className="rounded-xl border border-border/70 bg-muted/20 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Districts in {selectedDivision} Division ({activeDistricts.length})</span>
              <span className="text-muted-foreground font-normal text-[11px]">Click a district to find active donors</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {activeDistricts.map((district) => (
                <Link
                  key={district}
                  href={`/donors?district=${encodeURIComponent(district)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:border-crimson hover:text-crimson hover:bg-crimson/5 transition-all shadow-xs"
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>{district}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
