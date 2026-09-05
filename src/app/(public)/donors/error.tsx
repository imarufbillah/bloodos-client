"use client";

import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-16">
      <section className="border-b border-border/70 bg-card/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Verified Blood Donors
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto p-8 rounded-2xl border border-destructive/30 bg-destructive/[0.03]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Failed to Load Donor Registry
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {error.message ||
              "An unexpected error occurred while loading donor registry records."}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mb-6 font-mono bg-muted/60 px-3 py-1 rounded-md border border-border">
              Trace ID: {error.digest}
            </p>
          )}
          <div className="flex flex-wrap gap-3 justify-center w-full">
            <Button onClick={() => reset()} variant="default" className="gap-2 flex-1">
              <RotateCcw className="h-4 w-4" />
              <span>Retry Connection</span>
            </Button>
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", className: "gap-2 flex-1" })}
            >
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

