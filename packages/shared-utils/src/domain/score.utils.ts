import type { ScoreBreakdown } from '@cc-outreach/shared-types';

const WEIGHTS: Record<keyof Omit<ScoreBreakdown, 'globalScore'>, number> = {
  fitScore: 0.20,
  urgencyScore: 0.18,
  webGapScore: 0.12,
  seoGapScore: 0.10,
  contentMaturityScore: 0.10,
  digitalAiMaturityScore: 0.08,
  personalizationConfidenceScore: 0.12,
  contactabilityScore: 0.06,
  reputationSignalScore: 0.04,
};

/**
 * Compute weighted globalScore from individual sub-scores.
 * All sub-scores are expected in the 0–100 range.
 */
export function computeGlobalScore(scores: Omit<ScoreBreakdown, 'globalScore'>): number {
  const total = Object.entries(WEIGHTS).reduce((acc, [key, weight]) => {
    const value = scores[key as keyof typeof WEIGHTS] ?? 0;
    return acc + value * weight;
  }, 0);

  return Math.round(Math.min(100, Math.max(0, total)));
}

/**
 * Label a score for display purposes.
 */
export function scoreLabel(score: number): 'Faible' | 'Moyen' | 'Bon' | 'Excellent' {
  if (score < 30) return 'Faible';
  if (score < 55) return 'Moyen';
  if (score < 80) return 'Bon';
  return 'Excellent';
}
