import type { Metadata } from "next";
import { AddRequestForm } from "@/components/forms/AddRequestForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Blood Request | BloodOS",
  description:
    "Post a blood donation request to find matching donors in your area",
};

export default function AddRequestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/requests"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Link>
          <h1 className="text-3xl font-bold">Create Blood Request</h1>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below to post a blood donation request. Eligible
            donors in your district will be notified automatically.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <AddRequestForm />
        </div>

        {/* Help Text */}
        <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="font-semibold text-sm mb-2">Important Information</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• All fields marked with * are required</li>
            <li>
              • Your contact information will be visible to donors who respond
            </li>
            <li>
              • Eligible donors in your district will be notified automatically
            </li>
            <li>
              • You can manage and update your request after posting from the
              &quot;Manage Requests&quot; page
            </li>
            <li>
              • Please ensure all information is accurate before submitting
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
