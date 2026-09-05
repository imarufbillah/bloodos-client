"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center bg-background text-foreground px-4 sm:px-6 py-16 pb-24 sm:pb-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-destructive/10 text-destructive shadow-xs mx-auto">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Unable to Load Triage Feed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {error.message ||
              "The live emergency blood requests could not be retrieved from the clinical registry."}
          </p>
          {error.digest && (
            <p className="text-[11px] text-muted-foreground font-mono">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} size="default" className="w-full sm:w-auto text-xs gap-2 font-semibold">
            <RotateCcw className="h-3.5 w-3.5" />
            Retry Feed
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="default" className="w-full sm:w-auto text-xs gap-2">
              <Home className="h-3.5 w-3.5" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-border/70">
          <p className="text-xs text-muted-foreground">
            Urgent clinical emergency? Call the 24/7 hotline directly:{" "}
            <a href="tel:+8801700000000" className="font-mono text-destructive font-semibold hover:underline">
              +880 1700-000000
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
