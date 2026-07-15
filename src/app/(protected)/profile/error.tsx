
"use client";

import { useEffect } from "react";
import { AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error to error reporting service
    console.error("Profile Page Error:", error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
            <User className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account and view your donation activity
            </p>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-6" />
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">
            Failed to Load Profile
          </h2>
          <p className="text-muted-foreground mb-2 max-w-md">
            {error.message || "An unexpected error occurred while loading your profile"}
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex gap-3">
            <Button onClick={() => reset()} variant="default">
              Try Again
            </Button>
            <Button onClick={() => router.push("/")} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
