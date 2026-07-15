"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Edit2, Save, X, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/lib/validators/profile.schema";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DISTRICTS } from "@/lib/constants/districts";
import type { UserDto } from "@/types/dto/user.dto";
import type { BloodGroup, District } from "@/types/shared";
import { apiFetch } from "@/lib/api-client";

interface ProfileEditFormProps {
  user: UserDto;
  onUpdate: (updatedUser: UserDto) => void;
}

interface FormErrors {
  [key: string]: string;
}

export function ProfileEditForm({ user, onUpdate }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Local form state
  const [formData, setFormData] = useState<UpdateProfileFormData>({
    name: user.name,
    phone: user.phone,
    district: user.district,
    bloodGroup: user.bloodGroup,
    isDonor: user.isDonor,
  });

  const handleCancel = () => {
    // Reset form data to original values
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
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate with Zod
      const validated = updateProfileSchema.parse(formData);

      // Filter out empty strings and undefined values
      // Only send fields that have actual values
      const payload: Record<string, any> = {};
      if (validated.name) payload.name = validated.name;
      if (validated.phone) payload.phone = validated.phone;
      if (validated.district) payload.district = validated.district;
      if (validated.bloodGroup) payload.bloodGroup = validated.bloodGroup;
      if (validated.isDonor !== undefined) payload.isDonor = validated.isDonor;

      // Submit to API (Req 13.5)
      const response = await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();

      // Success
      toast.success("Profile updated successfully");
      onUpdate(updatedUser);
      setIsEditing(false);
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
          err instanceof Error ? err.message : "Failed to update profile"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    // View mode - display current values with edit button
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">
              Your account details and contact information
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="mr-1.5" />
            Edit Profile
          </Button>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="text-base">{user.name}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd className="text-base">{user.email}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
            <dd className="font-mono text-base">{user.phone}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Blood Group
            </dt>
            <dd className="font-mono text-base">{user.bloodGroup}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              District
            </dt>
            <dd className="text-base">{user.district}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">Role</dt>
            <dd className="text-base capitalize">{user.role}</dd>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">
              Donor Status
            </dt>
            <dd className="flex items-center gap-2 text-base">
              {user.isDonor ? (
                <>
                  <Check className="size-4 text-teal" />
                  <span>Available as a blood donor</span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  Not registered as a donor
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  // Edit mode - show form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div>
          <h2 className="text-lg font-semibold">Edit Personal Information</h2>
          <p className="text-sm text-muted-foreground">
            Update your account details
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="01XXXXXXXXX"
            pattern="01[0-9]{9}"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-sm text-destructive" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Blood Group */}
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) =>
              setFormData({
                ...formData,
                bloodGroup: e.target.value as BloodGroup,
              })
            }
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

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Select
            id="district"
            name="district"
            value={formData.district}
            onChange={(e) =>
              setFormData({
                ...formData,
                district: e.target.value as District,
              })
            }
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

        {/* Role (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            type="text"
            value={user.role}
            disabled
            className="bg-muted capitalize"
          />
          <p className="text-xs text-muted-foreground">
            Role can only be changed by administrators
          </p>
        </div>

        {/* Donor Status */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="isDonor" className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDonor"
              name="isDonor"
              checked={formData.isDonor}
              onChange={(e) =>
                setFormData({ ...formData, isDonor: e.target.checked })
              }
              className="size-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <span>I am available as a blood donor</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Check this if you want to be listed in the donor directory and
            receive notifications for matching blood requests
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <X className="mr-1.5" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-1.5" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
