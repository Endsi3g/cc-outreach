import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface GmailConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  threadId?: string;
}

export class GmailClient {
  private readonly oauth2Client: OAuth2Client;

  constructor(config: GmailConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
  }

  getAuthUrl(scopes: string[]): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async getToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  async sendEmail(options: SendEmailOptions) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const utf8Subject = `=?utf-8?B?${Buffer.from(options.subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${options.to}`,
      `Subject: ${utf8Subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      options.body,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: options.threadId,
      },
    });

    return res.data;
  }

  async listThreads(q?: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const res = await gmail.users.threads.list({
      userId: 'me',
      q,
    });
    return res.data;
  }

  async getThread(threadId: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const res = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
      format: 'full',
    });
    return res.data;
  }

  async getProfile() {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    const res = await gmail.users.getProfile({
      userId: 'me',
    });
    return res.data;
  }

  /**
   * Helper to extract plain text body from a message payload
   */
  decodeBody(payload: any): string {
    if (payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64').toString();
    }
    if (payload.parts) {
      for (const part of payload.parts) {
        const result = this.decodeBody(part);
        if (result) return result;
      }
    }
    return '';
  }

  /**
   * Helper to extract a header value
   */
  getHeader(headers: any[], name: string): string {
    const header = headers.find((h) => h.name?.toLowerCase() === name.toLowerCase());
    return header?.value || '';
  }
}
