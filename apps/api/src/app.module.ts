import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { envValidationSchema } from '@cc-outreach/config';

// ── Modules ────────────────────────────────────────────────────────────────
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { EnrichmentModule } from './modules/enrichment/enrichment.module';
import { WebsiteAuditModule } from './modules/website-audit/website-audit.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { AiModule } from './modules/ai/ai.module';
import { OutreachModule } from './modules/outreach/outreach.module';
import { GmailModule } from './modules/gmail/gmail.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CrmModule } from './modules/crm/crm.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './modules/database/database.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SearchModule } from './modules/search/search.module';
import { FilesModule } from './modules/files/files.module';
import { ObservabilityModule } from './modules/observability/observability.module';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
      validationSchema: envValidationSchema,
    }),

    // ── Rate limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // ── Queue broker ────────────────────────────────────────────────────────
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        password: process.env.REDIS_PASSWORD ?? undefined,
      },
    }),

    // ── Domain modules ──────────────────────────────────────────────────────
    DatabaseModule,
    AuthModule,
    UsersModule,
    LeadsModule,
    CompaniesModule,
    ContactsModule,
    EnrichmentModule,
    WebsiteAuditModule,
    ScoringModule,
    AiModule,
    OutreachModule,
    GmailModule,
    CampaignsModule,
    CrmModule,
    ActivitiesModule,
    RemindersModule,
    NotificationsModule,
    HealthModule,
    AnalyticsModule,
    SearchModule,
    FilesModule,
    ObservabilityModule,
  ],
})
export class AppModule {}
