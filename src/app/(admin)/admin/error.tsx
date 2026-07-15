
"use client";

import { useEffect } from "react";
import { AlertTriangle, Shield } from "lucide-react";
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
    console.error("Admin Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-slate bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Shield className="h-6 w-6 text-crimson" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-ink">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate mt-1">
                Manage requests, users, and view platform statistics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">
              Failed to Load Dashboard
            </h2>
            <p className="text-muted-foreground mb-2 max-w-md">
              {error.message ||
                "An unexpected error occurred while loading the admin dashboard"}
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
    </div>
  );
}
