"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Edit2,
  Save,
  X,
  Check,
  User,
  Phone,
  MapPin,
  Droplet,
  Heart,
  ShieldCheck,
  Lock,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/lib/validators/profile.schema";
import { BLOOD_GROUPS } from "@/types/shared";
import { DISTRICTS_BY_DIVISION, DISTRICTS } from "@/lib/constants/districts";
import type { UserDto } from "@/types/dto/user.dto";
import type { BloodGroup, District } from "@/types/shared";
import { apiFetch } from "@/lib/api-client";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface ProfileEditFormProps {
  user: UserDto;
  onUpdate: (updatedUser: UserDto) => void;
}

interface FormErrors {
  [key: string]: string;
}

export function ProfileEditForm({ user, onUpdate }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});

  const [formData, setFormData] = React.useState<UpdateProfileFormData>({
    name: user.name,
    phone: user.phone,
    district: user.district,
    bloodGroup: user.bloodGroup,
    isDonor: user.isDonor,
  });

  // Sync when user prop changes
  React.useEffect(() => {
    setFormData({
      name: user.name,
      phone: user.phone,
      district: user.district,
      bloodGroup: user.bloodGroup,
      isDonor: user.isDonor,
    });
  }, [user]);

  const handleBloodGroupSelect = (bg: string) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setFormData((prev) => ({
      ...prev,
      bloodGroup: bg as BloodGroup,
    }));
  };

  const handleDistrictChange = (value: string | null) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setFormData((prev) => ({
      ...prev,
      district: (value as District) || user.district,
    }));
  };

  const handleCancel = () => {
    triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
    setFormData({
      name: user.name,
      phone: user.phone,
      district: user.district,
      bloodGroup: user.bloodGroup,
      isDonor: user.isDonor,
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
    setIsSubmitting(true);
    setErrors({});

    try {
      const validated = updateProfileSchema.parse(formData);

      const payload: Record<string, any> = {};
      if (validated.name !== undefined) payload.name = validated.name;
      if (validated.phone !== undefined) {
        payload.phone = validated.phone ? validated.phone.replace(/[^0-9]/g, "") : "";
      }
      if (validated.district !== undefined) payload.district = validated.district;
      if (validated.bloodGroup !== undefined) payload.bloodGroup = validated.bloodGroup;
      if (validated.isDonor !== undefined) payload.isDonor = validated.isDonor;

      const response = await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      toast.success("Profile changes saved successfully");
      onUpdate(updatedUser);
      setIsEditing(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please correct the errors in the form");
      } else {
        toast.error(
          err instanceof Error ? err.message : "Failed to update profile",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const maskedPhone = React.useMemo(() => {
    if (!formData.phone || formData.phone.length < 5) return "01XXX***XXX";
    const clean = formData.phone.replace(/[^0-9]/g, "");
    if (clean.length < 11) return `${clean.slice(0, 5)}***`;
    return `${clean.slice(0, 5)}***${clean.slice(8, 11)}`;
  }, [formData.phone]);

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/70">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Account & Contact Settings
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage your credentials, district dispatch zone, and phone number.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
              setIsEditing(true);
            }}
            className="h-9 px-3 rounded-xl border-border/80 text-xs font-semibold gap-1.5 self-start sm:self-auto"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Information</span>
          </Button>
        </div>

        {/* Read-only Spec Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Full Name</span>
            </span>
            <p className="text-base font-semibold text-foreground">
              {user.name || "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-teal" />
              <span>Contact Number</span>
            </span>
            <div className="flex items-center gap-2">
              <p className="font-mono text-base font-bold text-foreground tabular-nums">
                {maskedPhone}
              </p>
              <span className="text-[10px] font-mono text-teal bg-teal/10 border border-teal/30 px-1.5 py-0.5 rounded">
                MASKED
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Droplet className="h-3.5 w-3.5 text-crimson fill-crimson" />
              <span>Blood Group</span>
            </span>
            <p className="font-mono text-lg font-bold text-crimson">
              {user.bloodGroup || "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-ochre" />
              <span>Primary District</span>
            </span>
            <p className="text-base font-semibold text-foreground">
              {user.district ? `${user.district}, Bangladesh` : "Not specified"}
            </p>
          </div>
        </div>

        {/* Account Metadata Bar */}
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
          <span>Account ID: {user._id}</span>
          <span className="tabular-nums">
            Member Since: {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    );
  }


  // Edit Mode
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/70">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Edit Profile Information
          </h2>
          <p className="text-xs text-muted-foreground">
            Update your blood group, emergency district, and masked phone number.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-9 px-3 rounded-xl border-border/80 text-xs font-semibold gap-1"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold gap-1.5 shadow-xs"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="edit-name" className="text-xs font-semibold font-mono uppercase text-foreground">
            Full Name
          </Label>
          <Input
            id="edit-name"
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-card border-border/80"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="edit-phone" className="text-xs font-semibold font-mono uppercase text-foreground">
            Phone Number (Bangladesh 11 digits)
          </Label>
          <Input
            id="edit-phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-card border-border/80 font-mono"
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone}</p>
          ) : (
            <p className="text-[11px] font-mono text-muted-foreground">
              Preview mask: <strong className="text-foreground">{maskedPhone}</strong>
            </p>
          )}
        </div>

        {/* District */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="edit-district" className="text-xs font-semibold font-mono uppercase text-foreground">
            Primary Dispatch District
          </Label>
          <Select
            value={formData.district || ""}
            onValueChange={handleDistrictChange}
          >
            <SelectTrigger id="edit-district" className="h-11 rounded-xl bg-card border-border/80">
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

        {/* Blood Group 1-Tap Grid */}
        <div className="space-y-2.5 md:col-span-2">
          <Label className="text-xs font-semibold font-mono uppercase text-foreground">
            Blood Group
          </Label>
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {BLOOD_GROUPS.map((group) => {
              const isSelected = formData.bloodGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  aria-label={`Select blood group ${group}`}
                  aria-pressed={isSelected}
                  onClick={() => handleBloodGroupSelect(group)}
                  className={`p-3 rounded-xl border font-mono font-bold transition-all text-sm sm:text-base ${
                    isSelected
                      ? "border-crimson bg-crimson text-paper shadow-xs"
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
      </div>
    </form>
  );
}
