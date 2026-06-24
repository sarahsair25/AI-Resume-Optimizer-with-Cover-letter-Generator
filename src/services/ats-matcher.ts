/**
 * ATS Matcher Service
 * 
 * Keyword extraction and matching logic using NLP techniques.
 * Libraries: natural (tokenization, stemming, TF-IDF)
 */

import { APP_CONFIG } from "@/config/constants";
import type { Keyword, KeywordCategory } from "@/types/resume";

// Common English stop words to filter out
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

// Known skill keywords organized by category
const SKILL_TAXONOMY: Record<KeywordCategory, string[]> = {
  technical_skill: [
    "javascript", "typescript", "python", "java", "go", "rust", "c++",
    "react", "angular", "vue", "node", "express", "django", "flask",
    "sql", "nosql", "mongodb", "postgresql", "mysql", "redis",
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform",
    "git", "ci/cd", "jenkins", "github actions", "api", "rest",
    "graphql", "html", "css", "sass", "webpack", "vite",
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
  other: [],
};

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

/**
 * Simple tokenizer for splitting text into tokens
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-/#+.]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Simple stemmer (Porter-like rules)
 */
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

/**
 * Extract multi-word phrases (bigrams) from text
 */
function extractPhrases(tokens: string[], maxLength: number = 3): string[] {
  const phrases: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    for (let j = 1; j <= Math.min(maxLength, tokens.length - i); j++) {
      phrases.push(tokens.slice(i, i + j).join(" "));
    }
  }
  return phrases;
}

/**
 * Categorize a keyword based on known taxonomy
 */
function categorizeKeyword(term: string): KeywordCategory {
  const lower = term.toLowerCase();
  for (const [category, keywords] of Object.entries(SKILL_TAXONOMY)) {
    if (keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return category as KeywordCategory;
    }
  }
  return "other";
}

/**
 * Calculate TF-IDF-like term frequency
 */
function termFrequency(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }
  return freq;
}

/**
 * Main match function: compares resume text against job description
 */
export function calculateMatch(
  resumeText: string,
  jobDescription: string
): MatchResult {
  const jdTokens = tokenize(jobDescription);
  const resumeTokens = tokenize(resumeText);

  // Extract phrases from job description
  const jdPhrases = extractPhrases(jdTokens);

  // Calculate term frequency in JD
  const jdTermFreq = termFrequency(jdTokens);

  // Get unique resume terms and stems
  const resumeTerms = new Set(resumeTokens);
  const resumeStems = new Set(resumeTokens.map(simpleStem));

  const matchedKeywords: MatchedKeyword[] = [];
  const missingKeywords: MissingKeyword[] = [];
  const suggestions: string[] = [];

  // Score each keyword from the job description
  let totalWeight = 0;
  let matchedWeight = 0;

  for (const phrase of jdPhrases) {
    const phraseLower = phrase.toLowerCase();
    const phraseStem = simpleStem(phraseLower);
    const category = categorizeKeyword(phraseLower);
    const frequency = jdTermFreq.get(phraseLower.split(" ")[0]) ?? 1;

    // Calculate importance weight
    const importance = Math.min(
      APP_CONFIG.SCORING.EXACT_MATCH_WEIGHT * (frequency / Math.max(...Array.from(jdTermFreq.values()), 1)),
      APP_CONFIG.SCORING.EXACT_MATCH_WEIGHT * 2
    );

    totalWeight += importance;

    // Check for exact match
    const exactMatch = resumeTerms.has(phraseLower);

    // Check for stem match
    const stemMatch = resumeStems.has(phraseStem);

    // Check for partial phrase match
    const phraseWords = phraseLower.split(" ");
    const partialMatch =
      phraseWords.length > 1 &&
      phraseWords.some((w) => resumeTerms.has(w));

    if (exactMatch) {
      matchedKeywords.push({ term: phraseLower, category, weight: importance });
      matchedWeight += importance;
    } else if (stemMatch) {
      matchedKeywords.push({
        term: phraseLower,
        category,
        weight: importance * 0.75,
      });
      matchedWeight += importance * 0.75;
    } else if (partialMatch) {
      matchedKeywords.push({
        term: phraseLower,
        category,
        weight: importance * 0.5,
      });
      matchedWeight += importance * 0.5;
    } else if (category !== "other") {
      missingKeywords.push({
        term: phraseLower,
        category,
        importance,
      });
    }
  }

  // Calculate final match score
  const matchScore =
    totalWeight > 0
      ? Math.round((matchedWeight / totalWeight) * 100)
      : 0;

  // Generate suggestions based on missing keywords
  const topMissing = missingKeywords
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  if (topMissing.length > 0) {
    suggestions.push(
      `Add these missing keywords: ${topMissing.slice(0, 5).map((k) => k.term).join(", ")}`
    );
  }

  const skillMissing = topMissing.filter(
    (k) => k.category === "technical_skill"
  );
  if (skillMissing.length > 0) {
    suggestions.push(
      `Consider highlighting experience with: ${skillMissing.slice(0, 3).map((k) => k.term).join(", ")}`
    );
  }

  if (matchScore < 50) {
    suggestions.push(
      "Your resume has a low match score. Consider tailoring it more closely to the job description."
    );
  } else if (matchScore < 75) {
    suggestions.push(
      "Good match! Adding the missing keywords could push your score above 80%."
    );
  } else {
    suggestions.push(
      "Strong match! Your resume is well-aligned with this job description."
    );
  }

  return {
    matchScore,
    matchedKeywords,
    missingKeywords: topMissing,
    suggestions,
  };
}

/**
 * Analyze resume sections for impact-based scoring
 */
export function analyzeSectionImpact(sections: { heading: string; content: string }[]): {
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

    const impactScore =
      actionVerbs.length * 10 +
      quantified.length * 15 +
      dollarAmounts.length * 20;

    return {
      section: section.heading,
      actionVerbs,
      quantifiedResults: [...quantified, ...dollarAmounts],
      impactScore: Math.min(impactScore, 100),
    };
  });
}
