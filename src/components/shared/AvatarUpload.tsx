"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

interface AvatarUploadProps {
  currentImage?: string | null;
  userName?: string | null;
  userEmail?: string;
  onAvatarUpdate: (imageUrl: string) => void;
}

export function AvatarUpload({
  currentImage,
  userName,
  userEmail,
  onAvatarUpdate,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail?.slice(0, 2).toUpperCase() || "U";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await apiFetch("/api/users/me/avatar", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Upload failed");
      }

      const data = await response.json();
      setPreview(data.image);
      onAvatarUpdate(data.image);
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload avatar");
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <span className="text-xl font-semibold">{initials}</span>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Loader2 className="h-5 w-5 animate-spin text-crimson" />
          </div>
        )}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
          {preview ? "Change Photo" : "Upload Photo"}
        </button>
        <p className="mt-1 text-xs text-muted-foreground">
          JPEG, PNG, or WebP. Max 5 MB.
        </p>
      </div>
    </div>
  );
}
