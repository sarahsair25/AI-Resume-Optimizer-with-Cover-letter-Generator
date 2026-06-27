/**
 * Resume export service — generates PDF and DOCX files from resume data.
 *
 * Uses pdf-lib for PDF generation and docx for Word document generation.
 */

import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
} from "docx";

export interface ResumeData {
  name: string;
  email: string;
  phone?: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    dates: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    dates: string;
  }[];
}

/**
 * Generate a PDF buffer from resume data.
 */
export async function generatePdf(data: ResumeData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage(PageSizes.Letter);
  const { width, height } = page.getSize();

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 10;
  const lineHeight = fontSize * 1.4;
  const margin = 50;
  let y = height - margin;

  // Helper functions
  const drawText = (text: string, opts: {
    size?: number;
    bold?: boolean;
    color?: number[];
    maxWidth?: number;
  } = {}) => {
    const f = opts.bold ? bold : font;
    const s = opts.size || fontSize;
    const c = opts.color || [0, 0, 0];

    // Handle line wrapping
    const maxWidth = opts.maxWidth || width - margin * 2;
    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const tw = f.widthOfTextAtSize(testLine, s);
      if (tw > maxWidth && line) {
        page.drawText(line, { x: margin, y, size: s, font: f, color: rgb(c[0], c[1], c[2]) });
        y -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x: margin, y, size: s, font: f, color: rgb(c[0], c[1], c[2]) });
      y -= lineHeight;
    }
  };

  const drawLine = () => {
    y -= 4;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    y -= 8;
  };

  // Name
  drawText(data.name, { size: 24, bold: true });
  y -= 4;

  // Contact
  const contactParts = [data.email];
  if (data.phone) contactParts.push(data.phone);
  drawText(contactParts.join(" | "), { size: 9, color: [0.3, 0.3, 0.3] });
  y -= 6;

  // Summary
  drawLine();
  drawText("PROFESSIONAL SUMMARY", { size: 11, bold: true });
  drawText(data.summary, { size: 9, maxWidth: width - margin * 2 });
  y -= 4;

  // Skills
  drawLine();
  drawText("SKILLS", { size: 11, bold: true });
  drawText(data.skills.join(" • "), { size: 9, color: [0.2, 0.2, 0.2] });
  y -= 4;

  // Experience
  drawLine();
  drawText("EXPERIENCE", { size: 11, bold: true });
  for (const exp of data.experience) {
    // Check if we need a new page
    if (y < 100) {
      const newPage = doc.addPage(PageSizes.Letter);
      y = height - margin;
    }

    drawText(`${exp.title} — ${exp.company}`, { size: 10, bold: true });
    drawText(exp.dates, { size: 9, color: [0.3, 0.3, 0.3] });

    for (const bullet of exp.bullets) {
      if (y < 60) {
        const newPage = doc.addPage(PageSizes.Letter);
        y = height - margin;
      }
      drawText(`• ${bullet}`, { size: 9, maxWidth: width - margin * 2 - 10 });
      y -= 2;
    }
    y -= 4;
  }

  // Education
  drawLine();
  drawText("EDUCATION", { size: 11, bold: true });
  for (const edu of data.education) {
    drawText(`${edu.degree} — ${edu.institution}`, { size: 10, bold: true });
    drawText(edu.dates, { size: 9, color: [0.3, 0.3, 0.3] });
    y -= 4;
  }

  const pdfBytes = await doc.save();
  return pdfBytes;
}

/**
 * Generate a DOCX buffer from resume data.
 */
export async function generateDocx(data: ResumeData): Promise<Uint8Array> {
  const children: (Paragraph)[] = [];

  // Helper to add a paragraph
  const addPara = (text: string, opts: {
    bold?: boolean;
    size?: number;
    color?: string;
    spacing?: number;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
  } = {}) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: opts.bold,
            size: (opts.size || 20) * 2, // docx uses half-points
            color: opts.color || "000000",
            font: "Calibri",
          }),
        ],
        spacing: { after: opts.spacing ?? 120 },
        alignment: opts.alignment,
        heading: opts.heading,
      })
    );
  };

  const addSectionHeader = (text: string) => {
    // Add a thin line
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "", size: 6 })],
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
        },
        spacing: { after: 100 },
      })
    );
    addPara(text, { bold: true, size: 13, spacing: 120, color: "1E40AF" });
  };

  const addBullet = (text: string) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "•  ", bold: true, size: 20, color: "4F46E5" }),
          new TextRun({ text, size: 20, font: "Calibri" }),
        ],
        spacing: { after: 60 },
        indent: { left: 360 },
      })
    );
  };

  // Name
  addPara(data.name, { bold: true, size: 28, spacing: 0 });
  // Contact
  const contactParts = [data.email];
  if (data.phone) contactParts.push(data.phone);
  addPara(contactParts.join(" | "), { size: 18, color: "666666", spacing: 200 });

  // Summary
  addSectionHeader("Professional Summary");
  addPara(data.summary, { size: 20, spacing: 160 });

  // Skills
  addSectionHeader("Skills");
  addPara(data.skills.join(" • "), { size: 20, color: "444444", spacing: 160 });

  // Experience
  addSectionHeader("Experience");
  for (const exp of data.experience) {
    addPara(exp.title, { bold: true, size: 22, spacing: 40 });
    addPara(`${exp.company} | ${exp.dates}`, { size: 18, color: "666666", spacing: 120 });
    for (const bullet of exp.bullets) {
      addBullet(bullet);
    }
    children.push(new Paragraph({ spacing: { after: 120 } }));
  }

  // Education
  addSectionHeader("Education");
  for (const edu of data.education) {
    addPara(edu.degree, { bold: true, size: 22, spacing: 40 });
    addPara(`${edu.institution} | ${edu.dates}`, { size: 18, color: "666666", spacing: 160 });
  }

  const doc = new Document({
    sections: [{ children }],
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
        },
      },
    },
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}