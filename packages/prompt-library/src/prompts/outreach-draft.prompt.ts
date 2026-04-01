/**
 * Génère le prompt de création d'un draft email de cold outreach.
 * Respecte le contrat agent.md: structure 5 étapes, 80-160 mots, un seul angle.
 */
export function buildOutreachDraftPrompt(context: {
  companyName: string;
  niche: string;
  city: string;
  website?: string;
  auditSummary?: string;
  primaryAngle: string;
  evidencePoints: string[];
  language: 'FR' | 'EN';
  scoreContext?: string;
}): string {
  const { companyName, niche, city, website, auditSummary, primaryAngle, evidencePoints, language, scoreContext } = context;

  const evidenceBlock = evidencePoints.map((e, i) => `${i + 1}. ${e}`).join('\n');

  return `
Tu es un agent de prospection B2B local pour le marché québécois. Tu dois rédiger UN email de cold outreach court, crédible et personnalisé.

ENTREPRISE:
- Nom: ${companyName}
- Secteur: ${niche}
- Ville: ${city}
${website ? `- Site web: ${website}` : ''}
${auditSummary ? `- Résumé d'audit web: ${auditSummary}` : ''}
${scoreContext ? `- Contexte de scoring: ${scoreContext}` : ''}

ANGLE PRINCIPAL CHOISI: ${primaryAngle}

PREUVES OBSERVÉES (à utiliser comme base):
${evidenceBlock}

RÈGLES STRICTES:
- Langue: ${language === 'FR' ? 'FRANÇAIS QUÉBÉCOIS' : 'ENGLISH (Canadian)'}
- 80 à 160 mots maximum pour le corps
- Structure: (1) ouverture contextualisée, (2) preuve observée, (3) hypothèse de besoin prudente, (4) proposition simple, (5) CTA léger
- UN seul angle principal, zéro liste à puces dans l'email
- Aucune promesse exagérée, aucun faux compliment, aucune affirmation non vérifiée
- Ton: direct, professionnel, local, non robotique

Retourne UNIQUEMENT un objet JSON avec cette structure exacte:
{
  "subject": "Objet de l'email",
  "body": "Corps complet de l'email",
  "estimatedWordCount": 120,
  "angleUsed": "${primaryAngle}",
  "evidenceUsed": ["..."]
}
`.trim();
}
