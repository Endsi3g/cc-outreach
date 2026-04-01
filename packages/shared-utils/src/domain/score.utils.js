"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeGlobalScore = computeGlobalScore;
exports.scoreLabel = scoreLabel;
const WEIGHTS = {
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
function computeGlobalScore(scores) {
    const total = Object.entries(WEIGHTS).reduce((acc, [key, weight]) => {
        const value = scores[key] ?? 0;
        return acc + value * weight;
    }, 0);
    return Math.round(Math.min(100, Math.max(0, total)));
}
/**
 * Label a score for display purposes.
 */
function scoreLabel(score) {
    if (score < 30)
        return 'Faible';
    if (score < 55)
        return 'Moyen';
    if (score < 80)
        return 'Bon';
    return 'Excellent';
}
//# sourceMappingURL=score.utils.js.map