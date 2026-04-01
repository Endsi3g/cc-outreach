import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GmailSyncScheduler {
  private readonly logger = new Logger(GmailSyncScheduler.name);

  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncThreads() {
    this.logger.log('[Scheduler] Sync Gmail threads...');
    // TODO: émettre jobs gmail.sync pour tous les users connectés
  }
}
