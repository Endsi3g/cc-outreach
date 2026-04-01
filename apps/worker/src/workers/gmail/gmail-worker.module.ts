import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { GmailWorkerProcessor } from './gmail-worker.processor';
import { SyncSchedulerService } from './sync-scheduler.service';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'gmail',
    }),
  ],
  providers: [GmailWorkerProcessor, SyncSchedulerService, PrismaService, ConfigService],
})
export class GmailWorkerModule {}
