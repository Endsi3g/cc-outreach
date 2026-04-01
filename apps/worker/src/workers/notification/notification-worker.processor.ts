import { Processor, Process } from '@nestjs/bull'; import { Logger } from '@nestjs/common'; import { Job } from 'bull';
@Processor('notification.send')
export class NotificationWorkerProcessor {
  private readonly logger = new Logger(NotificationWorkerProcessor.name);
  @Process()
  async handle(job: Job<{ channel: 'TELEGRAM' | 'DISCORD'; message: string }>) {
    this.logger.log(`[notification.send] ${job.data.channel}: ${job.data.message.slice(0, 60)}`);
    // TODO: Telegram bot API / Discord webhook
  }
}
