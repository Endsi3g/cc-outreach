import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { GmailClient, TelegramClient, DiscordClient } from '@cc-outreach/integrations';
import { ActivityEventType, LeadStatus } from '@cc-outreach/database/src/generated';

@Processor('gmail')
export class GmailWorkerProcessor {
  private readonly logger = new Logger(GmailWorkerProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private getClient(): GmailClient {
    return new GmailClient({
      clientId: this.config.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: this.config.get<string>('GOOGLE_CLIENT_SECRET') || '',
      redirectUri: this.config.get<string>('GOOGLE_REDIRECT_URI') || '',
      scopes: (this.config.get<string>('GMAIL_SCOPES') || 'https://mail.google.com/').split(','),
    });
  }

  @Process('send')
  async handleSend(job: Job<{ userId: string; draftId: string }>) {
    const { userId, draftId } = job.data;
    this.logger.log(`[gmail.send] Starting send for draftId=${draftId}`);

    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.gmailAccessToken) {
        throw new Error(`User ${userId} Gmail not connected`);
      }

      const draft = await this.prisma.outreachDraft.findUnique({
        where: { id: draftId },
        include: { lead: { include: { company: true } }, contact: true },
      });

      if (!draft) throw new Error(`Draft ${draftId} not found`);

      const client = this.getClient();
      client.setCredentials({
        access_token: user.gmailAccessToken,
        refresh_token: user.gmailRefreshToken,
        expiry_date: user.gmailTokenExpiry?.getTime(),
      });

      const recipient = draft.contact?.email || draft.lead.company.email;
      if (!recipient) throw new Error('Recipient email missing');

      const res = await client.sendEmail({
        to: recipient,
        subject: draft.subject,
        body: draft.body,
      });

      await this.prisma.outreachDraft.update({
        where: { id: draftId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      await this.prisma.lead.update({
        where: { id: draft.leadId },
        data: { status: LeadStatus.SENT },
      });

      // Create activity
      await this.prisma.activity.create({
        data: {
          leadId: draft.leadId,
          userId,
          eventType: ActivityEventType.EMAIL_SENT,
          metadata: {
            draftId,
            gmailMessageId: res.id,
            gmailThreadId: res.threadId,
            recipient,
          },
        },
      });

      // Update or create Gmail thread record
      if (res.threadId) {
        await this.prisma.gmailThread.upsert({
          where: { gmailThreadId: res.threadId },
          update: { 
            updatedAt: new Date(),
            lastSyncedAt: new Date(),
          },
          create: {
            leadId: draft.leadId,
            gmailThreadId: res.threadId,
            subject: draft.subject,
            lastSyncedAt: new Date(),
          },
        });
      }

      this.logger.log(`[gmail.send] Successfully sent email for draftId=${draftId}`);
      } catch (error: any) {
      this.logger.error(`[gmail.send] Failed for draftId=${draftId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Process('sync')
  async handleSync(job: Job<{ userId: string }>) {
    const { userId } = job.data;
    this.logger.log(`[gmail.sync] Starting sync for userId=${userId}`);

    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.gmailAccessToken) return;

      const client = this.getClient();
      client.setCredentials({
        access_token: user.gmailAccessToken,
        refresh_token: user.gmailRefreshToken,
        expiry_date: user.gmailTokenExpiry?.getTime(),
      });

      // Find all threads for this user's leads
      const localThreads = await this.prisma.gmailThread.findMany({
        where: { lead: { ownerId: userId } },
      });

      for (const threadRecord of localThreads) {
        const thread = await client.getThread(threadRecord.gmailThreadId);
        if (!thread || !thread.messages) continue;

        const remoteMsgCount = thread.messages.length;
        if (remoteMsgCount > threadRecord.messageCount) {
          // New messages detected
          const lastMsg = thread.messages[thread.messages.length - 1];
          const snippet = lastMsg.snippet || '';
          const lastMessageAt = lastMsg.internalDate ? new Date(parseInt(lastMsg.internalDate)) : new Date();

          // Check if the last message is from the prospect (simple heuristic: not from current user's email)
          const fromHeader = client.getHeader(lastMsg.payload?.headers || [], 'From');
          const isReply = !fromHeader.includes(user.gmailEmail || '');

          await this.prisma.gmailThread.update({
            where: { id: threadRecord.id },
            data: {
              messageCount: remoteMsgCount,
              snippet,
              lastMessageAt,
              hasReply: threadRecord.hasReply || isReply,
              lastSyncedAt: new Date(),
            },
          });

          if (isReply && !threadRecord.hasReply) {
            // New reply detected!
            this.logger.log(`[gmail.sync] New reply detected for thread=${threadRecord.gmailThreadId}`);
            
            await this.prisma.lead.update({
              where: { id: threadRecord.leadId },
              data: { status: LeadStatus.REPLIED },
            });

            await this.prisma.activity.create({
              data: {
                leadId: threadRecord.leadId,
                userId,
                eventType: ActivityEventType.EMAIL_REPLIED,
                metadata: {
                  gmailThreadId: threadRecord.gmailThreadId,
                  snippet,
                },
              },
            });

            // Trigger notification
            await this.notifyReply(threadRecord.leadId, userId);
          }
        } else {
          // Just update sync time
          await this.prisma.gmailThread.update({
            where: { id: threadRecord.id },
            data: { lastSyncedAt: new Date() },
          });
        }
      }
    } catch (error: any) {
      this.logger.error(`[gmail.sync] Failed for userId=${userId}: ${error.message}`, error.stack);
    }
  }

  private async notifyReply(leadId: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: { company: true },
    });
    if (!lead) return;

    const telegramToken = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const telegramChatId = this.config.get<string>('TELEGRAM_CHAT_ID');
    const discordWebhookUrl = this.config.get<string>('DISCORD_WEBHOOK_URL');

    const message = `✉️ **Nouvelle réponse reçue !**\n\nEntreprise : **${lead.company.name}**\nLe lead a été marqué comme "REPLIED".\n\n[Voir dans le CRM](http://localhost:3000/leads/${lead.id})`;

    if (telegramToken && telegramChatId) {
      const tc = new TelegramClient({ botToken: telegramToken });
      await tc.sendMessage(telegramChatId, message).catch(() => {});
    }

    if (discordWebhookUrl) {
      const dc = new DiscordClient({ webhookUrl: discordWebhookUrl });
      await dc.sendMessage(message).catch(() => {});
    }
  }
}
