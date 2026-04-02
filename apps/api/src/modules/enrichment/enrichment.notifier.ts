import { OnQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Processor('enrichment.company')
export class EnrichmentNotifier {
  private readonly logger = new Logger(EnrichmentNotifier.name);

  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  @OnQueueCompleted()
  async onCompleted(job: Job<{ workspaceId: string; companyId: string }>) {
    const { workspaceId, companyId } = job.data;
    this.logger.log(`Enrichment for company ${companyId} completed. Broadcasting to workspace ${workspaceId}`);
    
    this.realtimeGateway.broadcastToWorkspace(workspaceId, 'enrichment:completed', {
      companyId,
      status: 'SUCCESS',
    });
  }
}
