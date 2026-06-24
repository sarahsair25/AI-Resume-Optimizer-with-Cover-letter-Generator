/**
 * POST /api/parse
 * 
 * Parses an uploaded resume file and extracts structured text.
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "@/services/storage";
import { extractTextFromFile, parseResumeText } from "@/services/resume-parser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, filePath, fileType } = body;

    if (!filePath || !fileType) {
      return NextResponse.json(
        { error: "filePath and fileType are required" },
        { status: 400 }
      );
    }

    if (!["pdf", "docx", "txt"].includes(fileType)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${fileType}` },
        { status: 400 }
      );
    }

    // Read file from disk
    const buffer = await readFile(filePath);

    // Extract text based on file type
    const rawText = await extractTextFromFile(buffer, fileType);

    // Parse into structured sections
    const parsed = parseResumeText(rawText);

    return NextResponse.json({
      resumeId: fileId,
      text: parsed.text,
      wordCount: parsed.wordCount,
      sections: parsed.sections,
    });
  } catch (error) {
    console.error("Parse error:", error);
    const message = error instanceof Error ? error.message : "Failed to parse resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
