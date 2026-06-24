export interface MatchResult {
  analysisId: string;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface RewriteResult {
  rewrites: BulletRewrite[];
}

export interface BulletRewrite {
  original: string;
  improved: string;
  reasoning: string;
}

export interface AnalysisResponse {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
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