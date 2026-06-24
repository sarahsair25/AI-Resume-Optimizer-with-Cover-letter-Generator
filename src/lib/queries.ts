/**
 * Database operations for ResuMatch AI — user-scoped queries
 * Extended from db.ts with user-specific data retrieval.
 */

import { getDb } from "./db";
import * as schema from "./schema";
import { generateId } from "./utils";
import { eq, desc } from "drizzle-orm";

/**
 * Get all analyses for a specific user (from SQLite DB)
 */
export async function getUserAnalyses(userId: string) {
  const database = getDb();
  if (!database) return [];

  try {
    return database
      .select()
      .from(schema.analyses)
      .where(eq(schema.analyses.resumeId, userId))
      .orderBy(desc(schema.analyses.createdAt))
      .all();
  } catch {
    return [];
  }
}

/**
 * Get all cover letters for a specific user
 */
export async function getUserCoverLetters(userId: string) {
  const database = getDb();
  if (!database) return [];

  try {
    return database
      .select()
      .from(schema.coverLetters)
      .where(eq(schema.coverLetters.resumeId, userId))
      .orderBy(desc(schema.coverLetters.createdAt))
      .all();
  } catch {
    return [];
  }
}

/**
 * Save an analysis associated with a user
 */
export async function saveUserAnalysis(
  userId: string,
  data: {
    jobDescription: string;
    score: number;
    scoreBreakdown: { keywordMatch: number; relevance: number; impact: number; formatting: number };
    matchedKeywords: string[];
    missingKeywords: string[];
    missingSkills: { skill: string; reason: string }[];
    bulletRewrites: { original: string; improved: string; why: string }[];
    summary: string;
  }
) {
  const database = getDb();
  if (!database) return null;

  const id = generateId();

  try {
    database.insert(schema.analyses).values({
      id,
      resumeId: userId,
      jobDescription: data.jobDescription,
      score: data.score,
      keywordMatch: data.scoreBreakdown.keywordMatch,
      relevance: data.scoreBreakdown.relevance,
      impact: data.scoreBreakdown.impact,
      formatting: data.scoreBreakdown.formatting,
      matchedKeywords: JSON.stringify(data.matchedKeywords),
      missingKeywords: JSON.stringify(data.missingKeywords),
      missingSkills: JSON.stringify(data.missingSkills),
      bulletRewrites: JSON.stringify(data.bulletRewrites),
      summary: data.summary,
    }).run();

    return id;
  } catch {
    return null;
  }
}

/**
 * Get a user's stored resumes
 */
export async function getUserResumes(userId: string) {
  const database = getDb();
  if (!database) return [];

  try {
    return database
      .select()
      .from(schema.resumes)
      .where(eq(schema.resumes.userId, userId))
      .orderBy(desc(schema.resumes.createdAt))
      .all();
  } catch {
    return [];
  }
}