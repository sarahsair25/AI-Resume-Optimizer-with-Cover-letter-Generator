/**
 * POST /api/match
 * 
 * Full ATS resume analysis: match score, keyword gaps, skill detection,
 * bullet rewrites, and summary. Uses AI if available, falls back to local NLP.
 * Persists results to the database.
 * 
 * Expected response shape (owner-code.jsx compatible):
 * {
 *   analysisId: string,
 *   score, scoreBreakdown: { keywordMatch, relevance, impact, formatting },
 *   matchedKeywords: string[],
 *   missingKeywords: string[],
 *   missingSkills: { skill, reason }[],
 *   bulletRewrites: { original, improved, why }[],
 *   summary: string
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/services/llm-service";
import { fullAnalysis } from "@/services/ats-matcher";
import { saveAnalysis, memoryDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription, resumeId } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "resumeText and jobDescription are required" },
        { status: 400 }
      );
    }

    if (resumeText.length < 10 || jobDescription.length < 10) {
      return NextResponse.json(
        { error: "Both resume and job description must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Try AI-powered analysis first, fall back to local NLP
    const result = await analyzeResume({
      resumeText: resumeText.slice(0, 3000),
      jobDescription: jobDescription.slice(0, 2000),
    });

    // Save to database
    const analysisId = saveAnalysis({
      resumeId: resumeId ?? "anonymous",
      jobDescription: jobDescription.slice(0, 2000),
      score: result.score,
      scoreBreakdown: result.scoreBreakdown,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      missingSkills: result.missingSkills,
      bulletRewrites: result.bulletRewrites,
      summary: result.summary,
    });

    // Fallback: save to in-memory store
    const fallbackId = analysisId ?? memoryDb.saveAnalysis({
      resumeId: resumeId ?? "anonymous",
      jobDescription: jobDescription.slice(0, 2000),
      score: result.score,
      scoreBreakdown: result.scoreBreakdown,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      missingSkills: result.missingSkills,
      bulletRewrites: result.bulletRewrites,
      summary: result.summary,
    });

    return NextResponse.json({
      analysisId: analysisId ?? fallbackId,
      ...result,
    });
  } catch (error) {
    console.error("Match error:", error);

    // If AI fails, try local analysis as last resort
    try {
      const body = await request.clone().json();
      const local = fullAnalysis(body.resumeText || "", body.jobDescription || "");

      const analysisId = memoryDb.saveAnalysis({
        resumeId: body.resumeId ?? "anonymous",
        jobDescription: (body.jobDescription ?? "").slice(0, 2000),
        score: local.score,
        scoreBreakdown: local.scoreBreakdown,
        matchedKeywords: local.matchedKeywords,
        missingKeywords: local.missingKeywords,
        missingSkills: local.missingSkills,
        bulletRewrites: local.bulletRewrites,
        summary: local.summary,
      });

      return NextResponse.json({ analysisId, ...local });
    } catch {
      return NextResponse.json(
        { error: "Failed to calculate match" },
        { status: 500 }
      );
    }
  }
}