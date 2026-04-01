import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EnrichmentWorkerProcessor } from './enrichment-worker.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'enrichment.company' })],
  providers: [EnrichmentWorkerProcessor],
})
export class EnrichmentWorkerModule {}
