/**
 * Stub mode checkout completion handler
 *
 * When Stripe is not configured, the stub checkout redirects here.
 * This endpoint simulates a successful payment and redirects to the success page.
 */
import { NextRequest, NextResponse } from "next/server";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/checkout/cancel", req.url));
  }

  try {
    const session = await retrieveCheckoutSession(sessionId);

    if (!session || session.payment_status !== "paid") {
      return NextResponse.redirect(new URL("/checkout/cancel", req.url));
    }

    const { userId, plan } = session.metadata;

    if (userId && plan) {
      const database = getDb();
      if (database) {
        try {
          // Update user's plan and credits
          const user = database
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, userId))
            .get();

          if (user) {
            if (plan === "premium") {
              database
                .update(schema.users)
                .set({
                  plan: "premium",
                  creditsRemaining: "-1", // unlimited
                  stripeSubscriptionId: session.subscription as string,
                  updatedAt: "datetime('now')",
                })
                .where(eq(schema.users.id, userId))
                .run();
            } else if (plan === "credit") {
              const currentCredits = parseInt(user.creditsRemaining || "0");
              database
                .update(schema.users)
                .set({
                  plan: "credit",
                  creditsRemaining: String(currentCredits + 1),
                  updatedAt: "datetime('now')",
                })
                .where(eq(schema.users.id, userId))
                .run();
            }

            // Record the payment
            const { generateId } = await import("@/lib/utils");
            database
              .insert(schema.payments)
              .values({
                id: generateId(),
                userId,
                stripeSessionId: sessionId,
                amount: session.amount_total
                  ? session.amount_total / 100
                  : plan === "premium"
                  ? 19
                  : 5,
                status: "completed",
                plan,
                creditsPurchased: plan === "credit" ? 1 : 0,
              })
              .run();
          }
        } catch (dbError) {
          console.error("DB update error in stub checkout:", dbError);
        }
      }
    }

    return NextResponse.redirect(
      new URL(`/checkout/success?session_id=${sessionId}`, req.url)
    );
  } catch (error) {
    console.error("Stub complete error:", error);
    return NextResponse.redirect(new URL("/checkout/cancel", req.url));
  }
}
