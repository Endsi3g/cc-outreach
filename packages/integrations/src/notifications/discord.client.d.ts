export interface DiscordConfig {
    webhookUrl: string;
}
export declare class DiscordClient {
    private readonly config;
    constructor(config: DiscordConfig);
    sendEmbed(embed: any): Promise<any>;
    sendMessage(content: string): Promise<any>;
}
//# sourceMappingURL=discord.client.d.ts.map