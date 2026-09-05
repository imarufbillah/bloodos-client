"use client";

import * as React from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProfileError({ error, reset }: ErrorProps) {
  const router = useRouter();

  React.useEffect(() => {
    console.error("Profile Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 bg-background">
      <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-card p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Unable to Load Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {error.message || "An unexpected error occurred while retrieving your responder profile data."}
          </p>
        </div>

        {error.digest && (
          <p className="text-[11px] font-mono text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border">
            Digest: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            size="sm"
            className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            size="sm"
            className="rounded-xl border-border/80 text-xs font-semibold gap-1.5"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Go Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
