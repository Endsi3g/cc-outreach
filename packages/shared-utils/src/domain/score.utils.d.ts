import type { ScoreBreakdown } from '@cc-outreach/shared-types';
/**
 * Compute weighted globalScore from individual sub-scores.
 * All sub-scores are expected in the 0–100 range.
 */
export declare function computeGlobalScore(scores: Omit<ScoreBreakdown, 'globalScore'>): number;
/**
 * Label a score for display purposes.
 */
export declare function scoreLabel(score: number): 'Faible' | 'Moyen' | 'Bon' | 'Excellent';
//# sourceMappingURL=score.utils.d.ts.map