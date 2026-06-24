export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ["pdf", "docx", "txt"] as const,
  UPLOAD_DIR: "uploads",

  // Free tier limits
  FREE_ANALYSES_PER_USER: 1,
  FREE_CREDITS: 5,

  // Subscription pricing
  PREMIUM_PRICE: 15, // $/month
  PAY_PER_CREDIT_PRICE: 5, // $/optimization

  // AI Provider (set via environment variables)
  AI_PROVIDER: (process.env.OPENAI_API_KEY ? "openai" : "gemini") as
    | "openai"
    | "gemini",

  // Scoring weights
  SCORING: {
    EXACT_MATCH_WEIGHT: 2.0,
    STEM_MATCH_WEIGHT: 1.5,
    SYNONYM_MATCH_WEIGHT: 1.0,
    CONTEXT_MATCH_WEIGHT: 1.2,
  },
} as const;