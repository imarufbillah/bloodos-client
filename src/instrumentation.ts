/**
 * Next.js Server Instrumentation
 * 
 * Runs once when the Next.js server instance starts up.
 * Ensures the performance.measure patch is applied before any routes are compiled or evaluated.
 */
export async function register() {
  const globalScope: any =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof global !== "undefined"
      ? global
      : null;

  if (
    globalScope &&
    globalScope.performance &&
    typeof globalScope.performance.measure === "function"
  ) {
    const originalMeasure = globalScope.performance.measure.bind(
      globalScope.performance
    );

    try {
      globalScope.performance.measure = function (
        measureName: string,
        startOrMeasureOptions?: string | PerformanceMeasureOptions,
        endMark?: string
      ) {
        try {
          return originalMeasure(measureName, startOrMeasureOptions as any, endMark);
        } catch {
          return {
            name: measureName,
            entryType: "measure",
            startTime: 0,
            duration: 0,
            detail: null,
            toJSON: () => ({}),
          };
        }
      };
    } catch {
      // Graceful fallback
    }
  }
}
