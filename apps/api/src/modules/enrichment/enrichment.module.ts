import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EnrichmentController } from './enrichment.controller';
import { EnrichmentService } from './enrichment.service';
import { EnrichmentNotifier } from './enrichment.notifier';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'enrichment.company' }),
    RealtimeModule,
  ],
  controllers: [EnrichmentController],
  providers: [EnrichmentService, EnrichmentNotifier],
  exports: [EnrichmentService],
})
export class EnrichmentModule {}
