/**
 * Score Calculator Service
 * 
 * Computes and formats match scores with detailed breakdowns.
 */

export interface ScoreBreakdown {
  overall: number;
  exactMatches: number;
  stemMatches: number;
  partialMatches: number;
  missingCritical: number;
  categoryScores: Record<string, number>;
}

/**
 * Calculate a detailed score breakdown
 */
export function calculateScoreBreakdown(
  matchedKeywords: { term: string; category: string; weight: number }[],
  missingKeywords: { term: string; category: string; importance: number }[]
): ScoreBreakdown {
  const totalMatched = matchedKeywords.length;
  const totalMissing = missingKeywords.length;
  const totalKeywords = totalMatched + totalMissing;

  // Category-specific scoring
  const categoryScores: Record<string, number> = {};
  const categoryTotals: Record<string, number> = {};

  for (const kw of matchedKeywords) {
    const cat = kw.category;
    categoryScores[cat] = (categoryScores[cat] ?? 0) + kw.weight;
    categoryTotals[cat] = (categoryTotals[cat] ?? 0) + kw.weight;
  }

  for (const kw of missingKeywords) {
    const cat = kw.category;
    categoryTotals[cat] = (categoryTotals[cat] ?? 0) + kw.importance;
  }

  // Calculate category percentages
  const categoryPercentages: Record<string, number> = {};
  for (const [cat, total] of Object.entries(categoryTotals)) {
    const scored = categoryScores[cat] ?? 0;
    categoryPercentages[cat] = total > 0 ? Math.round((scored / total) * 100) : 0;
  }

  // Count by match type
  const exactMatches = matchedKeywords.filter(
    (k) => k.weight >= 1.8
  ).length;
  const stemMatches = matchedKeywords.filter(
    (k) => k.weight >= 1.3 && k.weight < 1.8
  ).length;
  const partialMatches = matchedKeywords.filter(
    (k) => k.weight < 1.3
  ).length;

  // Critical missing (high importance)
  const missingCritical = missingKeywords.filter(
    (k) => k.importance >= 1.5
  ).length;

  return {
    overall:
      totalKeywords > 0
        ? Math.round((totalMatched / totalKeywords) * 100)
        : 0,
    exactMatches,
    stemMatches,
    partialMatches,
    missingCritical,
    categoryScores: categoryPercentages,
  };
}

/**
 * Get a human-readable grade for a score
 */
export function scoreToGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 90) {
    return { grade: "A", label: "Excellent Match", color: "text-green-600" };
  } else if (score >= 75) {
    return {
      grade: "B",
      label: "Good Match",
      color: "text-blue-600",
    };
  } else if (score >= 60) {
    return {
      grade: "C",
      label: "Fair Match",
      color: "text-yellow-600",
    };
  } else if (score >= 40) {
    return {
      grade: "D",
      label: "Poor Match",
      color: "text-orange-600",
    };
  } else {
    return { grade: "F", label: "Needs Work", color: "text-red-600" };
  }
}
