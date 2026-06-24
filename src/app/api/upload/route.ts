/**
 * POST /api/upload
 * 
 * Handles resume file upload (PDF, DOCX, TXT).
 * Returns a file ID for subsequent operations.
 */

import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/services/storage";
import { APP_CONFIG } from "@/config/constants";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!APP_CONFIG.ALLOWED_FILE_TYPES.includes(ext as any)) {
      return NextResponse.json(
        { error: `Invalid file type: .${ext}. Allowed: ${APP_CONFIG.ALLOWED_FILE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${APP_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Convert File to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await saveFile(buffer, file.name, ext);

    return NextResponse.json({
      id: stored.id,
      filename: stored.filename,
      fileType: stored.fileType,
      size: stored.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
