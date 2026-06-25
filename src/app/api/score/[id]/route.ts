/**
 * GET /api/score/[id]
 * 
 * Retrieves a previously computed match score analysis from the database.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAnalysis, memoryDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try database first, fall back to in-memory
    let analysis = getAnalysis(params.id);
    if (!analysis) {
      analysis = memoryDb.getAnalysis(params.id);
    }

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Score retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve analysis" },
      { status: 500 }
    );
  }
}