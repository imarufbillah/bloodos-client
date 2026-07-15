"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = { title, text, url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1.5" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-1.5" />
          Share
        </>
      )}
    </Button>
  );
}
