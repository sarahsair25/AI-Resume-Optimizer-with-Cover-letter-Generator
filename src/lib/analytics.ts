/**
 * Utility for capturing PostHog events safely.
 */
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).posthog) {
    (window as any).posthog.capture(eventName, properties);
  }
};

/** Analytics object with .capture() method for cleaner usage */
export const analytics = { capture: captureEvent };
