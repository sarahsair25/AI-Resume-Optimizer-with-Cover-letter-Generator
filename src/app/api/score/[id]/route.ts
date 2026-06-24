/**
 * GET /api/score/[id]
 * 
 * Retrieves a previously computed match score analysis.
 */

import { NextRequest, NextResponse } from "next/server";

// In-memory store for analyses (would be DB in production)
const analysisStore = new Map<string, any>();

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysis = analysisStore.get(params.id);

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

// Helper to store analyses (used by match route)
export function storeAnalysis(id: string, data: any): void {
  analysisStore.set(id, data);
}
