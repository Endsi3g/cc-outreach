import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SyncSchedulerService {
  private readonly logger = new Logger(SyncSchedulerService.name);

  constructor(
    @InjectQueue('gmail') private readonly gmailQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Run every 10 minutes to queue sync jobs for all users with Gmail connected.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async scheduleGmailSync() {
    this.logger.log('Scheduling Gmail sync jobs for all active users...');

    try {
      const users = await this.prisma.user.findMany({
        where: {
          gmailAccessToken: { not: null },
        },
        select: { id: true },
      });

      for (const user of users) {
        await this.gmailQueue.add('sync', { userId: user.id }, {
          removeOnComplete: true,
          removeOnFail: 1000,
        });
      }

      this.logger.log(`Queued sync jobs for ${users.length} users.`);
    } catch (error) {
      this.logger.error('Failed to schedule Gmail sync jobs', error.stack);
    }
  }
}
