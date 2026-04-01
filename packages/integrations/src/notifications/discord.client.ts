import axios from 'axios';

export interface DiscordConfig {
  webhookUrl: string;
}

export class DiscordClient {
  private readonly config: DiscordConfig;

  constructor(config: DiscordConfig) {
    this.config = config;
  }

  async sendEmbed(embed: any) {
    const res = await axios.post(this.config.webhookUrl, {
      embeds: [embed],
    });
    return res.data;
  }

  async sendMessage(content: string) {
    const res = await axios.post(this.config.webhookUrl, {
      content,
    });
    return res.data;
  }
}
