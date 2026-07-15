"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Lock,
  Share2,
  UserCheck,
  Database,
  AlertTriangle,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Privacy Policy Page Component
 * Comprehensive privacy policy with required sections
 */
export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* ===================================================================
          Hero Section
       =================================================================== */}
      <section className="relative border-b border-border bg-linear-to-b from-background to-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 text-center">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full bg-teal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Privacy Policy
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                How we collect, use, and protect your personal information
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Last updated: January 2026
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Introduction
       =================================================================== */}
      <section className="border-b border-border px-4 py-12 sm:py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              BloodOS is committed to protecting your privacy. This policy
              explains what personal information we collect, how we use it, who
              we share it with, and your rights regarding your data.
            </p>
            <p>
              By using BloodOS, you agree to the collection and use of
              information in accordance with this policy. We will not use or
              share your information except as described here.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Data Collection Section
       =================================================================== */}
      <section className="border-b border-border bg-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
              <Database className="h-6 w-6 text-teal" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Data Collection
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Account Information
              </h3>
              <p className="text-base text-muted-foreground mb-4">
                When you register for BloodOS, we collect:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">Full name:</strong> To
                    identify you in the system and display to other users
                  </span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">Email address:</strong>{" "}
                    For account verification, notifications, and password reset
                  </span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">Phone number:</strong>{" "}
                    For contact coordination between requesters and donors
                    (masked by default)
                  </span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">Blood group:</strong> To
                    match donors with compatible requests
                  </span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">District:</strong> To
                    match nearby donors and requesters
                  </span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">
                      Last donation date:
                    </strong>{" "}
                    To enforce 90-day cooldown eligibility
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Blood Request Information
              </h3>
              <p className="text-base text-muted-foreground mb-4">
                When you post a blood request, we collect:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Patient name, blood group, and units needed</span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Hospital name, address, and district</span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Contact phone number and urgency level</span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Optional additional notes about the request</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Usage Data
              </h3>
              <p className="text-base text-muted-foreground mb-4">
                We automatically collect certain information when you use
                BloodOS:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>IP address and browser type</span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Pages visited and actions taken</span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  <span>Timestamps of requests and responses</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                What We Don&apos;t Collect
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-3 text-base text-muted-foreground">
                  <XCircle className="mt-1 h-5 w-5 shrink-0 text-destructive" />
                  <span>
                    <strong className="text-foreground">
                      Medical records:
                    </strong>{" "}
                    We don&apos;t collect or store detailed medical information
                  </span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <XCircle className="mt-1 h-5 w-5 shrink-0 text-destructive" />
                  <span>
                    <strong className="text-foreground">
                      Financial information:
                    </strong>{" "}
                    BloodOS is completely free; we collect no payment data
                  </span>
                </li>
                <li className="flex gap-3 text-base text-muted-foreground">
                  <XCircle className="mt-1 h-5 w-5 shrink-0 text-destructive" />
                  <span>
                    <strong className="text-foreground">
                      Third-party tracking:
                    </strong>{" "}
                    We don&apos;t use advertising trackers or sell your data
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Data Usage Section
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ochre/10">
              <Eye className="h-6 w-6 text-ochre" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Data Usage
            </h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>We use your personal information for the following purposes:</p>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">
                  1. Platform Operations
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Creating and managing your account</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Authenticating your identity when you log in</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Processing and displaying blood requests</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Managing donor responses and request status</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">
                  2. Donor-Requester Matching
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Matching blood requests with compatible donors based on
                      blood group and district
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Verifying donor eligibility (age, weight, cooldown period)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Sending notifications to eligible donors about new
                      requests
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Facilitating contact coordination between requesters and
                      donors
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">
                  3. Communication
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Sending notifications about request status changes
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Notifying you when someone responds to your request
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Alerting you about matching blood requests nearby
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Sending account-related emails (password resets,
                      verification)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">
                  4. Safety & Security
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Detecting and preventing fraud, spam, and abuse</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Logging contact information reveals for transparency
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Tracking admin actions for accountability</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Enforcing our Terms of Service</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">
                  5. Platform Improvement
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>
                      Analyzing aggregated usage data to improve the platform
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Understanding which features are most useful</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">•</span>
                    <span>Identifying and fixing technical issues</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Data Sharing Section
       =================================================================== */}
      <section className="border-b border-border bg-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Share2 className="h-6 w-6 text-crimson" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Data Sharing
            </h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p className="text-lg font-semibold text-foreground">
              We share your information only in limited circumstances:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  With Other Users (Controlled Sharing)
                </h3>
                <div className="rounded-lg border border-border bg-card p-5 space-y-3 text-sm">
                  <p>
                    <strong className="text-foreground">
                      Public Information:
                    </strong>{" "}
                    Your name, blood group, and district are visible to all
                    users when you&apos;re listed as a donor. Your phone number
                    is masked by default (showing only partial digits).
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Controlled Reveal:
                    </strong>{" "}
                    Your full contact information (phone and email) is only
                    revealed to requesters who explicitly accept your donor
                    offer. All such reveals are logged in our audit system.
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Request Details:
                    </strong>{" "}
                    When you post a blood request, the information you provide
                    (patient name, hospital, contact phone) becomes publicly
                    visible to help donors coordinate.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  With Service Providers
                </h3>
                <div className="rounded-lg border border-border bg-card p-5 text-sm">
                  <p>
                    We use trusted third-party services to operate BloodOS.
                    These providers only access your data as needed to perform
                    their specific functions:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-teal">•</span>
                      <span>
                        <strong className="text-foreground">
                          Hosting provider:
                        </strong>{" "}
                        Stores our database and serves the application
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal">•</span>
                      <span>
                        <strong className="text-foreground">
                          Email service:
                        </strong>{" "}
                        Sends account verification and notification emails
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal">•</span>
                      <span>
                        <strong className="text-foreground">
                          Authentication provider:
                        </strong>{" "}
                        Manages secure login and password resets
                      </span>
                    </li>
                  </ul>
                  <p className="mt-3">
                    All service providers are bound by data protection
                    agreements and are prohibited from using your information
                    for their own purposes.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  For Legal Compliance
                </h3>
                <div className="rounded-lg border border-border bg-card p-5 text-sm">
                  <p>
                    We may disclose your information if required by law or in
                    response to:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-teal">•</span>
                      <span>Valid legal requests from authorities</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal">•</span>
                      <span>Court orders or subpoenas</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal">•</span>
                      <span>
                        Investigations of suspected illegal activity or abuse
                      </span>
                    </li>
                  </ul>
                  <p className="mt-3">
                    We will only disclose the minimum information necessary to
                    comply with such requests.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border-2 border-crimson/20 bg-crimson/5 p-5">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-crimson" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-foreground">
                      What We Never Do:
                    </p>
                    <ul className="space-y-1">
                      <li className="flex gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                        <span>
                          <strong>Sell your data:</strong> We will never sell,
                          rent, or trade your personal information to third
                          parties
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                        <span>
                          <strong>Use for advertising:</strong> We don&apos;t
                          show ads or share your data with advertisers
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                        <span>
                          <strong>Share with data brokers:</strong> We
                          don&apos;t work with data brokers or analytics
                          companies that profile users
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          User Rights Section
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
              <UserCheck className="h-6 w-6 text-teal" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your Rights
            </h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              You have control over your personal information. BloodOS respects
              the following rights:
            </p>

            <div className="space-y-5">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal" />
                  Right to Access
                </h3>
                <p className="text-sm">
                  You can access and review all your personal information at any
                  time by logging into your account. Visit your profile page to
                  see what data we have about you.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal" />
                  Right to Update
                </h3>
                <p className="text-sm">
                  You can update your personal information at any time through
                  your profile settings. This includes your name, phone number,
                  blood group, district, and last donation date.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal" />
                  Right to Delete
                </h3>
                <p className="text-sm mb-2">
                  You can request deletion of your account and associated
                  personal data at any time. Contact us via the{" "}
                  <Link href="/contact" className="text-teal hover:underline">
                    contact page
                  </Link>{" "}
                  or email us directly.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> We may retain certain information
                  if required for legal compliance, fraud prevention, or to
                  fulfill active blood requests. Anonymized aggregated data may
                  also be retained for statistical purposes.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal" />
                  Right to Export
                </h3>
                <p className="text-sm">
                  You can request a copy of all your personal data in a
                  machine-readable format (JSON). This includes your profile
                  information, blood requests, responses, and donation history.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal" />
                  Right to Opt-Out
                </h3>
                <p className="text-sm">
                  You can opt out of certain types of notifications through your
                  account settings. However, we may still send critical
                  account-related emails (password resets, security alerts).
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal" />
                  Right to Restrict
                </h3>
                <p className="text-sm">
                  You can temporarily deactivate your donor profile to stop
                  receiving notifications about new requests without deleting
                  your account. Toggle the &quot;Active Donor&quot; setting in
                  your profile.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-teal/30 bg-teal/5 p-5">
              <h3 className="font-semibold text-foreground mb-2">
                Exercising Your Rights
              </h3>
              <p className="text-sm">
                To exercise any of these rights, contact us through:
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">Email:</strong>{" "}
                    privacy@bloodos.app
                  </span>
                </li>
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span>
                    <strong className="text-foreground">Contact Form:</strong>{" "}
                    <Link href="/contact" className="text-teal hover:underline">
                      bloodos.app/contact
                    </Link>
                  </span>
                </li>
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                We will respond to all requests within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Data Security Section
       =================================================================== */}
      <section className="border-b border-border bg-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Lock className="h-6 w-6 text-crimson" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Data Security
            </h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              We take reasonable measures to protect your personal information
              from unauthorized access, disclosure, alteration, or destruction.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <strong className="text-foreground">
                    Encrypted Connections:
                  </strong>{" "}
                  All data transmitted between your browser and our servers is
                  encrypted using TLS/SSL.
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <strong className="text-foreground">
                    Secure Authentication:
                  </strong>{" "}
                  Passwords are hashed and never stored in plain text. We use
                  industry-standard authentication protocols.
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <strong className="text-foreground">Access Controls:</strong>{" "}
                  Only authorized team members have access to user data, and all
                  access is logged.
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <strong className="text-foreground">Regular Backups:</strong>{" "}
                  Data is backed up regularly to prevent loss.
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-ochre/30 bg-ochre/5 p-5 text-sm">
              <p className="font-semibold text-foreground mb-2">
                Important Note:
              </p>
              <p>
                While we implement strong security measures, no system is
                completely secure. We cannot guarantee absolute security of your
                data. Please use strong, unique passwords and enable two-factor
                authentication when available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Contact Section
       =================================================================== */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
              <Mail className="h-6 w-6 text-teal" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Contact Us
            </h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              If you have questions about this privacy policy or how we handle
              your personal information, please contact us:
            </p>

            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div>
                <p className="font-semibold text-foreground mb-2">
                  Privacy Inquiries:
                </p>
                <p className="text-sm">
                  Email:{" "}
                  <a
                    href="mailto:privacy@bloodos.app"
                    className="text-teal hover:underline"
                  >
                    privacy@bloodos.app
                  </a>
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">
                  General Support:
                </p>
                <p className="text-sm">
                  Visit our{" "}
                  <Link href="/contact" className="text-teal hover:underline">
                    contact page
                  </Link>{" "}
                  to submit a message through our secure form.
                </p>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">
                  Mailing Address:
                </p>
                <p className="text-sm">
                  BloodOS Team
                  <br />
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              We aim to respond to all privacy-related inquiries within 30 days.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Policy Changes Section
       =================================================================== */}
      <section className="border-b border-border bg-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
            Changes to This Policy
          </h2>

          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              We may update this privacy policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <strong className="text-foreground">
                    Notice of Changes:
                  </strong>{" "}
                  We will notify you of significant changes by email or through
                  a prominent notice on the platform.
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <strong className="text-foreground">Effective Date:</strong>{" "}
                  The &quot;Last updated&quot; date at the top of this page
                  indicates when the policy was last revised.
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <strong className="text-foreground">Continued Use:</strong>{" "}
                  Your continued use of BloodOS after policy changes indicates
                  your acceptance of the updated terms.
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              We encourage you to review this policy periodically to stay
              informed about how we protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Call-to-Action Section
       =================================================================== */}
      <section className="px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8 text-center sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal">
              <Shield className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Your Privacy Matters
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                We&apos;re committed to protecting your personal information and
                being transparent about our practices.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="gap-2">
                  Learn More About BloodOS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
