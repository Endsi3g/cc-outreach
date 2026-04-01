import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReminderScheduler {
  private readonly logger = new Logger(ReminderScheduler.name);

  @Cron(CronExpression.EVERY_HOUR)
  async checkReminders() {
    this.logger.log('[Scheduler] Vérification des rappels...');
    // TODO: récupérer reminders dus, émettre notifications
  }
}
