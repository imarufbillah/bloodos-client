"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Droplet, Heart, Users, Search, ArrowRight } from "lucide-react";
import { StatCounter } from "@/components/home";
import { Button } from "@/components/ui/button";

interface PublicStats {
  activeRequests: number;
  totalDonors: number;
  fulfilledRequests: number;
  donationsThisMonth: number;
}

/**
 * Home Page
 * 
 * Landing page with:
 * - Hero section (60-70vh) with headline and primary CTA
 * - Animated stat counters showing platform impact
 * - How It Works section explaining the platform
 * - Call-to-action sections for requesting blood and becoming a donor
 * 
 * Design Direction:
 * - Civic infrastructure aesthetic
 * - Fraunces for headlines, Public Sans for body
 * - Crimson only on primary CTAs
 * - Generous whitespace, functional layout
 */
export default function HomePage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch public stats from the API
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch stats:", error);
        // Set fallback values so the page still renders
        setStats({
          activeRequests: 0,
          totalDonors: 0,
          fulfilledRequests: 0,
          donationsThisMonth: 0,
        });
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col">
      {/* ===================================================================
          Hero Section (60-70vh)
          Req 16.6: Hero height in viewport units
          Req 16.7: Animated stat counters via framer-motion
       =================================================================== */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-16 sm:min-h-[65vh] sm:py-20 lg:min-h-[70vh]">
        <div className="container mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center justify-center gap-8 text-center">
            {/* Hero Headline - Fraunces font, large scale */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Save Lives.{" "}
                <span className="text-crimson">Connect Donors.</span>
              </h1>
              <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg md:text-xl">
                A verified blood donor coordination platform matching urgent
                hospital blood requests with eligible nearby donors across
                Bangladesh.
              </p>
            </motion.div>

            {/* Primary CTA Buttons */}
            <motion.div
              className="flex flex-col items-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Link href="/requests" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full gap-2">
                  <Search className="h-5 w-5" />
                  Browse Requests
                </Button>
              </Link>
              <Link href="/requests/add" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2">
                  <Droplet className="h-5 w-5" />
                  Post a Request
                </Button>
              </Link>
            </motion.div>

            {/* Platform Stats - Animated Counters */}
            {!isLoading && stats && (
              <div className="mt-12 grid w-full grid-cols-2 gap-8 sm:mt-16 md:grid-cols-4 md:gap-12">
                <StatCounter
                  value={stats.activeRequests}
                  label="Active Requests"
                  delay={0.3}
                />
                <StatCounter
                  value={stats.totalDonors}
                  label="Registered Donors"
                  suffix="+"
                  delay={0.4}
                />
                <StatCounter
                  value={stats.fulfilledRequests}
                  label="Lives Saved"
                  suffix="+"
                  delay={0.5}
                />
                <StatCounter
                  value={stats.donationsThisMonth}
                  label="Donations This Month"
                  delay={0.6}
                />
              </div>
            )}

            {/* Loading state for stats */}
            {isLoading && (
              <div className="mt-12 grid w-full grid-cols-2 gap-8 sm:mt-16 md:grid-cols-4 md:gap-12">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-2"
                  >
                    <div className="h-14 w-24 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================
          How It Works Section
          Explains the 3-step process for both requesters and donors
       =================================================================== */}
      <section className="border-t border-border bg-background px-4 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-screen-xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              BloodOS replaces ad-hoc social media coordination with a verified
              platform that tracks donor eligibility, request urgency, and
              response status.
            </p>
          </motion.div>

          {/* Two-column layout for requesters and donors */}
          <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
            {/* For Requesters */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
                  <Droplet className="h-6 w-6 text-crimson" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  Need Blood?
                </h3>
              </div>

              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-sm font-semibold text-white">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Post Your Request
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Provide patient details, blood group needed, hospital
                      location, and urgency level. Requests are verified and go
                      live immediately.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-sm font-semibold text-white">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Get Notified
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Eligible donors in your district are automatically
                      notified. Track who responds and their eligibility status
                      in real-time.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-sm font-semibold text-white">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Coordinate Donation
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Accept donor responses, reveal contact information, and
                      coordinate the donation directly. Mark request as
                      fulfilled when complete.
                    </p>
                  </div>
                </li>
              </ol>

              <Link href="/requests/add" className="w-full sm:w-auto">
                <Button className="w-full gap-2">
                  Post a Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* For Donors */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
                  <Heart className="h-6 w-6 text-teal" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  Want to Donate?
                </h3>
              </div>

              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-sm font-semibold text-white">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Register as Donor
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create an account with your blood group, location, and
                      last donation date. Your eligibility is automatically
                      tracked (90-day cooldown period).
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-sm font-semibold text-white">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Browse Requests
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      View blood requests near you filtered by compatibility.
                      Get instant notifications when a matching urgent request
                      is posted in your district.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-sm font-semibold text-white">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Offer to Help
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click "I Can Help" on compatible requests. The requester
                      can accept your offer and reveal contact details to
                      coordinate the donation.
                    </p>
                  </div>
                </li>
              </ol>

              <Link href="/donors" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full gap-2">
                  Find Donors
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Call-to-Action Section
          Prominent section encouraging user action
       =================================================================== */}
      <section className="border-t border-border bg-muted/30 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-screen-xl">
          <motion.div
            className="flex flex-col items-center justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-crimson">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="max-w-3xl space-y-4">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Join Our Life-Saving Network
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Every 2 seconds, someone in Bangladesh needs blood. Be part of
                a verified network that connects those in urgent need with
                willing donors. Register today and help save lives in your
                community.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/requests" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2">
                  <Search className="h-5 w-5" />
                  Browse Active Requests
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
