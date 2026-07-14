/**
 * Banned User Banner
 * Shows a prominent warning message when user is banned
 */

"use client";

import { useSession } from "@/lib/auth-client";
import { AlertCircle } from "lucide-react";

export function BannedUserBanner() {
  const { data: session } = useSession();

  // Check if user is banned
  const isBanned = session?.user?.banned;
  const banReason = session?.user?.banReason;

  if (!isBanned) {
    return null;
  }

  return (
    <div className="bg-destructive/10 border-l-4 border-destructive px-4 py-3 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-1">
            Account Suspended
          </h3>
          <p className="text-sm text-destructive/90">
            {banReason ||
              "Your account has been suspended. You cannot post requests or respond to blood requests."}
          </p>
          <p className="text-xs text-destructive/80 mt-2">
            If you believe this is a mistake, please contact support via the{" "}
            <a href="/contact" className="underline hover:no-underline">
              contact form
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
