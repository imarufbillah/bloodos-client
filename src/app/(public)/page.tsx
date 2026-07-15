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

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

const steps = {
  requesters: [
    {
      title: "Post Your Request",
      desc: "Provide patient details, blood group, hospital, and urgency. Requests go live immediately.",
    },
    {
      title: "Get Notified",
      desc: "Eligible donors in your district are automatically notified. Track responses in real-time.",
    },
    {
      title: "Coordinate Donation",
      desc: "Accept donor responses, reveal contact details, and coordinate directly.",
    },
  ],
  donors: [
    {
      title: "Register as Donor",
      desc: "Create an account with your blood group and location. Eligibility is automatically tracked.",
    },
    {
      title: "Browse Requests",
      desc: "View requests near you filtered by compatibility. Get instant notifications for matches.",
    },
    {
      title: "Offer to Help",
      desc: "Click &quot;I Can Help&quot; on compatible requests. The requester can accept and reveal contact details.",
    },
  ],
};

export default function HomePage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/stats`
    )
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(() => {
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
      <section className="relative flex min-h-[60vh] items-center justify-center px-4 py-16 sm:min-h-[65vh] sm:py-20 lg:min-h-[70vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.51_0.19_25/0.06),transparent)]" />

        <div className="relative container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-8 text-center">
            <motion.div
              className="flex flex-col gap-4"
              {...fadeUp}
            >
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Save Lives.{" "}
                <span className="text-crimson">Connect Donors.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
                A verified blood donor coordination platform matching urgent
                hospital requests with eligible donors across Bangladesh.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-3 sm:flex-row"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
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

            {!isLoading && stats && (
              <motion.div
                className="mt-12 grid w-full grid-cols-2 gap-6 sm:mt-16 md:grid-cols-4 md:gap-10"
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.3 }}
              >
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
                  label="This Month"
                  delay={0.6}
                />
              </motion.div>
            )}

            {isLoading && (
              <div className="mt-12 grid w-full grid-cols-2 gap-6 sm:mt-16 md:grid-cols-4 md:gap-10">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-2"
                  >
                    <div className="h-12 w-20 animate-pulse rounded-md bg-muted" />
                    <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              BloodOS replaces ad-hoc social media coordination with a verified
              platform that tracks eligibility, urgency, and response status.
            </p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-14">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/10">
                  <Droplet className="h-5 w-5 text-crimson" />
                </div>
                <h3 className="font-heading text-xl font-semibold sm:text-2xl">
                  Need Blood?
                </h3>
              </div>

              <ol className="space-y-3.5">
                {steps.requesters.map((step, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crimson font-mono text-xs font-semibold text-paper">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link href="/requests/add">
                <Button className="w-full gap-2 sm:w-auto">
                  Post a Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
                  <Heart className="h-5 w-5 text-teal" />
                </div>
                <h3 className="font-heading text-xl font-semibold sm:text-2xl">
                  Want to Donate?
                </h3>
              </div>

              <ol className="space-y-3.5">
                {steps.donors.map((step, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-xs font-semibold text-paper">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link href="/donors">
                <Button variant="secondary" className="w-full gap-2 sm:w-auto">
                  Find Donors
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col items-center justify-center gap-7 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-crimson">
              <Users className="h-7 w-7 text-paper" />
            </div>
            <div className="max-w-2xl space-y-3">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Join Our Life-Saving Network
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Every 2 seconds, someone in Bangladesh needs blood. Register
                today and help save lives in your community.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link href="/requests" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2">
                  <Search className="h-5 w-5" />
                  Browse Active Requests
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2"
                >
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
