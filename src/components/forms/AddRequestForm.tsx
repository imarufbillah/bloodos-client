"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertCircle,
  Clock,
  Droplet,
  MapPin,
  Building2,
  Phone,
  Calendar,
  FileText,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Minus,
  Plus,
  Users,
  Activity,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { UrgencyBadge } from "@/components/shared/UrgencyBadge";
import { BannedUserBanner } from "@/components/shared/BannedUserBanner";

import {
  createRequestSchema,
  type CreateRequestFormData,
} from "@/lib/validators/request.schema";
import {
  BLOOD_GROUPS,
  type BloodGroup,
  Urgency,
  type District,
} from "@/types/shared";
import { DISTRICTS_BY_DIVISION, DISTRICTS } from "@/lib/constants/districts";
import { getCompatibleDonors } from "@/lib/constants/compatibility";
import { apiFetch } from "@/lib/api-client";
import { useUserStatus } from "@/hooks/useUserStatus";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface FormErrors {
  [key: string]: string;
}

export function AddRequestForm() {
  const router = useRouter();
  const { isBanned, canPerformActions } = useUserStatus();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = React.useState(true);
  const [profileIncomplete, setProfileIncomplete] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});

  // Form State
  const [patientName, setPatientName] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState<BloodGroup | "">("");
  const [unitsNeeded, setUnitsNeeded] = React.useState<number>(1);
  const [hospitalName, setHospitalName] = React.useState("");
  const [hospitalAddress, setHospitalAddress] = React.useState("");
  const [district, setDistrict] = React.useState<District | "">("");
  const [urgency, setUrgency] = React.useState<"critical" | "urgent" | "moderate">("urgent");
  const [neededByDate, setNeededByDate] = React.useState<string>("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [additionalNotes, setAdditionalNotes] = React.useState("");

  // Check profile completion on mount
  React.useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await apiFetch("/api/users/me");
        if (!response.ok) {
          setIsCheckingProfile(false);
          return;
        }

        const user = await response.json();
        // If phone or district is already in profile, prefill as default convenience
        if (user.phone && !contactPhone) setContactPhone(user.phone);
        if (user.district && !district) setDistrict(user.district);
        if (user.bloodGroup && !bloodGroup) setBloodGroup(user.bloodGroup);

        if (!user.district || !user.bloodGroup || !user.phone) {
          setProfileIncomplete(true);
        }

        setIsCheckingProfile(false);
      } catch {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, []);

  // Quick blood group change
  const handleBloodGroupSelect = (bg: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setBloodGroup(bg as BloodGroup);
  };

  // Quick urgency selection
  const handleUrgencySelect = (level: "critical" | "urgent" | "moderate") => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setUrgency(level);
  };

  // Units stepper
  const handleIncrementUnits = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    if (unitsNeeded < 10) setUnitsNeeded(unitsNeeded + 1);
  };

  const handleDecrementUnits = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    if (unitsNeeded > 1) setUnitsNeeded(unitsNeeded - 1);
  };

  // Compatible donors for chosen blood group
  const compatibleDonors = React.useMemo(() => {
    if (!bloodGroup) return [];
    return getCompatibleDonors(bloodGroup as BloodGroup);
  }, [bloodGroup]);

  // Masked phone for preview
  const maskedPhone = React.useMemo(() => {
    if (!contactPhone || contactPhone.length < 5) return "01XXX***XXX";
    const clean = contactPhone.replace(/[^0-9]/g, "");
    if (clean.length < 11) return `${clean.slice(0, 5)}***`;
    return `${clean.slice(0, 5)}***${clean.slice(8, 11)}`;
  }, [contactPhone]);

  // Quick relative date helpers
  const setQuickDate = (hoursFromNow: number) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    const target = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, "0");
    const day = String(target.getDate()).padStart(2, "0");
    setNeededByDate(`${year}-${month}-${day}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerTactileFeedback(HAPTIC_PATTERNS.EMERGENCY_SOS);
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataObj: CreateRequestFormData = {
        patientName: patientName.trim(),
        bloodGroup: bloodGroup as any,
        unitsNeeded,
        hospitalName: hospitalName.trim(),
        hospitalAddress: hospitalAddress.trim(),
        district: district as any,
        urgency,
        neededByDate,
        contactPhone: contactPhone.replace(/[^0-9]/g, ""),
        additionalNotes: additionalNotes.trim() || undefined,
      };

      const validated = createRequestSchema.parse(formDataObj);

      const response = await apiFetch("/api/requests", {
        method: "POST",
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to post emergency request");
      }

      const created = await response.json();
      toast.success("Emergency blood request broadcast successfully!");
      router.push(`/requests/${created._id || created.id}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please complete all required fields correctly");
      } else {
        toast.error(
          err instanceof Error ? err.message : "An unexpected error occurred while posting request",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBanned) {
    return <BannedUserBanner />;
  }

  if (isCheckingProfile) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-crimson border-t-transparent animate-spin" />
        <p className="font-mono text-xs text-muted-foreground">
          Checking responder verification status...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Incomplete Banner */}
      {profileIncomplete && (
        <div className="rounded-2xl border border-ochre/40 bg-ochre/10 p-4 flex items-start gap-3.5">
          <AlertCircle className="h-5 w-5 text-ochre shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-foreground">
              Profile Incomplete
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For rapid donor matching and hospital verification, please configure your profile district and contact details.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1 font-semibold text-ochre hover:underline pt-1"
            >
              <span>Complete Onboarding Profile</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Dual Column Layout: Form + Live Dispatch Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: Interactive Dispatch Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Patient & Medical Details */}
            <div className="space-y-4">
              <div className="border-b border-border/70 pb-2">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-crimson" />
                  <span>1. Patient Requirements</span>
                </h3>
              </div>


              {/* Patient Name */}
              <div className="space-y-2">
                <Label htmlFor="patient-name" className="text-xs font-mono font-semibold uppercase text-foreground">
                  Patient Full Name *
                </Label>
                <Input
                  id="patient-name"
                  placeholder="e.g. Tanvir Ahmed"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-card border-border/80"
                />
                {errors.patientName && <p className="text-xs text-destructive">{errors.patientName}</p>}
              </div>

              {/* Blood Group 1-Tap Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono font-semibold uppercase text-foreground flex items-center gap-1.5">
                    <Droplet className="h-3.5 w-3.5 text-crimson fill-crimson" />
                    <span>Required Blood Group (ABO/Rh) *</span>
                  </Label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {bloodGroup ? `Selected: ${bloodGroup}` : "Tap to select"}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {BLOOD_GROUPS.map((group) => {
                    const isSelected = bloodGroup === group;
                    return (
                      <button
                        key={group}
                        type="button"
                        aria-label={`Select blood group ${group}`}
                        aria-pressed={isSelected}
                        onClick={() => handleBloodGroupSelect(group)}
                        className={`p-3 rounded-xl border font-mono font-bold transition-all text-sm sm:text-base ${
                          isSelected
                            ? "border-crimson bg-crimson text-paper shadow-xs ring-1 ring-crimson"
                            : "border-border/80 bg-card hover:bg-muted text-foreground"
                        }`}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
                {errors.bloodGroup && <p className="text-xs text-destructive">{errors.bloodGroup}</p>}
              </div>

              {/* Units Needed Stepper */}
              <div className="space-y-2">
                <Label className="text-xs font-mono font-semibold uppercase text-foreground">
                  Bags / Units of Whole Blood Needed *
                </Label>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-border/80 bg-card p-1">
                    <button
                      type="button"
                      aria-label="Decrease units needed"
                      onClick={handleDecrementUnits}
                      disabled={unitsNeeded <= 1 || isSubmitting}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted text-foreground disabled:opacity-40 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-mono text-lg font-bold text-foreground tabular-nums">
                      {unitsNeeded}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase units needed"
                      onClick={handleIncrementUnits}
                      disabled={unitsNeeded >= 10 || isSubmitting}
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted text-foreground disabled:opacity-40 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="text-xs text-muted-foreground font-mono">
                    {unitsNeeded === 1 ? "1 Bag (450ml)" : `${unitsNeeded} Bags (${unitsNeeded * 450}ml total)`}
                  </span>
                </div>
                {errors.unitsNeeded && <p className="text-xs text-destructive">{errors.unitsNeeded}</p>}
              </div>
            </div>

            {/* 2. Clinical Urgency Triage */}
            <div className="space-y-4">
              <div className="border-b border-border/70 pb-2">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-ochre" />
                  <span>2. Clinical Urgency</span>
                </h3>
              </div>


              <div role="radiogroup" aria-label="Clinical urgency triage level" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Critical */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={urgency === "critical"}
                  aria-label="Critical emergency: immediate transfusion under 6 hours"
                  onClick={() => handleUrgencySelect("critical")}
                  className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                    urgency === "critical"
                      ? "border-crimson bg-crimson/10 ring-1 ring-crimson/30"
                      : "border-border/80 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold uppercase text-crimson">
                      CRITICAL (STAT)
                    </span>
                    <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Immediate emergency, surgery, or massive hemorrhage (&lt;6 hrs).
                  </p>
                </button>

                {/* Urgent */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={urgency === "urgent"}
                  aria-label="Urgent: needed within 24 to 48 hours"
                  onClick={() => handleUrgencySelect("urgent")}
                  className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                    urgency === "urgent"
                      ? "border-ochre bg-ochre/10 ring-1 ring-ochre/30"
                      : "border-border/80 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold uppercase text-ochre">
                      URGENT
                    </span>
                    <Clock className="h-3 w-3 text-ochre" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Needed within 24 to 48 hours for stabilization or scheduled care.
                  </p>
                </button>

                {/* Moderate */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={urgency === "moderate"}
                  aria-label="Standard moderate urgency: scheduled procedure over 48 hours"
                  onClick={() => handleUrgencySelect("moderate")}
                  className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                    urgency === "moderate"
                      ? "border-border bg-muted ring-1 ring-border"
                      : "border-border/80 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
                      STANDARD
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Scheduled procedure or elective transfusion (&gt;48 hrs).
                  </p>
                </button>
              </div>

              {/* Needed By Date */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="needed-by-date" className="text-xs font-mono font-semibold uppercase text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Needed By Date *</span>
                  </Label>
                  
                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <button
                      type="button"
                      aria-label="Set needed by date to today"
                      onClick={() => setQuickDate(6)}
                      className="px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      aria-label="Set needed by date to tomorrow"
                      onClick={() => setQuickDate(24)}
                      className="px-2 py-0.5 rounded bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>

                <Input
                  id="needed-by-date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={neededByDate}
                  onChange={(e) => setNeededByDate(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-card border-border/80 font-mono text-xs"
                />
                {errors.neededByDate && <p className="text-xs text-destructive">{errors.neededByDate}</p>}
              </div>
            </div>

            {/* 3. Hospital Location & Contact */}
            <div className="space-y-4">
              <div className="border-b border-border/70 pb-2">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal" />
                  <span>3. Facility & Coordinator Contact</span>
                </h3>
              </div>


              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district-select" className="text-xs font-mono font-semibold uppercase text-foreground">
                  District (64 Districts in Bangladesh) *
                </Label>
                <Select
                  value={district}
                  onValueChange={(val) => {
                    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                    setDistrict((val as District) || "");
                  }}
                >
                  <SelectTrigger id="district-select" className="h-11 rounded-xl bg-card border-border/80">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {Object.entries(DISTRICTS_BY_DIVISION).map(([division, districts]) => (
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
                    ))}
                  </SelectContent>
                </Select>
                {errors.district && <p className="text-xs text-destructive">{errors.district}</p>}
              </div>

              {/* Hospital Name */}
              <div className="space-y-2">
                <Label htmlFor="hospital-name" className="text-xs font-mono font-semibold uppercase text-foreground">
                  Hospital / Medical Facility Name *
                </Label>
                <Input
                  id="hospital-name"
                  placeholder="e.g. Dhaka Medical College Hospital (DMCH)"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-card border-border/80"
                />
                {errors.hospitalName && <p className="text-xs text-destructive">{errors.hospitalName}</p>}
              </div>

              {/* Hospital Address / Ward */}
              <div className="space-y-2">
                <Label htmlFor="hospital-address" className="text-xs font-mono font-semibold uppercase text-foreground">
                  Ward, Bed & Specific Hospital Address *
                </Label>
                <Input
                  id="hospital-address"
                  placeholder="e.g. Ward 3B, Bed 12, ICU Building 2"
                  value={hospitalAddress}
                  onChange={(e) => setHospitalAddress(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-card border-border/80"
                />
                {errors.hospitalAddress && <p className="text-xs text-destructive">{errors.hospitalAddress}</p>}
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contact-phone" className="text-xs font-mono font-semibold uppercase text-foreground">
                  Emergency Coordinator Phone *
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-card border-border/80 font-mono"
                />
                {errors.contactPhone ? (
                  <p className="text-xs text-destructive">{errors.contactPhone}</p>
                ) : (
                  <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-teal" />
                    <span>Masked as {maskedPhone} until mutual volunteer acceptance.</span>
                  </p>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additional-notes" className="text-xs font-mono font-semibold uppercase text-foreground">
                  Medical Context & Special Notes (Optional)
                </Label>
                <Textarea
                  id="additional-notes"
                  placeholder="e.g. Emergency blood transfusion required for urgent C-Section surgery. Family will arrange transport if needed."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl bg-card border-border/80 min-h-[90px] text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Broadcast Submission CTA */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-crimson hover:bg-crimson/90 text-paper font-semibold text-xs uppercase tracking-wider gap-2 shadow-xs transition-transform active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>Broadcasting Emergency Request...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Broadcast Emergency Request to Donors</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Live National Dispatch Radar Preview (Sticky) */}
        <div className="lg:col-span-5 order-last lg:sticky lg:top-20 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-crimson" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  Live Dispatch Preview
                </span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] bg-teal/10 text-teal border-teal/30 px-2 py-0.5">
                REAL-TIME RADAR
              </Badge>
            </div>

            {/* Simulated Live Card */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground">
                    {patientName || "Patient Name"}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {hospitalName || "Hospital Medical Facility"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-crimson text-paper font-mono font-bold text-xs">
                    {bloodGroup || "--"}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    urgency === "critical"
                      ? "bg-crimson/10 text-crimson border border-crimson/30"
                      : urgency === "urgent"
                      ? "bg-ochre/10 text-ochre border border-ochre/30"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}>
                    {urgency}
                  </span>
                </div>
              </div>

              {/* Units & Location */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">Required:</span>
                  <span className="font-bold text-foreground">
                    {unitsNeeded} {unitsNeeded === 1 ? "Unit" : "Units"}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">Location:</span>
                  <span className="font-semibold text-foreground truncate block">
                    {district || "Bangladesh"}
                  </span>
                </div>
              </div>

              {/* Serological Compatibility Insight */}
              {bloodGroup && (
                <div className="pt-2 border-t border-border/60 space-y-1">
                  <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3 text-teal" />
                    <span>Compatible Donors:</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {compatibleDonors.map((bg) => (
                      <span
                        key={bg}
                        className="px-1.5 py-0.2 rounded bg-card border border-border text-[10px] font-mono font-bold text-teal"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Safety Protocol Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border/70 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-teal shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Eligible donors in <strong>{district || "your selected district"}</strong> will receive emergency alerts. Contact phone remains masked until a volunteer confirms.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
