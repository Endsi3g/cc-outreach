import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

import { EnrichmentWorkerModule } from './workers/enrichment/enrichment-worker.module';
import { AuditWorkerModule } from './workers/audit/audit-worker.module';
import { ScoringWorkerModule } from './workers/scoring/scoring-worker.module';
import { OutreachWorkerModule } from './workers/outreach/outreach-worker.module';
import { GmailWorkerModule } from './workers/gmail/gmail-worker.module';
import { NotificationWorkerModule } from './workers/notification/notification-worker.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        password: process.env.REDIS_PASSWORD ?? undefined,
      },
    }),
    ScheduleModule.forRoot(),
    EnrichmentWorkerModule,
    AuditWorkerModule,
    ScoringWorkerModule,
    OutreachWorkerModule,
    GmailWorkerModule,
    NotificationWorkerModule,
  ],
})
export class WorkerAppModule {}
