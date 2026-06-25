/**
 * ATS Matcher Service
 * 
 * Keyword extraction and matching logic using NLP techniques.
 * Supports both local NLP-based matching and LLM-powered full analysis.
 * Libraries: natural (tokenization, stemming, TF-IDF)
 */

import { APP_CONFIG } from "@/config/constants";
import type { KeywordCategory } from "@/types/resume";

// ─── Types ───────────────────────────────────────────────────────

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
  bulletRewrites: BulletRewrite[];
  summary: string;
}

export interface BulletRewrite {
  original: string;
  improved: string;
  why: string;
}

export interface MatchResult {
  matchScore: number;
  matchedKeywords: MatchedKeyword[];
  missingKeywords: MissingKeyword[];
  suggestions: string[];
}

export interface MatchedKeyword {
  term: string;
  category: KeywordCategory;
  weight: number;
}

export interface MissingKeyword {
  term: string;
  category: KeywordCategory;
  importance: number;
}

// ─── Stop words ──────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "by", "with", "from", "as", "is", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "can", "could", "should", "may", "might", "shall", "about", "into",
  "through", "during", "before", "after", "above", "below", "between",
  "out", "off", "over", "under", "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how", "all", "each", "every",
  "both", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "also", "if", "then", "else", "this", "that", "these", "those",
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you",
  "your", "yours", "yourself", "he", "him", "his", "himself", "she",
  "her", "hers", "herself", "it", "its", "itself", "they", "them",
  "their", "theirs", "themselves", "what", "which", "who", "whom",
]);

// ─── Skill taxonomy ──────────────────────────────────────────────

const SKILL_TAXONOMY: Record<string, string[]> = {
  technical_skill: [
    "javascript", "typescript", "python", "java", "go", "rust", "c++",
    "react", "angular", "vue", "svelte", "next.js", "node", "express",
    "django", "flask", "spring", "sql", "nosql", "mongodb", "postgresql",
    "mysql", "redis", "docker", "kubernetes", "aws", "azure", "gcp",
    "terraform", "git", "ci/cd", "jenkins", "github actions", "api",
    "rest", "graphql", "html", "css", "sass", "webpack", "vite",
  ],
  soft_skill: [
    "leadership", "communication", "teamwork", "problem solving",
    "critical thinking", "time management", "project management",
    "agile", "scrum", "collaboration", "mentoring", "presentation",
    "negotiation", "conflict resolution", "adaptability",
  ],
  qualification: [
    "bachelor", "master", "phd", "degree", "certification",
    "aws certified", "pmp", "cissp", "cpa", "cfa",
  ],
  domain_knowledge: [
    "machine learning", "data science", "artificial intelligence",
    "cybersecurity", "cloud computing", "devops", "blockchain",
    "mobile development", "web development", "data engineering",
  ],
  tool: [
    "jira", "confluence", "slack", "figma", "sketch", "photoshop",
    "tableau", "power bi", "looker", "datadog", "sentry", "new relic",
    "postman", "swagger", "notion", "linear", "asana", "trello",
  ],
};

// ─── Tokenization & NLP helpers ──────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-/#+.]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function simpleStem(word: string): string {
  return word
    .replace(/(ss)es$/g, "$1")
    .replace(/([^s])s$/g, "$1")
    .replace(/ing$/g, "")
    .replace(/ed$/g, "")
    .replace(/(t)ion$/g, "$1")
    .replace(/er$/g, "")
    .replace(/ly$/g, "")
    .replace(/ment$/g, "")
    .toLowerCase();
}

function extractPhrases(tokens: string[], maxLength: number = 3): string[] {
  const phrases: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    for (let j = 1; j <= Math.min(maxLength, tokens.length - i); j++) {
      const phrase = tokens.slice(i, i + j).join(" ");
      if (phrase.length > 1) phrases.push(phrase);
    }
  }
  return phrases;
}

function termFrequency(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }
  return freq;
}

function categorizeKeyword(term: string): string {
  const lower = term.toLowerCase();
  for (const [category, keywords] of Object.entries(SKILL_TAXONOMY)) {
    if (keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return category;
    }
  }
  return "other";
}

// ─── Section impact analysis ─────────────────────────────────────

function analyzeSectionImpact(sections: { heading: string; content: string }[]): {
  section: string;
  actionVerbs: string[];
  quantifiedResults: string[];
  impactScore: number;
}[] {
  return sections.map((section) => {
    const content = section.content.toLowerCase();
    const actionVerbs = [
      "achieved", "improved", "increased", "decreased", "led",
      "managed", "developed", "designed", "implemented", "created",
      "delivered", "launched", "optimized", "reduced", "generated",
      "built", "spearheaded", "established", "transformed", "drove",
    ].filter((v) => content.includes(v));

    const quantified = section.content.match(/\d+%/g) ?? [];
    const dollarAmounts = section.content.match(/\$\d+[kKmMbB]?/g) ?? [];

    return {
      section: section.heading,
      actionVerbs,
      quantifiedResults: [...quantified, ...dollarAmounts],
      impactScore: Math.min(actionVerbs.length * 10 + quantified.length * 15 + dollarAmounts.length * 20, 100),
    };
  });
}

// ─── Main match function ─────────────────────────────────────────

export function calculateMatch(
  resumeText: string,
  jobDescription: string
): MatchResult {
  const jdTokens = tokenize(jobDescription);
  const resumeTokens = tokenize(resumeText);
  const jdPhrases = extractPhrases(jdTokens);
  const jdTermFreq = termFrequency(jdTokens);

  const resumeTerms = new Set(resumeTokens);
  const resumeStems = new Set(resumeTokens.map(simpleStem));

  const matchedKeywords: MatchedKeyword[] = [];
  const missingKeywords: MissingKeyword[] = [];
  const suggestions: string[] = [];

  let totalWeight = 0;
  let matchedWeight = 0;

  for (const phrase of jdPhrases) {
    const phraseLower = phrase.toLowerCase();
    const phraseStem = simpleStem(phraseLower);
    const category = categorizeKeyword(phraseLower) as KeywordCategory;
    const frequency = jdTermFreq.get(phraseLower.split(" ")[0]) ?? 1;
    const maxFreq = Math.max(...Array.from(jdTermFreq.values()), 1);
    const importance = Math.min(APP_CONFIG.SCORING.EXACT_MATCH_WEIGHT * (frequency / maxFreq), APP_CONFIG.SCORING.EXACT_MATCH_WEIGHT * 2);
    totalWeight += importance;

    const exactMatch = resumeTerms.has(phraseLower);
    const stemMatch = resumeStems.has(phraseStem);
    const phraseWords = phraseLower.split(" ");
    const partialMatch = phraseWords.length > 1 && phraseWords.some((w) => resumeTerms.has(w));

    if (exactMatch) {
      matchedKeywords.push({ term: phraseLower, category, weight: importance });
      matchedWeight += importance;
    } else if (stemMatch) {
      matchedKeywords.push({ term: phraseLower, category, weight: importance * 0.75 });
      matchedWeight += importance * 0.75;
    } else if (partialMatch) {
      matchedKeywords.push({ term: phraseLower, category, weight: importance * 0.5 });
      matchedWeight += importance * 0.5;
    } else if (category !== "other") {
      missingKeywords.push({ term: phraseLower, category, importance });
    }
  }

  const matchScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  const topMissing = missingKeywords.sort((a, b) => b.importance - a.importance).slice(0, 10);
  if (topMissing.length > 0) {
    suggestions.push(`Add these missing keywords: ${topMissing.slice(0, 5).map((k) => k.term).join(", ")}`);
  }
  const skillMissing = topMissing.filter((k) => k.category === "technical_skill");
  if (skillMissing.length > 0) {
    suggestions.push(`Consider highlighting experience with: ${skillMissing.slice(0, 3).map((k) => k.term).join(", ")}`);
  }
  if (matchScore < 50) {
    suggestions.push("Your resume has a low match score. Consider tailoring it more closely to the job description.");
  } else if (matchScore < 75) {
    suggestions.push("Good match! Adding the missing keywords could push your score above 80%.");
  } else {
    suggestions.push("Strong match! Your resume is well-aligned with this job description.");
  }

  return { matchScore, matchedKeywords, missingKeywords: topMissing, suggestions };
}

// ─── Full analysis for owner-code.jsx format ─────────────────────

export function fullAnalysis(
  resumeText: string,
  jobDescription: string
): AnalysisResult {
  const match = calculateMatch(resumeText, jobDescription);
  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jobDescription);
  const jdPhrases = extractPhrases(jdTokens);

  // Score breakdown
  const skillKeywords = jdPhrases.filter((p) => categorizeKeyword(p) !== "other");
  const matched = new Set(match.matchedKeywords.map((k) => k.term));
  const matchedSkill = skillKeywords.filter((k) => matched.has(k)).length;
  const totalSkill = Math.max(skillKeywords.length, 1);

  // Relevance: how many resume terms appear in JD context
  const jdTermSet = new Set(jdTokens);
  const relevantTerms = resumeTokens.filter((t) => jdTermSet.has(t)).length;
  const relevanceScore = Math.min(Math.round((relevantTerms / Math.max(resumeTokens.length, 1)) * 200), 100);

  // Impact: action verbs and quantified results
  const actionVerbs = [
    "achieved", "improved", "increased", "decreased", "led", "managed",
    "developed", "designed", "implemented", "created", "delivered",
    "launched", "optimized", "reduced", "generated", "built",
  ];
  const actionsInResume = actionVerbs.filter((v) => resumeText.toLowerCase().includes(v)).length;
  const quantified = (resumeText.match(/\d+%/g) ?? []).length + (resumeText.match(/\$\d+[kKmMbB]?/g) ?? []).length;
  const impactScore = Math.min(actionsInResume * 7 + quantified * 10, 100);

  // Formatting: simple heuristic based on section structure
  const hasSections = /experience|education|skills/i.test(resumeText) ? 30 : 0;
  const hasBullets = /[•\-*]\s/.test(resumeText) ? 25 : 0;
  const hasQuantified = /\d+%|\$\d+/.test(resumeText) ? 25 : 0;
  const isConcise = resumeText.split(/\s+/).length < 800 ? 20 : 10;
  const formattingScore = Math.min(hasSections + hasBullets + hasQuantified + isConcise, 100);

  const keywordMatchScore = Math.round((matchedSkill / totalSkill) * 100);

  // Deduplicate matched/missing as simple strings
  const matchedSet = new Set<string>();
  const matchedStrings: string[] = [];
  for (const kw of match.matchedKeywords) {
    if (!matchedSet.has(kw.term)) {
      matchedSet.add(kw.term);
      matchedStrings.push(kw.term);
    }
  }

  const missingSet = new Set<string>();
  const missingStrings: string[] = [];
  for (const kw of match.missingKeywords) {
    if (!missingSet.has(kw.term)) {
      missingSet.add(kw.term);
      missingStrings.push(kw.term);
    }
  }

  // Missing skills with reasons
  const missingSkills = match.missingKeywords
    .filter((k) => k.category === "technical_skill" || k.category === "domain_knowledge")
    .slice(0, 4)
    .map((k) => ({
      skill: k.term,
      reason: categorizeKeyword(k.term) === "technical_skill"
        ? `This technical skill appears in the job description but is not found in your resume.`
        : `This qualification is listed in the job requirements but missing from your application.`,
    }));

  // Bullet rewrites (placeholder — actual rewrites via LLM)
  const resumeLines = resumeText.split("\n").filter((l) => /^[•\-*\s]/.test(l.trim())).slice(0, 3);
  const bulletRewrites: BulletRewrite[] = resumeLines.map((line) => ({
    original: line.replace(/^[•\-*]\s*/, "").trim(),
    improved: `[AI rewrite] → ` + line.replace(/^[•\-*]\s*/, "").trim(),
    why: "Highlight measurable impact and use stronger action verbs.",
  }));

  // Summary
  const summary = match.matchScore >= 75
    ? `Strong match at ${match.matchScore}%. Your resume aligns well with this role. Consider adding the ${missingStrings.length} missing keywords to further optimize.`
    : match.matchScore >= 50
    ? `Decent match at ${match.matchScore}%. Your resume covers some key areas but is missing ${missingStrings.length} important keywords. Tailor your bullet points to emphasize relevant experience.`
    : `Low match at ${match.matchScore}%. Your resume needs significant tailoring for this role. Focus on incorporating the ${missingStrings.length} missing skills and keywords.`;

  return {
    score: match.matchScore,
    scoreBreakdown: {
      keywordMatch: keywordMatchScore,
      relevance: relevanceScore,
      impact: impactScore,
      formatting: formattingScore,
    },
    matchedKeywords: matchedStrings.slice(0, 8),
    missingKeywords: missingStrings.slice(0, 8),
    missingSkills: missingSkills.slice(0, 3),
    bulletRewrites: bulletRewrites.slice(0, 3),
    summary,
  };
}