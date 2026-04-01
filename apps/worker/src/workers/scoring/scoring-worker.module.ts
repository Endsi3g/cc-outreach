import { Module } from '@nestjs/common'; import { BullModule } from '@nestjs/bull'; import { ScoringWorkerProcessor } from './scoring-worker.processor';
@Module({ imports: [BullModule.registerQueue({ name: 'scoring.compute' })], providers: [ScoringWorkerProcessor] })
export class ScoringWorkerModule {}
