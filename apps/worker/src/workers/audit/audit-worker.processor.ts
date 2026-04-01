// @ts-nocheck
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { WebCrawlerClient } from '@cc-outreach/integrations';

@Processor('audit.website')
export class AuditWorkerProcessor {
  private readonly logger = new Logger(AuditWorkerProcessor.name);
  private readonly crawler = new WebCrawlerClient();

  constructor(private readonly prisma: PrismaService) {}

  @Process()
  async handle(job: Job<{ companyId: string; url: string }>) {
    const { companyId, url } = job.data;
    this.logger.log(`[audit.website] Crawl companyId=${companyId} url=${url}`);

    try {
      const result = await this.crawler.crawl(url);
      
      this.logger.log(`Success crawling ${url}. Found ${result.headings.length} headings.`);

      await this.prisma.$transaction(async (tx) => {
        // Find existing audit
        const existingAudit = await tx.websiteAudit.findFirst({
          where: { companyId }
        });

        if (existingAudit) {
          await tx.websiteAudit.update({
            where: { id: existingAudit.id },
            data: {
              scrapedText: result.mainText,
              loadTimeMs: 0, // Placeholder
              seoScore: 0,   // Placeholder to be populated by AiWorker
            }
          });
        } else {
          await tx.websiteAudit.create({
            data: {
              companyId,
              url,
              scrapedText: result.mainText,
              loadTimeMs: 0,
              uxScore: 0,
              seoScore: 0,
              mobileParams: {},
              desktopParams: {},
            }
          });
        }
        
        // Also fire off AI summarization job or flag it for next worker stage
      });

    } catch (e: any) {
      this.logger.error(`Erreur crawl sur ${url}: ${e.message}`);
    }
  }
}
