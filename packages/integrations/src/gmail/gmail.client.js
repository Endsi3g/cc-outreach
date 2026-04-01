"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailClient = void 0;
const googleapis_1 = require("googleapis");
class GmailClient {
    oauth2Client;
    constructor(config) {
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri);
    }
    getAuthUrl(scopes) {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
        });
    }
    async getToken(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }
    setCredentials(tokens) {
        this.oauth2Client.setCredentials(tokens);
    }
    async sendEmail(options) {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth: this.oauth2Client });
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
    async listThreads(q) {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth: this.oauth2Client });
        const res = await gmail.users.threads.list({
            userId: 'me',
            q,
        });
        return res.data;
    }
    async getThread(threadId) {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth: this.oauth2Client });
        const res = await gmail.users.threads.get({
            userId: 'me',
            id: threadId,
            format: 'full',
        });
        return res.data;
    }
    async getProfile() {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth: this.oauth2Client });
        const res = await gmail.users.getProfile({
            userId: 'me',
        });
        return res.data;
    }
    /**
     * Helper to extract plain text body from a message payload
     */
    decodeBody(payload) {
        if (payload.body?.data) {
            return Buffer.from(payload.body.data, 'base64').toString();
        }
        if (payload.parts) {
            for (const part of payload.parts) {
                const result = this.decodeBody(part);
                if (result)
                    return result;
            }
        }
        return '';
    }
    /**
     * Helper to extract a header value
     */
    getHeader(headers, name) {
        const header = headers.find((h) => h.name?.toLowerCase() === name.toLowerCase());
        return header?.value || '';
    }
}
exports.GmailClient = GmailClient;
//# sourceMappingURL=gmail.client.js.map