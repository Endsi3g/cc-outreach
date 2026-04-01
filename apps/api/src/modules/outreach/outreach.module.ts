import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OutreachController } from './outreach.controller';
import { OutreachService } from './outreach.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'outreach.generate' }),
  ],
  controllers: [OutreachController],
  providers: [OutreachService],
  exports: [OutreachService],
})
export class OutreachModule {}
