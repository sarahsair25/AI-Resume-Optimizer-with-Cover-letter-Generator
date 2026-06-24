/**
 * Database client for ResuMatch AI
 * Uses Drizzle ORM with better-sqlite3 for SQLite persistence.
 * Falls back to in-memory store if database is not available.
 */

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { join } from "path";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqliteDb: Database.Database | null = null;

/**
 * Initialize and get the database instance.
 * Creates the database file if it doesn't exist.
 */
export function getDb() {
  if (db) return db;

  const dbPath = join(process.cwd(), "data", "resumatch.db");

  try {
    // Needs fs for mkdir
    const { mkdirSync } = require("fs");
    mkdirSync(join(process.cwd(), "data"), { recursive: true });

    sqliteDb = new Database(dbPath);
    sqliteDb.pragma("journal_mode = WAL");
    sqliteDb.pragma("foreign_keys = ON");

    db = drizzle(sqliteDb, { schema });

    // Create tables automatically
    createTables();

    return db;
  } catch (err) {
    console.warn("SQLite not available, using in-memory store:", err);
    return null;
  }
}

function createTables() {
  if (!sqliteDb) return;

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      credits_remaining TEXT NOT NULL DEFAULT '5',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      filename TEXT NOT NULL,
      original_text TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL CHECK(file_type IN ('pdf','docx','txt')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      resume_id TEXT REFERENCES resumes(id),
      job_description TEXT NOT NULL,
      score REAL NOT NULL,
      keyword_match REAL NOT NULL,
      relevance REAL NOT NULL,
      impact REAL NOT NULL,
      formatting REAL NOT NULL,
      matched_keywords TEXT NOT NULL,
      missing_keywords TEXT NOT NULL,
      missing_skills TEXT NOT NULL,
      bullet_rewrites TEXT,
      summary TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cover_letters (
      id TEXT PRIMARY KEY,
      resume_id TEXT REFERENCES resumes(id),
      job_description TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

/**
 * Save an analysis result to the database
 */
export function saveAnalysis(analysis: {
  resumeId: string;
  jobDescription: string;
  score: number;
  scoreBreakdown: { keywordMatch: number; relevance: number; impact: number; formatting: number };
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: { skill: string; reason: string }[];
  bulletRewrites: { original: string; improved: string; why: string }[];
  summary: string;
}) {
  const database = getDb();
  if (!database) return null;

  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  database.insert(schema.analyses).values({
    id,
    resumeId: analysis.resumeId,
    jobDescription: analysis.jobDescription,
    score: analysis.score,
    keywordMatch: analysis.scoreBreakdown.keywordMatch,
    relevance: analysis.scoreBreakdown.relevance,
    impact: analysis.scoreBreakdown.impact,
    formatting: analysis.scoreBreakdown.formatting,
    matchedKeywords: JSON.stringify(analysis.matchedKeywords),
    missingKeywords: JSON.stringify(analysis.missingKeywords),
    missingSkills: JSON.stringify(analysis.missingSkills),
    bulletRewrites: JSON.stringify(analysis.bulletRewrites),
    summary: analysis.summary,
  }).run();

  return id;
}

/**
 * Retrieve an analysis by ID
 */
export function getAnalysis(id: string) {
  const database = getDb();
  if (!database) return null;

  const result = database.select().from(schema.analyses).where(
    (eq: any) => eq(schema.analyses.id, id)
  ).get();

  return result ?? null;
}

/**
 * Save a cover letter to the database
 */
export function saveCoverLetter(data: {
  resumeId: string;
  jobDescription: string;
  content: string;
}) {
  const database = getDb();
  if (!database) return null;

  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  database.insert(schema.coverLetters).values({
    id,
    resumeId: data.resumeId,
    jobDescription: data.jobDescription,
    content: data.content,
  }).run();

  return id;
}

/**
 * Close the database connection gracefully
 */
export function closeDb() {
  if (sqliteDb) {
    sqliteDb.close();
    sqliteDb = null;
    db = null;
  }
}

// For in-memory fallback
import { generateId } from "./utils";

const memoryStores: Record<string, Map<string, any>> = {
  users: new Map(),
  resumes: new Map(),
  analyses: new Map(),
  coverLetters: new Map(),
};

export const memoryDb = {
  saveAnalysis(analysis: {
    resumeId: string;
    jobDescription: string;
    score: number;
    scoreBreakdown: { keywordMatch: number; relevance: number; impact: number; formatting: number };
    matchedKeywords: string[];
    missingKeywords: string[];
    missingSkills: { skill: string; reason: string }[];
    bulletRewrites: { original: string; improved: string; why: string }[];
    summary: string;
  }) {
    const id = generateId();
    memoryStores.analyses.set(id, { ...analysis, id });
    return id;
  },
  getAnalysis(id: string) {
    return memoryStores.analyses.get(id) ?? null;
  },
  listAnalyses() {
    return Array.from(memoryStores.analyses.values());
  },
};
