export interface TelegramConfig {
    botToken: string;
}
export declare class TelegramClient {
    private readonly baseUrl;
    constructor(config: TelegramConfig);
    sendMessage(chatId: string, text: string): Promise<any>;
}
//# sourceMappingURL=telegram.client.d.ts.map