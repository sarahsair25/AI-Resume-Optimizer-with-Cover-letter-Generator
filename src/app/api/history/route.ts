/**
 * GET /api/history
 * 
 * Returns the current user's analysis history and saved cover letters.
 * Requires authentication.
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Try database, fallback
    try {
      const { getUserAnalyses, getUserCoverLetters } = await import("@/lib/queries");
      const [analyses, coverLetters] = await Promise.all([
        getUserAnalyses(session.userId),
        getUserCoverLetters(session.userId),
      ]);

      return NextResponse.json({
        analyses: analyses.map((a: any) => ({
          id: a.id,
          score: a.score,
          summary: a.summary,
          matchedKeywords: JSON.parse(a.matchedKeywords ?? "[]"),
          missingKeywords: JSON.parse(a.missingKeywords ?? "[]"),
          createdAt: a.createdAt,
        })),
        coverLetters: coverLetters.map((c: any) => ({
          id: c.id,
          createdAt: c.createdAt,
          preview: c.content?.slice(0, 150) ?? "",
        })),
      });
    } catch {
      return NextResponse.json({ analyses: [], coverLetters: [] });
    }
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}