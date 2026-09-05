"use client";

import { useEffect } from "react";
import { AlertTriangle, Shield, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Admin Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      {/* Header Banner */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-xs">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-crimson/10 text-crimson border border-crimson/20 shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Admin Operations Console
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Manage requests, users, and inspect national blood network health
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Recovery Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4 border border-destructive/20">
            <AlertTriangle className="h-7 w-7" />
          </div>
          
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
            Failed to Load Operations Console
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-md leading-relaxed">
            {error.message ||
              "An unexpected error occurred while communicating with the administrative service."}
          </p>

          {error.digest && (
            <p className="text-[11px] text-muted-foreground mb-6 font-mono bg-muted/50 px-2.5 py-1 rounded-md border border-border">
              Trace ID: {error.digest}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
                reset();
              }}
              className="rounded-xl text-xs font-mono h-10 gap-1.5 bg-primary text-primary-foreground font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Connection</span>
            </Button>
            <Button
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                router.push("/");
              }}
              variant="outline"
              className="rounded-xl text-xs font-mono h-10 gap-1.5 border-border/80"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return Home</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
