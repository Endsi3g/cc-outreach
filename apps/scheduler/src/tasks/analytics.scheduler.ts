import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AnalyticsScheduler {
  private readonly logger = new Logger(AnalyticsScheduler.name);

  @Cron('0 2 * * *') // 02:00 chaque nuit
  async aggregateDaily() {
    this.logger.log('[Scheduler] Agrégation analytics quotidienne...');
    // TODO: consolider sends, replies, open rates, time-to-reply
  }
}
