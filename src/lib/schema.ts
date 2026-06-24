import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

/**
 * Database schema for ResuMatch AI
 * Uses SQLite via Drizzle ORM with better-sqlite3 driver
 */

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  plan: text("plan").notNull().default("free"),
  creditsRemaining: text("credits_remaining").notNull().default("5"),
  createdAt: text("created_at").notNull().default("datetime('now')"),
  updatedAt: text("updated_at").notNull().default("datetime('now')"),
});

export const resumes = sqliteTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  filename: text("filename").notNull(),
  originalText: text("original_text").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type", { enum: ["pdf", "docx", "txt"] }).notNull(),
  createdAt: text("created_at").notNull().default("datetime('now')"),
});

export const analyses = sqliteTable("analyses", {
  id: text("id").primaryKey(),
  resumeId: text("resume_id").references(() => resumes.id),
  jobDescription: text("job_description").notNull(),
  score: real("score").notNull(),
  keywordMatch: real("keyword_match").notNull(),
  relevance: real("relevance").notNull(),
  impact: real("impact").notNull(),
  formatting: real("formatting").notNull(),
  matchedKeywords: text("matched_keywords").notNull(), // JSON string array
  missingKeywords: text("missing_keywords").notNull(), // JSON string array
  missingSkills: text("missing_skills").notNull(), // JSON array of {skill, reason}
  bulletRewrites: text("bullet_rewrites"), // JSON array of {original, improved, why}
  summary: text("summary"),
  createdAt: text("created_at").notNull().default("datetime('now')"),
});

export const coverLetters = sqliteTable("cover_letters", {
  id: text("id").primaryKey(),
  resumeId: text("resume_id").references(() => resumes.id),
  jobDescription: text("job_description").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull().default("datetime('now')"),
});