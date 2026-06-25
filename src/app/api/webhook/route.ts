/**
 * Stripe Webhook handler
 *
 * POST /api/webhook
 * Processes Stripe events: checkout.session.completed, customer.subscription.updated, etc.
 *
 * When STRIPE_WEBHOOK_SECRET is not set, this endpoint logs events for debugging.
 */
import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    // Stripe not configured - just acknowledge
    return NextResponse.json({ received: true, mode: "stub" });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  const event = await constructWebhookEvent(body, signature, webhookSecret);

  if (!event) {
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const { userId, plan } = session.metadata || {};
        const db = getDb();

        if (!db || !userId) break;

        const user = db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, userId))
          .get();

        if (!user) break;

        if (plan === "premium") {
          db.update(schema.users)
            .set({
              plan: "premium",
              creditsRemaining: "-1",
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              subscriptionStatus: "active",
              updatedAt: "datetime('now')",
            })
            .where(eq(schema.users.id, userId))
            .run();
        } else if (plan === "credit") {
          const currentCredits = parseInt(user.creditsRemaining || "0");
          db.update(schema.users)
            .set({
              plan: "credit",
              creditsRemaining: String(currentCredits + 1),
              updatedAt: "datetime('now')",
            })
            .where(eq(schema.users.id, userId))
            .run();
        }

        // Record payment
        const amount = session.amount_total
          ? session.amount_total / 100
          : plan === "premium"
          ? 19
          : 5;

        db.insert(schema.payments)
          .values({
            id: generateId(),
            userId,
            stripePaymentIntentId: session.payment_intent,
            stripeSessionId: session.id,
            amount,
            status: "completed",
            plan,
            creditsPurchased: plan === "credit" ? 1 : 0,
          })
          .run();

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const db = getDb();
        if (!db) break;

        const customerId = subscription.customer;
        const user = db
          .select()
          .from(schema.users)
          .where(eq(schema.users.stripeCustomerId, customerId))
          .get();

        if (user) {
          db.update(schema.users)
            .set({
              subscriptionStatus: subscription.status,
              updatedAt: "datetime('now')",
            })
            .where(eq(schema.users.id, user.id))
            .run();
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
