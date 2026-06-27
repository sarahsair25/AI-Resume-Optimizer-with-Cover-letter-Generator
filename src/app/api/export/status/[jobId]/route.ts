import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  
  if (!jobId) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });
  }

  try {
    const status = await redis.get(`export:${jobId}`);
    
    if (!status) {
      return NextResponse.json({ error: "Job not found or expired" }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error("Status fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
