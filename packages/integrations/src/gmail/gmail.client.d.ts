import { Auth } from 'googleapis';
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
export declare class GmailClient {
    private readonly oauth2Client;
    constructor(config: GmailConfig);
    getAuthUrl(scopes: string[]): string;
    getToken(code: string): Promise<Auth.Credentials>;
    setCredentials(tokens: any): void;
    sendEmail(options: SendEmailOptions): Promise<import("googleapis").gmail_v1.Schema$Message>;
    listThreads(q?: string): Promise<import("googleapis").gmail_v1.Schema$ListThreadsResponse>;
    getThread(threadId: string): Promise<import("googleapis").gmail_v1.Schema$Thread>;
    getProfile(): Promise<import("googleapis").gmail_v1.Schema$Profile>;
    /**
     * Helper to extract plain text body from a message payload
     */
    decodeBody(payload: any): string;
    /**
     * Helper to extract a header value
     */
    getHeader(headers: any[], name: string): string;
}
//# sourceMappingURL=gmail.client.d.ts.map