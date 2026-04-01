import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

import { GmailSyncScheduler } from './tasks/gmail-sync.scheduler';
import { ReminderScheduler } from './tasks/reminder.scheduler';
import { AnalyticsScheduler } from './tasks/analytics.scheduler';
import { QuotaWatchScheduler } from './tasks/quota-watch.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        password: process.env.REDIS_PASSWORD ?? undefined,
      },
    }),
  ],
  providers: [
    GmailSyncScheduler,
    ReminderScheduler,
    AnalyticsScheduler,
    QuotaWatchScheduler,
  ],
})
export class SchedulerAppModule {}
