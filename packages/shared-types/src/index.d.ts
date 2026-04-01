export type LeadStatus = 'NEW' | 'ENRICHING' | 'ENRICHED' | 'SCORING' | 'SCORED' | 'OUTREACH_DRAFT' | 'OUTREACH_READY' | 'SENT' | 'REPLIED' | 'QUALIFIED' | 'DISQUALIFIED' | 'LOST' | 'WON';
export type PipelineStage = 'COLD' | 'CONTACTED' | 'ENGAGED' | 'MEETING' | 'PROPOSAL' | 'CLOSED_WON' | 'CLOSED_LOST';
export type CompanyNiche = 'CONSTRUCTION' | 'TOITURE' | 'EXCAVATION' | 'HVAC' | 'ELECTRICITE' | 'PLOMBERIE' | 'PORTES_FENETRES' | 'RENOVATION' | 'PAYSAGEMENT' | 'OTHER';
export type CompanyRegion = 'MONTREAL' | 'LAVAL' | 'RIVE_SUD' | 'RIVE_NORD' | 'QUEBEC_CITY' | 'ESTRIE' | 'LANAUDIERE' | 'OUTAOUAIS' | 'OTHER_QC';
export type ContactRole = 'OWNER' | 'MANAGER' | 'SALES' | 'ADMIN' | 'TECHNICIAN' | 'UNKNOWN';
export type ContactConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type SourceType = 'GOOGLE_MAPS' | 'WEBSITE' | 'LINKEDIN_PUBLIC' | 'ANNUAIRE' | 'REGISTRE_NEQ' | 'GOOGLE_REVIEWS' | 'MANUAL';
export interface ScoreBreakdown {
    fitScore: number;
    urgencyScore: number;
    webGapScore: number;
    seoGapScore: number;
    contentMaturityScore: number;
    digitalAiMaturityScore: number;
    personalizationConfidenceScore: number;
    contactabilityScore: number;
    reputationSignalScore: number;
    globalScore: number;
}
export type OutreachLanguage = 'FR' | 'EN';
export type OutreachAngle = 'SITE_VIEILLISSANT' | 'CONTENU_INSUFFISANT' | 'MANQUE_PREUVES_TRAVAUX' | 'STRUCTURE_LOCALE_FAIBLE' | 'CTA_PEU_VISIBLE' | 'SUIVI_LEAD' | 'SEO_LOCAL' | 'CONVERSION' | 'AUTOMATISATION' | 'OTHER';
export type OutreachStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'SENT' | 'FAILED';
export type ComplianceFlag = 'LOW_CONFIDENCE_CONTACT' | 'LOW_PERSONALIZATION_CONFIDENCE' | 'INSUFFICIENT_PUBLIC_EVIDENCE' | 'POTENTIAL_PRIVACY_RISK' | 'TRACKING_REQUIRES_REVIEW' | 'GMAIL_QUOTA_RISK' | 'LANGUAGE_AMBIGUITY' | 'WEBSITE_AUDIT_INSUFFICIENT';
export type ActivityEventType = 'LEAD_IMPORTED' | 'ENRICHMENT_STARTED' | 'ENRICHMENT_COMPLETED' | 'AUDIT_STARTED' | 'AUDIT_COMPLETED' | 'SCORING_COMPLETED' | 'DRAFT_GENERATED' | 'DRAFT_APPROVED' | 'EMAIL_SENT' | 'EMAIL_REPLIED' | 'STAGE_CHANGED' | 'NOTE_ADDED' | 'REMINDER_SET' | 'HUMAN_REVIEW_REQUIRED';
export type JobName = 'enrichment.company' | 'audit.website' | 'scoring.compute' | 'outreach.generate' | 'gmail.send' | 'gmail.sync' | 'notification.send' | 'analytics.aggregate';
export type JobStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'DELAYED';
export type AiProvider = 'OLLAMA' | 'GROQ' | 'OPENROUTER';
export interface AiRunMeta {
    promptVersion: string;
    provider: AiProvider;
    model: string;
    temperature: number;
    inputHash: string;
    outputSchemaVersion: string;
    durationMs: number;
}
//# sourceMappingURL=index.d.ts.map