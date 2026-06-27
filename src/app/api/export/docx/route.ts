/**
 * DOCX Export API — Generates and downloads a Word (.docx) resume.
 *
 * POST /api/export/docx
 * Body: ResumeData (name, email, phone, summary, skills, experience, education)
 * Response: DOCX file download
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateDocx, type ResumeData } from "@/lib/export-resume";
import { inngest } from "@/lib/inngest-client";
import { redis } from "@/lib/redis";
import crypto from "crypto";

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

    // Check if user requested async processing (background job)
    const url = new URL(req.url);
    const isAsync = url.searchParams.get("async") === "true";

    if (isAsync) {
      const jobId = crypto.randomUUID();
      
      // Initialize job status in Redis
      await redis.set(`export:${jobId}`, {
        status: "processing",
        type: "docx",
        timestamp: Date.now(),
      }, { ex: 3600 });

      // Trigger background job via Inngest
      await inngest.send({
        name: "app/export.docx.requested",
        data: { data, jobId },
      });

      return NextResponse.json({ jobId, status: "processing" });
    }

    const docxBuffer = await generateDocx(data);

    return new NextResponse(docxBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${data.name.replace(/\s+/g, "_")}_Resume.docx"`,
        "Content-Length": String(docxBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("DOCX export error:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX" },
      { status: 500 }
    );
  }
}