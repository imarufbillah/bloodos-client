"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Manage Requests Console Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      {/* Header Banner */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-xs">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Manage Blood Requests
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Operations dispatch console
              </p>
            </div>
            <Button
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                router.push("/requests/add");
              }}
              className="h-11 rounded-xl bg-crimson hover:bg-crimson/90 text-paper font-semibold text-xs uppercase tracking-wider gap-2 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
          <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7" />
          </div>
          
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
            Failed to Synchronize Requests
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-md leading-relaxed">
            {error.message ||
              "An unexpected error occurred while communicating with the blood dispatch network. Please verify your connection or retry."}
          </p>

          {error.digest && (
            <p className="text-[11px] text-muted-foreground mb-6 font-mono bg-muted/50 px-2.5 py-1 rounded-md">
              Trace ID: {error.digest}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
                reset();
              }}
              className="rounded-xl text-xs font-mono h-10 gap-1.5 bg-foreground text-background hover:bg-foreground/90"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Synchronization</span>
            </Button>
            <Button
              onClick={() => {
                triggerTactileFeedback(HAPTIC_PATTERNS.LIGHT);
                router.push("/");
              }}
              variant="outline"
              className="rounded-xl text-xs font-mono h-10 gap-1.5"
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

