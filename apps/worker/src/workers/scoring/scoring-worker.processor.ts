// @ts-nocheck
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { OllamaClient } from '@cc-outreach/integrations';
import { buildScoringRationalePrompt } from '@cc-outreach/prompt-library';

@Processor('scoring.compute')
export class ScoringWorkerProcessor {
  private readonly logger = new Logger(ScoringWorkerProcessor.name);
  private readonly aiClient = new OllamaClient();

  constructor(private readonly prisma: PrismaService) {}

  @Process()
  async handle(job: Job<{ companyId: string }>) {
    const { companyId } = job.data;
    this.logger.log(`[scoring.compute] Score companyId=${companyId}`);

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        websiteAudits: true,
        sources: true,
      }
    });

    if (!company) return;

    // Simulate heuristic compute for Phase 3 MVP
    const scores = {
      fitScore: 85,
      urgencyScore: company.websiteAudits?.length > 0 ? 60 : 90,
      seoGapScore: company.websiteAudits?.[0]?.seoScore ?? 50,
      personalizationConfidenceScore: company.sources?.length > 0 ? 80 : 30
    };

    const globalScore = Math.floor(
      (scores.fitScore + scores.urgencyScore + scores.seoGapScore) / 3
    );

    // Call Ollama for rationale
    const prompt = buildScoringRationalePrompt({
      companyName: company.name,
      scores,
      auditSummary: company.websiteAudits?.[0]?.scrapedText?.substring(0, 500),
      signals: ["Site web vérifié", "Analyse en attente", "Présence numérique détectée"]
    });

    try {
      this.logger.log(`Calling Ollama for rationale...`);
      const { data } = await this.aiClient.generateJson<{ rationale: string; topStrength: string; topWeakness: string }>({
        prompt,
      });

      // Update company
      await this.prisma.company.update({
        where: { id: companyId },
        data: {
          fitScore: scores.fitScore,
          urgencyScore: scores.urgencyScore,
          personalizationScore: scores.personalizationConfidenceScore,
          globalScore,
          notes: data.rationale,
        }
      });
      this.logger.log(`[scoring] Computed global = ${globalScore} for ${company.name}`);
      
    } catch (err: any) {
      this.logger.error(`Scoring AI error: ${err.message}`);
    }
  }
}
