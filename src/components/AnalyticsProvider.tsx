"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Analytics component using PostHog.
 * Only loads when NEXT_PUBLIC_POSTHOG_KEY is set.
 * Tracks page views and user sign-ins.
 */
export default function AnalyticsProvider() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

    if (!posthogKey) return;

    // Load PostHog script
    const script = document.createElement("script");
    script.src = `${posthogHost}/static/array.js`;
    script.async = true;
    script.setAttribute("data-posthog-api-host", posthogHost);
    script.setAttribute("data-posthog-key", posthogKey);
    document.head.appendChild(script);

    // Initialize PostHog
    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).posthog) {
        const posthog = (window as any).posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: true,
          capture_pageleave: true,
          loaded: (ph: any) => {
            // Identify user if signed in
            if (isSignedIn && user) {
              ph.identify(user.id, {
                email: user.primaryEmailAddress?.emailAddress,
                name: user.fullName,
              });
            }
          },
        });
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isSignedIn, user]);

  return null;
}