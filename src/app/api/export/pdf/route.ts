/**
 * PDF Export API — Generates and downloads a PDF resume.
 *
 * POST /api/export/pdf
 * Body: ResumeData (name, email, phone, summary, skills, experience, education)
 * Response: PDF file download
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generatePdf, type ResumeData } from "@/lib/export-resume";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: ResumeData = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.summary) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, summary" },
        { status: 400 }
      );
    }

    const pdfBuffer = await generatePdf(data);

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.name.replace(/\s+/g, "_")}_Resume.pdf"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}