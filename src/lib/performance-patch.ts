/**
 * Universal Next.js Turbopack Performance.measure Safety Guard
 * 
 * In Next.js 15/16 with Turbopack in development mode, early Server Component
 * redirects (such as unauthenticated 401 redirects), microtask scheduling,
 * and background Link prefetching can invoke `performance.measure()` before a start mark
 * is recorded or with a negative delta. The W3C specification throws a TypeError:
 * "Failed to execute 'measure' on 'Performance': '...' cannot have a negative time stamp."
 * 
 * This guard intercepts `performance.measure` universally across Node.js, Edge, and Browser
 * runtimes to safely swallow invalid timing calculations without breaking dev telemetry or hydration.
 */

// Target universal global scope (Node.js globalThis / global, Browser window / self)
const globalScope: any =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : null;

if (globalScope && globalScope.performance && typeof globalScope.performance.measure === "function") {
  const originalMeasure = globalScope.performance.measure.bind(globalScope.performance);

  try {
    globalScope.performance.measure = function (
      measureName: string,
      startOrMeasureOptions?: string | PerformanceMeasureOptions,
      endMark?: string
    ): PerformanceMeasure {
      try {
        return originalMeasure(measureName, startOrMeasureOptions as any, endMark);
      } catch {
        // Return a mock PerformanceMeasure object conforming to W3C interface
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
    // Graceful no-op if performance.measure is non-configurable in strict engine environments
  }
}

export {};
