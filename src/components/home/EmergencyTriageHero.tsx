"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Droplet, 
  Search, 
  AlertCircle, 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  Activity,
  CheckCircle2
} from "lucide-react";
import { BloodGroup, BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DISTRICTS } from "@/lib/constants/districts";
import { Button } from "@/components/ui/button";

interface EmergencyTriageHeroProps {
  stats: {
    activeRequests: number;
    totalDonors: number;
    fulfilledRequests: number;
    donationsThisMonth: number;
  } | null;
  isLoadingStats: boolean;
}

export function EmergencyTriageHero({ stats, isLoadingStats }: EmergencyTriageHeroProps) {
  const router = useRouter();
  const [selectedBloodGroup, setSelectedBloodGroup] = React.useState<BloodGroup | "">("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");
  const [districtSearch, setDistrictSearch] = React.useState<string>("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = React.useState(false);

  const filteredDistricts = React.useMemo(() => {
    if (!districtSearch.trim()) return DISTRICTS.slice(0, 15);
    return DISTRICTS.filter((d) =>
      d.toLowerCase().includes(districtSearch.toLowerCase().trim())
    );
  }, [districtSearch]);

  const handleSearchDonors = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBloodGroup) params.set("bloodGroup", selectedBloodGroup);
    if (selectedDistrict) params.set("district", selectedDistrict);
    router.push(`/donors${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSearchRequests = () => {
    const params = new URLSearchParams();
    if (selectedBloodGroup) params.set("bloodGroup", selectedBloodGroup);
    if (selectedDistrict) params.set("district", selectedDistrict);
    router.push(`/requests${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative min-h-dvh flex items-center overflow-hidden border-b border-border/80 bg-background pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
      {/* Subtle coordinate grid & background triage aura */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
        aria-hidden="true"
      />
      <div 
        className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-crimson/8 blur-[130px]" 
        aria-hidden="true"
      />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Live Network Status Indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-triage-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-crimson/25 bg-crimson/5 px-3.5 py-1 text-xs font-semibold text-crimson">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
            </span>
            <span>NATIONAL EMERGENCY BLOOD DISPATCH • BANGLADESH</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
            <span>64 DISTRICT COORDINATION ACTIVE</span>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Left Column: Direct Hook & Crisis Positioning */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-4 animate-triage-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.06]">
                Minutes save lives. <br />
                <span className="text-crimson">Direct blood triage</span> for Bangladesh.
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed">
                Connect patients in critical care with verified, cooldown-eligible volunteer donors across all 64 districts in real time. Zero broker delays, zero phone spam.
              </p>
            </div>

            {/* Instant Emergency Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 animate-triage-3">
              <Link href="/requests/add" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-crimson hover:bg-crimson/90 text-paper font-semibold shadow-md shadow-crimson/20 gap-2.5 h-12 px-7 text-base transition-all duration-150 active:scale-[0.98]"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>Post Emergency Request</span>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-80" />
                </Button>
              </Link>
              <Link href="/requests" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-border hover:bg-muted font-medium h-12 px-7 text-base gap-2 transition-all duration-150 active:scale-[0.98]"
                >
                  <Activity className="h-4 w-4 text-crimson" />
                  <span>View Live Urgent Feed</span>
                </Button>
              </Link>
            </div>

            {/* Real-time Triage Stat Metrics */}
            <div className="pt-6 border-t border-border/70 grid grid-cols-2 sm:grid-cols-4 gap-6 animate-triage-4">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-crimson tabular-nums transition-transform duration-200 hover:scale-105">
                  {isLoadingStats ? "—" : stats?.activeRequests ?? 0}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Active SOS
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tabular-nums transition-transform duration-200 hover:scale-105">
                  {isLoadingStats ? "—" : `${stats?.totalDonors ?? 0}+`}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ready Donors
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-teal tabular-nums transition-transform duration-200 hover:scale-105">
                  {isLoadingStats ? "—" : `${stats?.fulfilledRequests ?? 0}+`}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Lives Saved
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tabular-nums transition-transform duration-200 hover:scale-105">
                  64
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Districts
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Emergency Triage Console */}
          <div className="lg:col-span-5 xl:col-span-5 animate-triage-3">
            <div className="rounded-2xl border-2 border-border/80 bg-card p-6 sm:p-7 shadow-xl shadow-foreground/5 relative overflow-hidden transition-all duration-200 hover:border-border/90 before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-linear-to-r before:from-crimson before:via-crimson/80 before:to-teal">
              <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10 text-crimson ring-1 ring-crimson/20">
                    <Droplet className="h-5 w-5 fill-crimson/20" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Instant Triage Console</h2>
                    <p className="text-[11px] text-muted-foreground">Find matched donors or pending requests</p>
                  </div>
                </div>
                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground border border-border/70">
                  INSTANT QUERY
                </span>
              </div>

              <form onSubmit={handleSearchDonors} className="space-y-5">
                {/* 1. Blood Group One-Tap Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-crimson/15 text-[10px] font-bold text-crimson">1</span>
                      <span>Select Blood Group Needed</span>
                    </label>
                    {selectedBloodGroup && (
                      <button
                        type="button"
                        onClick={() => setSelectedBloodGroup("")}
                        className="text-[11px] text-muted-foreground hover:text-crimson transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_GROUPS.map((bg) => {
                      const isSelected = selectedBloodGroup === bg;
                      return (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setSelectedBloodGroup(isSelected ? "" : bg)}
                          className={`h-11 rounded-lg font-mono font-bold text-sm transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
                            isSelected
                              ? "bg-crimson text-paper shadow-md scale-[1.02] ring-2 ring-crimson ring-offset-1 animate-chip-pop"
                              : "bg-muted/70 hover:bg-muted text-foreground border border-border/80 hover:border-crimson/30 hover:text-crimson"
                          }`}
                        >
                          {bg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. District Selector with Search Filter */}
                <div className="space-y-2 relative">
                  <label htmlFor="triage-district-search" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal/15 text-[10px] font-bold text-teal">2</span>
                    <span>Select District / Location</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="triage-district-search"
                      type="text"
                      placeholder="e.g. Dhaka, Chittagong, Sylhet..."
                      value={selectedDistrict ? selectedDistrict : districtSearch}
                      onChange={(e) => {
                        setSelectedDistrict("");
                        setDistrictSearch(e.target.value);
                        setIsDistrictDropdownOpen(true);
                      }}
                      onFocus={() => setIsDistrictDropdownOpen(true)}
                      className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson"
                    />
                    {(selectedDistrict || districtSearch) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDistrict("");
                          setDistrictSearch("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Dropdown list */}
                  {isDistrictDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-20" 
                        onClick={() => setIsDistrictDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150">
                        {filteredDistricts.length === 0 ? (
                          <div className="p-3 text-center text-xs text-muted-foreground">
                            No district found
                          </div>
                        ) : (
                          filteredDistricts.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setSelectedDistrict(d);
                                setDistrictSearch("");
                                setIsDistrictDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground ${
                                selectedDistrict === d ? "bg-accent font-semibold text-crimson" : "text-foreground"
                              }`}
                            >
                              <span>{d}</span>
                              {selectedDistrict === d && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-crimson" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-paper font-semibold h-11 text-xs sm:text-sm gap-1.5"
                  >
                    <Search className="h-4 w-4" />
                    <span>Find Donors</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSearchRequests}
                    className="w-full border-border hover:bg-muted font-medium h-11 text-xs sm:text-sm gap-1.5"
                  >
                    <Activity className="h-4 w-4 text-crimson" />
                    <span>Find Requests</span>
                  </Button>
                </div>

                {/* Direct Medical Notice */}
                <div className="rounded-lg bg-muted/50 p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-teal shrink-0" />
                  <span>56-day cooldown verified. Donor contact numbers are masked for privacy.</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
