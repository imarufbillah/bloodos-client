"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <section className="relative flex min-h-dvh items-center overflow-hidden px-4 pb-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.51_0.19_25/0.06),transparent)]" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div className="flex flex-col gap-6 text-left" {...fadeUp}>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-crimson/20 bg-crimson/5 px-3 py-1 text-xs font-medium text-crimson">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
              Saving lives across Bangladesh
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Save Lives.
              <br />
              <span className="text-crimson">Connect Donors.</span>
            </h1>

            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              A verified blood donor coordination platform matching urgent
              hospital requests with eligible donors across Bangladesh.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/requests/add">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <Droplet className="h-5 w-5" />
                  Post a Request
                </Button>
              </Link>
              <Link href="/requests">
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  <Search className="h-5 w-5" />
                  Browse Requests
                </Button>
              </Link>
            </div>

            {!isLoading && stats && (
              <div className="mt-4 grid grid-cols-4 gap-3 pt-4 sm:gap-4">
                <StatCounter value={stats.activeRequests} label="Active Requests" delay={0.3} />
                <StatCounter value={stats.totalDonors} label="Donors" suffix="+" delay={0.4} />
                <StatCounter value={stats.fulfilledRequests} label="Lives Saved" suffix="+" delay={0.5} />
                <StatCounter value={stats.donationsThisMonth} label="This Month" delay={0.6} />
              </div>
            )}

            {isLoading && (
              <div className="mt-4 grid grid-cols-4 gap-3 pt-4 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-10 w-16 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <div className="relative ml-auto max-w-md overflow-visible rounded-2xl border border-border lg:max-w-lg">
              <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4"
                  alt="Healthcare professional preparing blood donation equipment"
                  fill
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
              </div>

              <div className="absolute -bottom-3 -left-3 rounded-xl border border-border bg-background p-3 shadow-lg sm:-bottom-5 sm:-left-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
                    <Heart className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">90-Day Tracking</p>
                    <p className="text-xs text-muted-foreground">Donor eligibility monitored</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
