"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface StatCounterProps {
  /**
   * The final value to count up to
   */
  value: number;
  /**
   * Label displayed below the number
   */
  label: string;
  /**
   * Optional suffix to append to the number (e.g., "+", "K")
   */
  suffix?: string;
  /**
   * Duration of the count-up animation in seconds
   * @default 2
   */
  duration?: number;
  /**
   * Delay before animation starts in seconds
   * @default 0
   */
  delay?: number;
}

/**
 * StatCounter Component
 * 
 * Displays an animated counter that counts up from 0 to the target value
 * when the component comes into view.
 * 
 * Features:
 * - Animates on scroll into view (only once)
 * - Uses spring physics for smooth, natural motion
 * - Respects prefers-reduced-motion setting
 * - Formats large numbers with commas
 * 
 * Usage:
 * ```tsx
 * <StatCounter value={1247} label="Active Requests" suffix="+" />
 * ```
 */
export function StatCounter({
  value,
  label,
  suffix = "",
  duration = 2,
  delay = 0,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Motion value for the counter
  const motionValue = useMotionValue(0);

  // Spring animation for smooth counting
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000,
  });

  // State for displayed value (formatted)
  const displayValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      // Delay the animation if specified
      const timer = setTimeout(() => {
        motionValue.set(value);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, motionValue, value, delay]);

  // Update the displayed value on every spring update
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (displayValueRef.current) {
        // Format number with commas
        const formatted = Math.floor(latest).toLocaleString("en-US");
        displayValueRef.current.textContent = formatted;
      }
    });

    return unsubscribe;
  }, [springValue]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center gap-2 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div className="flex items-baseline gap-1">
        <span
          ref={displayValueRef}
          className="font-heading text-5xl font-bold tracking-tight text-crimson sm:text-6xl"
        >
          0
        </span>
        {suffix && (
          <span className="font-heading text-4xl font-bold text-crimson/80 sm:text-5xl">
            {suffix}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-muted-foreground sm:text-base">
        {label}
      </p>
    </motion.div>
  );
}
