/** Generate a unique ID */
export function generateId(): string {
  return crypto.randomUUID?.() ?? 
    `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/** Format a date string to locale */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Sanitize text for processing */
export function sanitizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}