export interface MatchResult {
  analysisId?: string;
  score: number;
  /** @deprecated Use score instead */
  matchScore?: number;
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
  /** @deprecated Use summary instead */
  suggestions?: string[];
}

// Re-export for backward compatibility
export type AnalysisResponse = MatchResult;

export interface BulletRewrite {
  original: string;
  improved: string;
  why: string;
}

export interface RewriteResult {
  rewrites: BulletRewrite[];
}

export interface UploadResponse {
  id: string;
  filename: string;
  fileType: string;
  size: number;
}

export interface ParseResponse {
  resumeId: string;
  text: string;
  wordCount: number;
  sections: { heading: string; content: string; bulletPoints: string[] }[];
}

export interface CoverLetterResponse {
  coverLetterId: string;
  content: string;
}