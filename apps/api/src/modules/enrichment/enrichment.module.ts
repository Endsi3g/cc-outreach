import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EnrichmentController } from './enrichment.controller';
import { EnrichmentService } from './enrichment.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'enrichment.company' }),
  ],
  controllers: [EnrichmentController],
  providers: [EnrichmentService],
  exports: [EnrichmentService],
})
export class EnrichmentModule {}
