/**
 * Génère le prompt de résumé d'audit web à partir des signaux crawlés.
 */
export function buildWebsiteAuditSummaryPrompt(context: {
  url: string;
  title?: string;
  metaDescription?: string;
  h1?: string;
  pageCount?: number;
  hasContactForm?: boolean;
  hasPhoneVisible?: boolean;
  hasSSL?: boolean;
  techHints?: string[];
  seoSignals?: Record<string, unknown>;
}): string {
  return `
Tu es un analyste de présence web pour des PME québécoises dans le secteur des services.

DONNÉES CRAWLÉES POUR: ${context.url}
- Title: ${context.title ?? 'non détecté'}
- Meta description: ${context.metaDescription ?? 'absente'}
- H1: ${context.h1 ?? 'absent'}
- Pages estimées: ${context.pageCount ?? 'inconnu'}
- Formulaire de contact: ${context.hasContactForm ? 'oui' : 'non'}
- Téléphone visible: ${context.hasPhoneVisible ? 'oui' : 'non'}
- SSL: ${context.hasSSL ? 'oui' : 'non'}
- Technologies détectées: ${context.techHints?.join(', ') ?? 'aucune'}
- Signaux SEO: ${JSON.stringify(context.seoSignals ?? {})}

Génère un résumé factuel en 3-5 phrases qui identifie:
1. L'état général du site (moderne, daté, fonctionnel, cassé)
2. Les gaps principaux observables (SEO, contenu, CTA, contact)
3. Le niveau de maturité digitale apparent

Retourne UNIQUEMENT un objet JSON:
{
  "summary": "Résumé factuel...",
  "keyGaps": ["gap1", "gap2"],
  "maturityLevel": "FAIBLE|MOYEN|BON|EXCELLENT"
}
`.trim();
}
