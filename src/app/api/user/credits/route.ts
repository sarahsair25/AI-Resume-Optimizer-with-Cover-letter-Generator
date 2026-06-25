/**
 * Credits API - Check and manage user credits
 *
 * GET /api/user/credits - Get current user's credit balance and plan info
 * POST /api/user/credits - Use a credit (decrement by 1)
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const database = getDb();
    if (!database) {
      // Default free plan when DB isn't available
      return NextResponse.json({
        plan: "free",
        creditsRemaining: 1,
        isUnlimited: false,
      });
    }

    const user = database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .get();

    if (!user) {
      return NextResponse.json({
        plan: "free",
        creditsRemaining: 1,
        isUnlimited: false,
      });
    }

    return NextResponse.json({
      plan: user.plan,
      creditsRemaining: parseInt(user.creditsRemaining || "0"),
      isUnlimited: user.plan === "premium" || user.creditsRemaining === "-1",
      subscriptionStatus: user.subscriptionStatus,
    });
  } catch (error) {
    console.error("Credits GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const database = getDb();
    if (!database) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const user = database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .get();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const creditsRemaining = parseInt(user.creditsRemaining || "0");

    // Premium users have unlimited credits
    if (user.plan === "premium" || creditsRemaining === -1) {
      return NextResponse.json({
        success: true,
        plan: user.plan,
        creditsRemaining: -1,
        isUnlimited: true,
      });
    }

    // Free/credit users: check if they have credits left
    if (creditsRemaining <= 0) {
      return NextResponse.json(
        {
          error: "No credits remaining",
          plan: user.plan,
          creditsRemaining: 0,
        },
        { status: 402 }
      );
    }

    // Decrement credits
    const newCredits = creditsRemaining - 1;
    database
      .update(schema.users)
      .set({
        creditsRemaining: String(newCredits),
        updatedAt: "datetime('now')",
      })
      .where(eq(schema.users.id, userId))
      .run();

    return NextResponse.json({
      success: true,
      plan: user.plan,
      creditsRemaining: newCredits,
      isUnlimited: false,
    });
  } catch (error) {
    console.error("Credits POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
