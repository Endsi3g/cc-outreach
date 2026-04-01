// @ts-nocheck
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { OllamaClient } from '@cc-outreach/integrations';
import { buildOutreachDraftPrompt } from '@cc-outreach/prompt-library';

@Processor('outreach.generate')
export class OutreachWorkerProcessor {
  private readonly logger = new Logger(OutreachWorkerProcessor.name);
  private readonly aiClient = new OllamaClient();

  constructor(private readonly prisma: PrismaService) {}

  @Process()
  async handle(job: Job<{ leadId: string }>) {
    const { leadId } = job.data;
    this.logger.log(`[outreach.generate] Generate for leadId=${leadId}`);

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        company: {
          include: { websiteAudits: true, sources: true }
        },
      }
    });

    if (!lead || !lead.company) return;

    const company = lead.company;
    
    // Simplification for Phase 3:
    const language = 'FR';
    const primaryAngle = company.websiteUrl ? 'Amélioration UX/SEO' : 'Création de site web';
    const evidencePoints = company.websiteAudits?.length > 0 
      ? ['Site web existant mais lent ou peu optimisé']
      : ['Aucun site web détecté sur la fiche Map'];
      
    const prompt = buildOutreachDraftPrompt({
      companyName: company.name,
      niche: company.niche ?? 'Construction / Services',
      city: company.region ?? 'Québec',
      website: company.websiteUrl || undefined,
      auditSummary: company.websiteAudits?.[0]?.scrapedText?.substring(0, 300),
      primaryAngle,
      evidencePoints,
      language,
      scoreContext: `Global Score: ${company.globalScore}`
    });

    try {
      this.logger.log(`Appel Ollama pour générer le brouillon...`);
      const { data } = await this.aiClient.generateJson<{
        subject: string;
        body: string;
        estimatedWordCount: number;
        angleUsed: string;
      }>({ prompt });

      // Save generated draft in database
      await this.prisma.campaignDraft.create({
        data: {
          leadId: lead.id,
          subject: data.subject,
          bodyHtml: data.body, // or text logic
          language,
          angle: data.angleUsed,
          status: 'PENDING_REVIEW', // as per agent.md
          metadata: { wordCount: data.estimatedWordCount }
        }
      });
      
      this.logger.log(`Draft généré pour lead ${lead.id}`);

    } catch (err: any) {
      this.logger.error(`Erreur génération outreach: ${err.message}`);
    }
  }
}
