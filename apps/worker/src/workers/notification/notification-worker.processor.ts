import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { TelegramClient, DiscordClient } from '@cc-outreach/integrations';

@Processor('notification')
export class NotificationWorkerProcessor {
  private readonly logger = new Logger(NotificationWorkerProcessor.name);

  constructor(private readonly config: ConfigService) {}

  @Process('send')
  async handleSend(job: Job<{ channel: 'TELEGRAM' | 'DISCORD'; message: string; recipient?: string }>) {
    const { channel, message, recipient } = job.data;
    this.logger.log(`[notification.send] Sending to ${channel}...`);

    try {
      if (channel === 'TELEGRAM') {
        const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
        const chatId = recipient || this.config.get<string>('TELEGRAM_CHAT_ID');
        if (!token || !chatId) {
          throw new Error('Telegram configuration missing');
        }
        const client = new TelegramClient({ botToken: token });
        await client.sendMessage(chatId, message);
      } else if (channel === 'DISCORD') {
        const webhookUrl = recipient || this.config.get<string>('DISCORD_WEBHOOK_URL');
        if (!webhookUrl) {
          throw new Error('Discord configuration missing');
        }
        const client = new DiscordClient({ webhookUrl });
        await client.sendMessage(message);
      }
      this.logger.log(`[notification.send] Successfully sent message to ${channel}`);
    } catch (error: unknown) {
      this.logger.error(`[notification.send] Failed to send to ${channel}: ${(error as Error).message}`);
      throw error;
    }
  }
}
