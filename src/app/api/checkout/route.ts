/**
 * Checkout API - Creates a Stripe Checkout Session
 *
 * POST /api/checkout
 * Body: { plan: "premium" | "credit" }
 *
 * Returns: { url: string, sessionId: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan || !["premium", "credit"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'premium' or 'credit'" },
        { status: 400 }
      );
    }

    // Get the user's email from our local DB
    const database = getDb();
    let userEmail = "user@example.com";

    if (database) {
      try {
        const user = database
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, userId))
          .get();
        if (user?.email) {
          userEmail = user.email;
        }
      } catch {
        // Use default email
      }
    }

    const mode = plan === "premium" ? "subscription" : "payment";

    const result = await createCheckoutSession({
      userId,
      userEmail,
      plan,
      mode,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      url: result.url,
      sessionId: result.sessionId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
