import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'scoring.compute' }),
  ],
  controllers: [ScoringController],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
