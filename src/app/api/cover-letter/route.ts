/**
 * POST /api/cover-letter
 * 
 * Generates an AI-powered cover letter based on resume and job description.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/services/llm-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription, companyName } = body;

    if (!resumeText || !jobDescription || !companyName) {
      return NextResponse.json(
        { error: "resumeText, jobDescription, and companyName are required" },
        { status: 400 }
      );
    }

    const content = await generateCoverLetter(
      resumeText,
      jobDescription,
      companyName
    );

    return NextResponse.json({
      coverLetterId: crypto.randomUUID?.() ?? Date.now().toString(),
      content,
    });
  } catch (error) {
    console.error("Cover letter error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate cover letter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
