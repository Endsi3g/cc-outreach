// @ts-nocheck
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../database/prisma.service';
import { GoogleMapsScraperClient } from '@cc-outreach/integrations';
import { normalizeDomain, hashJson } from '@cc-outreach/shared-utils';

@Processor('enrichment.company')
export class EnrichmentWorkerProcessor {
  private readonly logger = new Logger(EnrichmentWorkerProcessor.name);

  // Instantiate scraper client directly for MVP
  private readonly mapsScraper = new GoogleMapsScraperClient(
    process.env.APIFY_API_TOKEN ?? ''
  );

  constructor(private readonly prisma: PrismaService) {}

  @Process()
  async handle(job: Job<{ workspaceId: string; companyId: string }>) {
    const { workspaceId, companyId } = job.data;
    this.logger.log(`[enrichment.company] Traitement workspaceId=${workspaceId} companyId=${companyId}`);
    
    // 1. Fetch Company
    const company = await this.prisma.company.findUnique({
      where: { id: companyId, workspaceId }
    });

    if (!company) {
      this.logger.error(`Company not found: ${job.data.companyId}`);
      return;
    }

    // 2. Perform maps scraping
    const searchTerm = `${company.name} ${company.niche || ''}`.trim();
    const location = company.region || 'Quebec';

    this.logger.log(`Recherche : "${searchTerm}" dans "${location}"`);
    const results = await this.mapsScraper.runScraper({
      searchTerms: [searchTerm],
      location,
      maxResults: 3
    });

    if (results.length === 0) {
      this.logger.log('Aucun résultat Maps trouvé.');
      return;
    }

    // 3. Extract the best match (first hit)
    const bestMatch = results[0];
    
    await this.prisma.$transaction(async (tx) => {
      // Create source
      const payloadHash = hashJson(JSON.stringify(bestMatch));
      const source = await tx.source.create({
        data: {
          type: 'GOOGLE_MAPS',
          url: bestMatch.website || bestMatch.url || '',
          data: bestMatch,
          payloadHash,
          companyId: company.id,
          workspaceId,
        }
      });

      // Update Company with enriched metadata
      await tx.company.update({
        where: { id: company.id },
        data: {
          websiteUrl: company.websiteUrl || bestMatch.website,
          rawDomain: company.rawDomain || (bestMatch.website ? normalizeDomain(bestMatch.website) : undefined),
        }
      });
      
      // If phone found and missing in Company contacts, add it as generic info in notes
      if (bestMatch.phone) {
        // Optionally insert into Contact or update notes for MVP
      }

      this.logger.log(`Company ${company.name} enrichi via source ID = ${source.id}`);
    });
  }
}
