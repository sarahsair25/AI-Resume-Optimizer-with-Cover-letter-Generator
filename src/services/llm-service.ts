/**
 * LLM Service for AI-powered resume enhancements
 * 
 * Integrates with OpenAI (primary) or Google Gemini (fallback).
 * Used for: bullet point rewriting, cover letter generation, skill gap analysis.
 */

import { APP_CONFIG } from "@/config/constants";

interface LLMConfig {
  provider: "openai" | "gemini";
  apiKey?: string;
}

function getConfig(): LLMConfig {
  return {
    provider: APP_CONFIG.AI_PROVIDER,
    apiKey:
      process.env.OPENAI_API_KEY ?? process.env.GEMINI_API_KEY,
  };
}

/**
 * Rewrite resume bullet points to be more impact-driven
 * Uses the configured AI provider.
 */
export async function rewriteBulletPoints(
  bulletPoints: string[],
  jobDescription: string,
  resumeContext: string
): Promise<{ original: string; improved: string; reasoning: string }[]> {
  const config = getConfig();

  if (!config.apiKey) {
    // Return placeholder when no API key is configured
    return bulletPoints.map((bp) => ({
      original: bp,
      improved: bp,
      reasoning: "AI rewriting requires an API key (OPENAI_API_KEY or GEMINI_API_KEY)",
    }));
  }

  if (config.provider === "openai") {
    return rewriteWithOpenAI(bulletPoints, jobDescription, resumeContext);
  } else {
    return rewriteWithGemini(bulletPoints, jobDescription, resumeContext);
  }
}

async function rewriteWithOpenAI(
  bulletPoints: string[],
  jobDescription: string,
  resumeContext: string
): Promise<{ original: string; improved: string; reasoning: string }[]> {
  // Implementation when openai npm package is installed:
  // const OpenAI = (await import("openai")).default;
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  //
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     {
  //       role: "system",
  //       content: "You are an expert resume writer. Rewrite bullet points to be more impactful, quantifiable, and ATS-friendly."
  //     },
  //     {
  //       role: "user",
  //       content: `Job Description: ${jobDescription}\n\nResume Context: ${resumeContext}\n\nBullet Points: ${JSON.stringify(bulletPoints)}\n\nRewrite each bullet point to start with a strong action verb, include quantified results where possible, and match keywords from the job description. Return as JSON array with original, improved, and reasoning fields.`
  //     }
  //   ]
  // });
  //
  // return JSON.parse(response.choices[0].message.content ?? "[]");

  throw new Error(
    "OpenAI bullet rewriting requires the openai package. Run: npm install openai"
  );
}

async function rewriteWithGemini(
  bulletPoints: string[],
  jobDescription: string,
  resumeContext: string
): Promise<{ original: string; improved: string; reasoning: string }[]> {
  throw new Error(
    "Gemini bullet rewriting requires @google/generative-ai package. Run: npm install @google/generative-ai"
  );
}

/**
 * Generate a cover letter based on resume and job description
 */
export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string
): Promise<string> {
  const config = getConfig();

  if (!config.apiKey) {
    return `[Cover letter generation requires an API key. 

Job: ${jobDescription.substring(0, 100)}...
Company: ${companyName}

Resume: ${resumeText.substring(0, 100)}...]`;
  }

  if (config.provider === "openai") {
    return generateCoverLetterWithOpenAI(resumeText, jobDescription, companyName);
  } else {
    return generateCoverLetterWithGemini(resumeText, jobDescription, companyName);
  }
}

async function generateCoverLetterWithOpenAI(
  resumeText: string,
  jobDescription: string,
  companyName: string
): Promise<string> {
  throw new Error(
    "OpenAI cover letter generation requires the openai package. Run: npm install openai"
  );
}

async function generateCoverLetterWithGemini(
  resumeText: string,
  jobDescription: string,
  companyName: string
): Promise<string> {
  throw new Error(
    "Gemini cover letter generation requires @google/generative-ai package. Run: npm install @google/generative-ai"
  );
}

/**
 * Detect skills missing from resume compared to job description
 */
export async function detectMissingSkills(
  resumeSkills: string[],
  jdSkills: string[]
): Promise<{ skill: string; importance: "high" | "medium" | "low"; suggestion: string }[]> {
  const config = getConfig();

  if (!config.apiKey) {
    // Fall back to basic comparison
    return jdSkills
      .filter((s) => !resumeSkills.includes(s.toLowerCase()))
      .map((skill) => ({
        skill,
        importance: "medium" as const,
        suggestion: `Consider adding ${skill} to your resume if you have experience with it.`,
      }));
  }

  if (config.provider === "openai") {
    return detectMissingSkillsWithOpenAI(resumeSkills, jdSkills);
  } else {
    return detectMissingSkillsWithGemini(resumeSkills, jdSkills);
  }
}

async function detectMissingSkillsWithOpenAI(
  resumeSkills: string[],
  jdSkills: string[]
): Promise<{ skill: string; importance: "high" | "medium" | "low"; suggestion: string }[]> {
  throw new Error(
    "OpenAI skill detection requires the openai package"
  );
}

async function detectMissingSkillsWithGemini(
  resumeSkills: string[],
  jdSkills: string[]
): Promise<{ skill: string; importance: "high" | "medium" | "low"; suggestion: string }[]> {
  throw new Error(
    "Gemini skill detection requires @google/generative-ai package"
  );
}
