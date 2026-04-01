/**
 * Génère le prompt d'explication du scoring d'un prospect.
 */
export function buildScoringRationalePrompt(context: {
  companyName: string;
  scores: Record<string, number>;
  auditSummary?: string;
  signals: string[];
}): string {
  const scoreBlock = Object.entries(context.scores)
    .map(([k, v]) => `- ${k}: ${v}/100`)
    .join('\n');

  return `
Tu es un analyste de leads B2B. Explique en 2-3 phrases le scoring d'un prospect.

Entreprise: ${context.companyName}

Scores:
${scoreBlock}

Signaux observés:
${context.signals.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${context.auditSummary ? `Résumé audit: ${context.auditSummary}` : ''}

Explique de façon concise et factuelle pourquoi ce prospect reçoit ce score global.
Ne dis jamais "ce prospect perd de l'argent" ou d'autres affirmations non vérifiables.

Retourne UNIQUEMENT un objet JSON:
{
  "rationale": "Explication en 2-3 phrases...",
  "topStrength": "Point fort principal",
  "topWeakness": "Faiblesse principale"
}
`.trim();
}
