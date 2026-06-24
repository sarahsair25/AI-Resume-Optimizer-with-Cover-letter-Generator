/**
 * LLM Service for AI-powered resume enhancements
 * 
 * Integrates with OpenAI (primary) or Google Gemini (fallback).
 * Uses the prompts defined in owner-code.jsx.
 */

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Prompts from owner-code.jsx ─────────────────────────────────

const SYSTEM_PROMPT = `You are an expert resume coach and ATS specialist. When given a resume and a job description, return ONLY a valid JSON object with exactly this structure (no markdown, no explanation):
{"score":<number 0-100>,"scoreBreakdown":{"keywordMatch":<number>,"relevance":<number>,"impact":<number>,"formatting":<number>},"matchedKeywords":["kw1"],"missingKeywords":["kw1"],"missingSkills":[{"skill":"name","reason":"why"}],"bulletRewrites":[{"original":"orig","improved":"better","why":"reason"}],"summary":"2-3 sentence assessment"}
Provide EXACTLY 4 matched keywords, 4 missing keywords, 2 missing skills, 3 bullet rewrites. Be concise.`;

const APPLY_PROMPT = `You are a resume editor. Apply the improved bullets by replacing originals. Weave in missing keywords naturally. Return ONLY the updated resume text. No explanation, no markdown.`;

const COVER_PROMPT = `You are a career coach. Write a concise, compelling cover letter (under 300 words, 3 paragraphs) based on the resume and job description. Start with "Dear Hiring Manager,". Be specific, warm, and human. Return ONLY the cover letter text.`;

// ─── Analysis result shape ───────────────────────────────────────

export interface AnalysisResult {
  score: number;
  scoreBreakdown: {
    keywordMatch: number;
    relevance: number;
    impact: number;
    formatting: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: { skill: string; reason: string }[];
  bulletRewrites: { original: string; improved: string; why: string }[];
  summary: string;
}

interface AnalysisInput {
  resumeText: string;
  jobDescription: string;
}

interface RewriteInput {
  bulletPoints: string[];
  jobDescription: string;
  resumeContext: string;
}

interface CoverLetterInput {
  resumeText: string;
  jobDescription: string;
  companyName: string;
}

// ─── Config ──────────────────────────────────────────────────────

type Provider = "openai" | "gemini" | "none";

function getProvider(): Provider {
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return "none";
}

// ─── OpenAI helpers ──────────────────────────────────────────────

function getOpenAI(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function callOpenAI(
  systemPrompt: string,
  userContent: string,
  maxTokens: number = 1000
): Promise<string> {
  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

// ─── Gemini helpers ──────────────────────────────────────────────

function getGemini(): GoogleGenerativeAI {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

async function callGemini(
  systemPrompt: string,
  userContent: string,
  maxTokens: number = 1000
): Promise<string> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userContent }] }],
    generationConfig: { maxOutputTokens: maxTokens },
  });
  return result.response.text();
}

// ─── Core analysis ───────────────────────────────────────────────

/**
 * Full resume analysis using AI.
 * Returns score breakdown, keywords, missing skills, bullet rewrites, and summary.
 * Falls back to local analysis if no API key is available.
 */
export async function analyzeResume(input: AnalysisInput): Promise<AnalysisResult> {
  const { resumeText, jobDescription } = input;
  const provider = getProvider();

  // Fallback if no API key
  if (provider === "none") {
    const { fullAnalysis } = await import("./ats-matcher");
    return fullAnalysis(resumeText, jobDescription);
  }

  const content = `RESUME:\n${resumeText.slice(0, 3000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 2000)}`;

  try {
    let raw: string;
    if (provider === "openai") {
      raw = await callOpenAI(SYSTEM_PROMPT, content, 1000);
    } else {
      raw = await callGemini(SYSTEM_PROMPT, content, 1000);
    }

    // Parse JSON from response (strip markdown fences)
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      score: parsed.score ?? 0,
      scoreBreakdown: {
        keywordMatch: parsed.scoreBreakdown?.keywordMatch ?? 0,
        relevance: parsed.scoreBreakdown?.relevance ?? 0,
        impact: parsed.scoreBreakdown?.impact ?? 0,
        formatting: parsed.scoreBreakdown?.formatting ?? 0,
      },
      matchedKeywords: parsed.matchedKeywords ?? [],
      missingKeywords: parsed.missingKeywords ?? [],
      missingSkills: parsed.missingSkills ?? [],
      bulletRewrites: parsed.bulletRewrites ?? [],
      summary: parsed.summary ?? "",
    };
  } catch (err) {
    console.error("AI analysis failed, falling back to local:", err);
    const { fullAnalysis } = await import("./ats-matcher");
    return fullAnalysis(resumeText, jobDescription);
  }
}

// ─── Bullet point rewrites ───────────────────────────────────────

/**
 * Rewrite resume bullet points using AI to be more impact-driven.
 */
export async function rewriteBulletPoints(
  bulletPoints: string[],
  jobDescription: string,
  resumeContext: string
): Promise<{ original: string; improved: string; reasoning: string }[]> {
  const provider = getProvider();

  if (provider === "none") {
    return bulletPoints.map((bp) => ({
      original: bp,
      improved: bp,
      reasoning: "AI rewriting requires OPENAI_API_KEY or GEMINI_API_KEY",
    }));
  }

  const content = `Job Description: ${jobDescription.slice(0, 1000)}\n\nResume Context: ${resumeContext.slice(0, 1000)}\n\nBullet Points: ${JSON.stringify(bulletPoints)}\n\nRewrite each bullet point to start with a strong action verb, include quantified results where possible, and match keywords from the job description. Return as JSON array with original, improved, and reasoning fields.`;

  try {
    let raw: string;
    if (provider === "openai") {
      raw = await callOpenAI(
        "You are an expert resume writer. Return ONLY a valid JSON array.",
        content,
        1500
      );
    } else {
      raw = await callGemini(
        "You are an expert resume writer. Return ONLY a valid JSON array.",
        content,
        1500
      );
    }

    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Bullet rewrite failed:", err);
    return bulletPoints.map((bp) => ({
      original: bp,
      improved: bp,
      reasoning: "AI rewrite temporarily unavailable.",
    }));
  }
}

// ─── Cover letter generation ─────────────────────────────────────

/**
 * Generate a cover letter using AI.
 */
export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string
): Promise<string> {
  const provider = getProvider();

  if (provider === "none") {
    return `[Cover letter generation requires an API key.]`;
  }

  const content = `RESUME:\n${resumeText.slice(0, 2500)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 1500)}\n\nCOMPANY: ${companyName}`;

  try {
    if (provider === "openai") {
      return await callOpenAI(COVER_PROMPT, content, 1000);
    } else {
      return await callGemini(COVER_PROMPT, content, 1000);
    }
  } catch (err) {
    console.error("Cover letter generation failed:", err);
    return "We encountered an error generating the cover letter. Please try again later.";
  }
}

// ─── Apply changes to resume (weave in rewrites) ─────────────────

/**
 * Apply bullet rewrites and missing keywords to the original resume.
 */
export async function applyChangesToResume(
  originalResume: string,
  bulletRewrites: { original: string; improved: string }[],
  missingKeywords: string[]
): Promise<string> {
  const provider = getProvider();

  if (provider === "none") {
    return originalResume;
  }

  const changesDesc = bulletRewrites
    .map((b) => `- Replace: "${b.original}"\n  With: "${b.improved}"`)
    .join("\n");
  const kwDesc = missingKeywords.slice(0, 4).join(", ");
  const content = `ORIGINAL RESUME:\n${originalResume}\n\nBULLET IMPROVEMENTS:\n${changesDesc}\n\nMISSING KEYWORDS TO WEAVE IN: ${kwDesc}`;

  try {
    if (provider === "openai") {
      return await callOpenAI(APPLY_PROMPT, content, 1000);
    } else {
      return await callGemini(APPLY_PROMPT, content, 1000);
    }
  } catch (err) {
    console.error("Apply changes failed:", err);
    return originalResume;
  }
}

/**
 * Detect missing skills from resume compared to job description.
 */
export async function detectMissingSkills(
  resumeSkills: string[],
  jdSkills: string[]
): Promise<{ skill: string; importance: "high" | "medium" | "low"; suggestion: string }[]> {
  const provider = getProvider();

  if (provider === "none") {
    return jdSkills
      .filter((s) => !resumeSkills.includes(s.toLowerCase()))
      .map((skill) => ({
        skill,
        importance: "medium" as const,
        suggestion: `Consider adding ${skill} to your resume if you have experience with it.`,
      }));
  }

  const content = `Resume skills: ${JSON.stringify(resumeSkills)}\nJob description skills: ${JSON.stringify(jdSkills)}\n\nIdentify which skills from the job description are missing from the resume. Rate each as high/medium/low importance. Return as JSON array with skill, importance, and suggestion fields.`;

  try {
    let raw: string;
    if (provider === "openai") {
      raw = await callOpenAI(
        "You are a hiring expert. Return ONLY valid JSON.",
        content,
        800
      );
    } else {
      raw = await callGemini(
        "You are a hiring expert. Return ONLY valid JSON.",
        content,
        800
      );
    }
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return jdSkills
      .filter((s) => !resumeSkills.includes(s.toLowerCase()))
      .map((skill) => ({ skill, importance: "medium" as const, suggestion: `Consider adding ${skill}.` }));
  }
}