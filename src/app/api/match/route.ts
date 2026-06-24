/**
 * POST /api/match
 * 
 * Performs ATS keyword matching between a resume and job description.
 * Returns match score, matched/missing keywords, and suggestions.
 */

import { NextRequest, NextResponse } from "next/server";
import { calculateMatch } from "@/services/ats-matcher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "resumeText and jobDescription are required" },
        { status: 400 }
      );
    }

    if (resumeText.length < 10) {
      return NextResponse.json(
        { error: "Resume text is too short" },
        { status: 400 }
      );
    }

    if (jobDescription.length < 10) {
      return NextResponse.json(
        { error: "Job description is too short" },
        { status: 400 }
      );
    }

    // Calculate match
    const result = calculateMatch(resumeText, jobDescription);

    return NextResponse.json({
      matchScore: result.matchScore,
      matchedKeywords: result.matchedKeywords.map((k) => ({
        term: k.term,
        category: k.category,
        weight: k.weight,
      })),
      missingKeywords: result.missingKeywords.map((k) => ({
        term: k.term,
        category: k.category,
        importance: k.importance,
      })),
      suggestions: result.suggestions,
    });
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json(
      { error: "Failed to calculate match" },
      { status: 500 }
    );
  }
}
