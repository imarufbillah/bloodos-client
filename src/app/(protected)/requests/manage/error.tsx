
"use client";

import { useEffect } from "react";
import { AlertTriangle, Plus } from "lucide-react";
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
    console.error("Manage Requests Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Requests</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                View and manage your blood donation requests
              </p>
            </div>
            <Button onClick={() => router.push("/requests/add")}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">
            Failed to Load Your Requests
          </h2>
          <p className="text-muted-foreground mb-2 max-w-md">
            {error.message || "An unexpected error occurred while loading your blood requests"}
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
