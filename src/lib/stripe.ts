/**
 * Stripe integration for ResuMatch AI
 *
 * When STRIPE_SECRET_KEY is set, this uses the real Stripe SDK.
 * Otherwise it runs in stub mode so the app works without Stripe configured.
 */

// Product configuration
export const PRICING = {
  FREEMIUM: {
    name: "Freemium",
    price: 0,
    credits: 1,
    description: "One free analysis to get started",
  },
  PREMIUM: {
    name: "Subscription",
    price: 19,
    interval: "month" as const,
    credits: -1, // unlimited
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || "price_premium",
    description: "Unlimited analyses every month",
  },
  CREDIT: {
    name: "Pay-per-Credit",
    price: 5,
    credits: 1,
    stripePriceId: process.env.STRIPE_CREDIT_PRICE_ID || "price_credit",
    description: "One full optimization",
  },
} as const;

export type PlanType = "free" | "premium" | "credit";

// Get the base URL for redirects
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// Check if Stripe is configured
function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

/**
 * Get the Stripe client instance (lazy initialized).
 * Returns null if STRIPE_SECRET_KEY is not set (stub mode).
 */
async function getStripe() {
  if (!isStripeConfigured()) return null;
  const { default: Stripe } = await import("stripe");
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  });
}

/**
 * Create a Stripe Checkout Session for a subscription or credit purchase.
 * In stub mode, returns a mock session URL.
 */
export async function createCheckoutSession(params: {
  userId: string;
  userEmail: string;
  plan: "premium" | "credit";
  mode: "subscription" | "payment";
}): Promise<{ url: string | null; sessionId: string | null; error?: string }> {
  const { userId, userEmail, plan, mode } = params;
  const stripe = await getStripe();

  if (!stripe) {
    // Stub mode: simulate a successful checkout redirect
    const baseUrl = getBaseUrl();
    const mockSessionId = `cs_test_stub_${userId}_${plan}_${Date.now()}`;
    return {
      url: `${baseUrl}/api/checkout/stub-complete?session_id=${mockSessionId}`,
      sessionId: mockSessionId,
    };
  }

  try {
    const priceId =
      plan === "premium"
        ? PRICING.PREMIUM.stripePriceId
        : PRICING.CREDIT.stripePriceId;

    const session = await stripe.checkout.sessions.create({
      mode,
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, plan },
      success_url: `${getBaseUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/checkout/cancel`,
    });

    return { url: session.url, sessionId: session.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return { url: null, sessionId: null, error: message };
  }
}

/**
 * Retrieve a Checkout Session to verify payment success.
 * In stub mode, returns a mock successful session for known test IDs.
 */
export async function retrieveCheckoutSession(sessionId: string) {
  // Stub mode: handle test session IDs
  if (sessionId.startsWith("cs_test_stub_")) {
    const parts = sessionId.split("_");
    return {
      id: sessionId,
      payment_status: "paid" as const,
      metadata: { userId: parts[3], plan: parts[4] },
      customer_email: "user@example.com",
      amount_total: parts[4] === "premium" ? 1900 : 500,
      mode: parts[4] === "premium" ? ("subscription" as const) : ("payment" as const),
      subscription: parts[4] === "premium" ? "sub_stub_123" : null,
    };
  }

  const stripe = await getStripe();
  if (!stripe) {
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    return {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata || {},
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      mode: session.mode,
      subscription: session.subscription,
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

/**
 * Cancel a subscription.
 * In stub mode, just returns success.
 */
export async function cancelSubscription(subscriptionId: string) {
  const stripe = await getStripe();
  if (!stripe) {
    return { status: "canceled" };
  }

  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return { status: subscription.status };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { status: "error" };
  }
}

/**
 * Construct a Stripe webhook event from the raw request body.
 * In stub mode, returns null and logs a warning.
 */
export async function constructWebhookEvent(
  body: string,
  signature: string,
  webhookSecret: string
) {
  if (!isStripeConfigured()) {
    console.warn(
      "[Stripe Stub] Webhook received but Stripe not configured. " +
        "Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to process live events."
    );
    return null;
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  });

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}
