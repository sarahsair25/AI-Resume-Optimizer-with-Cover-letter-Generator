/**
 * Resume Parser Service
 * 
 * Extracts text from PDF, DOCX, and TXT resume files.
 * Uses: pdf-parse (PDF), mammoth (DOCX)
 */

import { sanitizeText } from "@/lib/utils";

export interface ParsedResume {
  text: string;
  sections: ResumeSection[];
  wordCount: number;
}

export interface ResumeSection {
  heading: string;
  content: string;
  bulletPoints: string[];
}

const SECTION_HEADINGS = [
  "experience", "education", "skills", "summary", "objective",
  "projects", "certifications", "publications", "awards",
  "languages", "interests", "volunteer", "references",
  "professional experience", "work experience", "technical skills",
  "core competencies", "professional summary", "profile",
];

/**
 * Parse resume text into structured sections
 */
export function parseResumeText(rawText: string): ParsedResume {
  const text = sanitizeText(rawText);
  const lines = text.split("\n").filter((l) => l.trim());
  const sections: ResumeSection[] = [];
  let currentSection: ResumeSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    const isHeading = SECTION_HEADINGS.some(
      (h) => lower.replace(/[:\s]/g, "") === h.replace(/[:\s]/g, "")
        || lower.startsWith(h + ":")
        || lower.startsWith(h + "\n")
    );

    if (isHeading) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        heading: trimmed.replace(/:$/, ""),
        content: "",
        bulletPoints: [],
      };
    } else if (currentSection) {
      const isBullet = /^[•\-*‐–—→▶◇●○▪▸›✓☐☑]\s*/.test(trimmed) ||
        /^\d+[.)]\s+/.test(trimmed);

      if (isBullet) {
        const bullet = trimmed.replace(/^[•\-*‐–—→▶◇●○▪▸›✓☐☑]\s*/, "").trim();
        currentSection.bulletPoints.push(bullet);
        currentSection.content += bullet + "\n";
      } else {
        currentSection.content += trimmed + "\n";
      }
    } else {
      currentSection = {
        heading: "header",
        content: trimmed + "\n",
        bulletPoints: [],
      };
    }
  }

  if (currentSection) sections.push(currentSection);

  return { text, sections, wordCount: text.split(/\s+/).length };
}

/**
 * Extract text from a file buffer based on file type.
 * Uses pdf-parse for PDF and mammoth for DOCX.
 */
export async function extractTextFromFile(
  buffer: Buffer,
  fileType: "pdf" | "docx" | "txt"
): Promise<string> {
  switch (fileType) {
    case "txt":
      return buffer.toString("utf-8");

    case "pdf": {
      // pdf-parse — lightweight text extraction from PDFs
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      return data.text || "";
    }

    case "docx": {
      // mammoth — converts .docx to clean HTML then strip tags
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Extract text from a base64-encoded PDF (for client-side upload previews)
 */
export async function extractTextFromBase64PDF(base64: string): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  return extractTextFromFile(buffer, "pdf");
}