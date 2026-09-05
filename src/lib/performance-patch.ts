"use client";

/**
 * Next.js Turbopack Performance.measure Safety Guard
 * 
 * In Next.js 15/16 with Turbopack in development mode, early Server Component
 * redirects or hot-reloading can invoke `performance.measure()` before a start mark
 * is recorded or with a negative delta. The W3C specification throws a TypeError:
 * "Failed to execute 'measure' on 'Performance': '...' cannot have a negative time stamp."
 * 
 * This guard intercepts window.performance.measure to safely swallow invalid
 * timing calculations without breaking development runtime or client hydration.
 */
if (
  typeof window !== "undefined" &&
  typeof window.performance !== "undefined" &&
  typeof window.performance.measure === "function"
) {
  const originalMeasure = window.performance.measure.bind(window.performance);
  try {
    window.performance.measure = function (
      measureName: string,
      startOrMeasureOptions?: string | PerformanceMeasureOptions,
      endMark?: string
    ): PerformanceMeasure {
      try {
        return originalMeasure(measureName, startOrMeasureOptions as any, endMark);
      } catch {
        // Return a safe PerformanceMeasure object if the native API throws on negative duration
        return {
          name: measureName,
          entryType: "measure",
          startTime: 0,
          duration: 0,
          detail: null,
          toJSON: () => ({}),
        } as unknown as PerformanceMeasure;
      }
    };
  } catch {
    // Graceful no-op if performance.measure is read-only in strict environments
  }
}
