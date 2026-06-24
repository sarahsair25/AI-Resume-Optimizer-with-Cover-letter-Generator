/**
 * Database interface for ResuMatch AI
 * 
 * In Phase 1 (MVP), this uses an in-memory store.
 * After Phase 1, migrate to SQLite via Turso/BetterSQLite3 + Drizzle ORM.
 */

import type { Analysis, CoverLetter, Resume, User } from "./schema";
import { generateId } from "./utils";

// In-memory storage (MVP only — replace with SQLite in Phase 2)
const stores = {
  users: new Map<string, User>(),
  resumes: new Map<string, Resume>(),
  analyses: new Map<string, Analysis>(),
  coverLetters: new Map<string, CoverLetter>(),
};

export const db = {
  // Users
  createUser(email: string, name?: string): User {
    const user: User = {
      id: generateId(),
      email,
      name: name ?? null,
      plan: "free",
      creditsRemaining: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stores.users.set(user.id, user);
    return user;
  },

  getUser(id: string): User | undefined {
    return stores.users.get(id);
  },

  // Resumes
  createResume(
    userId: string,
    filename: string,
    originalText: string,
    filePath: string,
    fileType: "pdf" | "docx" | "txt"
  ): Resume {
    const resume: Resume = {
      id: generateId(),
      userId,
      filename,
      originalText,
      filePath,
      fileType,
      createdAt: new Date().toISOString(),
    };
    stores.resumes.set(resume.id, resume);
    return resume;
  },

  getResume(id: string): Resume | undefined {
    return stores.resumes.get(id);
  },

  // Analyses
  createAnalysis(
    resumeId: string,
    jobDescription: string,
    matchScore: number,
    matchedKeywords: string[],
    missingKeywords: string[],
    suggestions: string[]
  ): Analysis {
    const analysis: Analysis = {
      id: generateId(),
      resumeId,
      jobDescription,
      matchScore,
      matchedKeywords: JSON.stringify(matchedKeywords),
      missingKeywords: JSON.stringify(missingKeywords),
      suggestions: JSON.stringify(suggestions),
      createdAt: new Date().toISOString(),
    };
    stores.analyses.set(analysis.id, analysis);
    return analysis;
  },

  getAnalysis(id: string): Analysis | undefined {
    return stores.analyses.get(id);
  },

  // Cover Letters
  createCoverLetter(
    resumeId: string,
    jobDescription: string,
    content: string
  ): CoverLetter {
    const coverLetter: CoverLetter = {
      id: generateId(),
      resumeId,
      jobDescription,
      content,
      createdAt: new Date().toISOString(),
    };
    stores.coverLetters.set(coverLetter.id, coverLetter);
    return coverLetter;
  },

  getCoverLetter(id: string): CoverLetter | undefined {
    return stores.coverLetters.get(id);
  },
};