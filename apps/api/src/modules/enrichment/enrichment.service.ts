import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EnrichmentService {
  private readonly logger = new Logger(EnrichmentService.name);

  constructor(
    @InjectQueue('enrichment.company') private readonly enrichmentQueue: Queue,
  ) {}

  async triggerEnrichment(companyId: string) {
    this.logger.log(`Queueing enrichment for company: ${companyId}`);
    await this.enrichmentQueue.add({ companyId }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
    });
    return { success: true, companyId, message: 'Enrichment queued successfully' };
  }
}
