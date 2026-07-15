/**
 * Account Suspended Page
 * Shown when a banned user tries to access protected features
 * 
 * Note: This page is reached via redirect when API calls return 401 with suspension message.
 * We don't rely on client-side session data because it may be stale.
 */

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuspendedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const banReason = searchParams.get("reason");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Icon and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Account Suspended
          </h1>
          <p className="text-lg text-muted-foreground">
            Your account has been temporarily suspended
          </p>
        </div>

        {/* Suspension Details */}
        <div className="bg-paper border border-slate rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-ink mb-3">Why was I suspended?</h2>
          <div className="bg-destructive/5 border-l-4 border-destructive px-4 py-3 rounded-r">
            <p className="text-sm text-ink">
              {banReason ||
                "Your account has been suspended due to a violation of our community guidelines or terms of service."}
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="bg-paper border border-slate rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-ink mb-3">
            What does this mean?
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            While your account is suspended, you cannot:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Create new blood requests</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Respond to blood requests ("I Can Help")</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Update your profile or donor information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              <span>Perform any actions that require authentication</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            You can still browse public blood requests and donor information.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-paper border border-slate rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-ink mb-3">What can I do?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            If you believe this suspension was made in error or you would like
            to appeal, please contact our support team. Provide your account
            email and explain your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={() => router.push("/contact")}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            For more information, please review our{" "}
            <a
              href="/about"
              className="text-teal hover:underline"
            >
              community guidelines
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-teal hover:underline"
            >
              terms of service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuspendedPage() {
  return (
    <Suspense>
      <SuspendedContent />
    </Suspense>
  );
}
