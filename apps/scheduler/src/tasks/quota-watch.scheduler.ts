import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QuotaWatchScheduler {
  private readonly logger = new Logger(QuotaWatchScheduler.name);

  @Cron(CronExpression.EVERY_HOUR)
  async checkGmailQuota() {
    this.logger.log('[Scheduler] Vérification quota Gmail...');
    // TODO: lire compteur Redis gmail:quota:daily, notifier si > 80%
  }
}
