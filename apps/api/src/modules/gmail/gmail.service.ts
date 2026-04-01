import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { GmailClient } from '@cc-outreach/integrations';
import { OutreachLanguage, OutreachAngle } from '@cc-outreach/database/src/generated';

@Injectable()
export class GmailService {
  private readonly logger = new Logger(GmailService.name);

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

  getAuthUrl(): string {
    const client = this.getClient();
    return client.getAuthUrl((this.config.get<string>('GMAIL_SCOPES') || 'https://mail.google.com/').split(','));
  }

  async handleCallback(code: string, userId: string) {
    const client = this.getClient();
    const tokens = await client.getToken(code);
    
    // Get profile to store the email
    client.setCredentials(tokens);
    const profile = await client.getProfile();

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        gmailAccessToken: tokens.access_token,
        gmailRefreshToken: tokens.refresh_token,
        gmailTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        gmailEmail: profile.emailAddress,
      },
    });

    this.logger.log(`Gmail account connected: ${profile.emailAddress} for user ${userId}`);
    return { email: profile.emailAddress };
  }

  async sendOutreach(userId: string, draftId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.gmailAccessToken) {
      throw new ConflictException('Gmail not connected');
    }

    const draft = await this.prisma.outreachDraft.findUnique({
      where: { id: draftId },
      include: { lead: { include: { company: true } }, contact: true },
    });

    if (!draft) {
      throw new NotFoundException('Draft not found');
    }

    const client = this.getClient();
    client.setCredentials({
      access_token: user.gmailAccessToken,
      refresh_token: user.gmailRefreshToken,
      expiry_date: user.gmailTokenExpiry?.getTime(),
    });

    const recipient = draft.contact?.email || draft.lead.company.email;
    if (!recipient) {
      throw new ConflictException('Recipient email missing');
    }

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
      data: { status: 'SENT' },
    });

    // Create Gmail thread record
    if (res.threadId) {
      await this.prisma.gmailThread.upsert({
        where: { gmailThreadId: res.threadId },
        update: { updatedAt: new Date() },
        create: {
          leadId: draft.leadId,
          gmailThreadId: res.threadId,
          subject: draft.subject,
        },
      });
    }

    return res;
  }

  async getThreads(leadId: string) {
    return this.prisma.gmailThread.findMany({
      where: { leadId },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
