import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient, DiscordClient } from '@cc-outreach/integrations';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private telegramClient: TelegramClient | null = null;
  private discordClient: DiscordClient | null = null;

  constructor(private readonly config: ConfigService) {
    const telegramToken = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    if (telegramToken) {
      this.telegramClient = new TelegramClient({ botToken: telegramToken });
    }

    const discordWebhookUrl = this.config.get<string>('DISCORD_WEBHOOK_URL');
    if (discordWebhookUrl) {
      this.discordClient = new DiscordClient({ webhookUrl: discordWebhookUrl });
    }
  }

  async notify(message: string) {
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

    if (this.telegramClient && chatId) {
      try {
        await this.telegramClient.sendMessage(chatId, message);
      } catch (err) {
        this.logger.error('Failed to send Telegram notification', err);
      }
    }

    if (this.discordClient) {
      try {
        await this.discordClient.sendMessage(message);
      } catch (err) {
        this.logger.error('Failed to send Discord notification', err);
      }
    }
  }

  async notifyLeadQualified(leadName: string, companyName: string) {
    const message = `🚀 <b>Nouveau Lead Qualifié !</b>\n\n<b>Entreprise:</b> ${companyName}\n<b>Contact:</b> ${leadName}\n\n<i>Le pipeline a été mis à jour dans cc-outreach.</i>`;
    return this.notify(message);
  }

  async notifyReplyReceived(companyName: string) {
    const message = `📥 <b>Réponse Reçue !</b>\n\nL'entreprise <b>${companyName}</b> a répondu à votre email. Vérifiez le dashboard.`;
    return this.notify(message);
  }
}
