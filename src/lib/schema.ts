/**
 * Database Schema Definition for ResuMatch AI
 * 
 * This schema defines the database tables for the application.
 * In Phase 1 (MVP), data is stored in-memory or flat files.
 * This schema serves as the target for migration to SQLite/Drizzle.
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: "free" | "premium" | "pay-per-credit";
  creditsRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  filename: string;
  originalText: string;
  filePath: string;
  fileType: "pdf" | "docx" | "txt";
  createdAt: string;
}

export interface Analysis {
  id: string;
  resumeId: string;
  jobDescription: string;
  matchScore: number;
  matchedKeywords: string; // JSON array
  missingKeywords: string; // JSON array
  suggestions: string | null; // JSON array
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  resumeId: string;
  jobDescription: string;
  content: string;
  createdAt: string;
}