/**
 * Resume Parser Service
 * 
 * Extracts text from PDF, DOCX, and TXT resume files.
 * Phase 1 MVP: File system-based parsing.
 * Libraries: pdf-parse (PDF), mammoth (DOCX)
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
  "experience",
  "education",
  "skills",
  "summary",
  "objective",
  "projects",
  "certifications",
  "publications",
  "awards",
  "languages",
  "interests",
  "volunteer",
  "references",
];

/**
 * Parse a resume text into structured sections
 */
export function parseResumeText(rawText: string): ParsedResume {
  const text = sanitizeText(rawText);
  const lines = text.split("\n").filter((l) => l.trim());
  const sections: ResumeSection[] = [];
  let currentSection: ResumeSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    // Check if this line is a section heading
    const isHeading = SECTION_HEADINGS.some(
      (h) =>
        lower.startsWith(h) ||
        lower.includes(h + ":") ||
        lower.includes(h + "\n")
    );

    if (isHeading) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: trimmed,
        content: "",
        bulletPoints: [],
      };
    } else if (currentSection) {
      // Detect bullet points
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
      // Content before any section heading
      currentSection = {
        heading: "header",
        content: trimmed + "\n",
        bulletPoints: [],
      };
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return {
    text,
    sections,
    wordCount: text.split(/\s+/).length,
  };
}

/**
 * Extract text from a buffer based on file type
 * Note: Actual pdf-parse and mammoth imports will be added when those
 * npm packages are installed.
 */
export async function extractTextFromFile(
  buffer: Buffer,
  fileType: "pdf" | "docx" | "txt"
): Promise<string> {
  switch (fileType) {
    case "txt":
      return buffer.toString("utf-8");

    case "pdf": {
      // Using pdf-parse (v1.1.1) - lightweight text extraction
      // const pdfParse = (await import("pdf-parse")).default;
      // const data = await pdfParse(buffer);
      // return data.text;
      throw new Error(
        "PDF parsing requires pdf-parse package. Run: npm install pdf-parse"
      );
    }

    case "docx": {
      // Using mammoth - converts .docx to HTML/Markdown
      // const mammoth = await import("mammoth");
      // const result = await mammoth.extractRawText({ buffer });
      // return result.value;
      throw new Error(
        "DOCX parsing requires mammoth package. Run: npm install mammoth"
      );
    }

    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
