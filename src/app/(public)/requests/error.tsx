/**
 * Error UI for Browse Requests Page
 * 
 * Automatically displayed by Next.js when an error occurs
 * during server-side data fetching or rendering.
 * 
 * Must be a Client Component.
 */

"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Browse Requests Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Blood Requests
          </h1>
        </div>
      </section>

      {/* Error Content */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-6" />
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">
            Failed to Load Requests
          </h2>
          <p className="text-muted-foreground mb-2 max-w-md">
            {error.message || "An unexpected error occurred while loading blood requests"}
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
            <Button onClick={() => (window.location.href = "/")} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
