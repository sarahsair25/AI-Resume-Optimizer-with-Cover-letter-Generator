/**
 * POST /api/rewrite
 * 
 * Uses AI to rewrite resume bullet points for better impact.
 */

import { NextRequest, NextResponse } from "next/server";
import { rewriteBulletPoints } from "@/services/llm-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bulletPoints, jobDescription, resumeContext } = body;

    if (!bulletPoints || !Array.isArray(bulletPoints) || bulletPoints.length === 0) {
      return NextResponse.json(
        { error: "bulletPoints array is required" },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "jobDescription is required" },
        { status: 400 }
      );
    }

    const rewrites = await rewriteBulletPoints(
      bulletPoints,
      jobDescription,
      resumeContext ?? ""
    );

    return NextResponse.json({ rewrites });
  } catch (error) {
    console.error("Rewrite error:", error);
    const message = error instanceof Error ? error.message : "Failed to rewrite bullet points";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
