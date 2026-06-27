import { inngest } from "@/lib/inngest-client";
import { eventType } from "inngest";
import { generatePdf, generateDocx, type ResumeData } from "@/lib/export-resume";
import { redis } from "@/lib/redis";

/**
 * Background job to generate a PDF resume.
 */
export const processPdfExport = inngest.createFunction(
  { id: "process-pdf-export", triggers: eventType("app/export.pdf.requested") },
  async ({ event, step }) => {
    const { data, jobId } = event.data as { data: ResumeData; jobId: string };

    const pdfBuffer = await step.run("generate-pdf", async () => {
      return await generatePdf(data);
    });

    // In a real production app, we would upload this to S3 or a similar store.
    // For now, we'll simulate the "ready" state in Redis.
    await step.run("update-job-status", async () => {
      await redis.set(`export:${jobId}`, {
        status: "completed",
        type: "pdf",
        // In a real app, this would be a signed URL
        downloadUrl: `/api/export/download?jobId=${jobId}`,
        timestamp: Date.now(),
      });
    });

    return { jobId, status: "success" };
  }
);

/**
 * Background job to generate a DOCX resume.
 */
export const processDocxExport = inngest.createFunction(
  { id: "process-docx-export", triggers: eventType("app/export.docx.requested") },
  async ({ event, step }) => {
    const { data, jobId } = event.data as { data: ResumeData; jobId: string };

    const docxBuffer = await step.run("generate-docx", async () => {
      return await generateDocx(data);
    });

    await step.run("update-job-status", async () => {
      await redis.set(`export:${jobId}`, {
        status: "completed",
        type: "docx",
        downloadUrl: `/api/export/download?jobId=${jobId}`,
        timestamp: Date.now(),
      });
    });

    return { jobId, status: "success" };
  }
);
