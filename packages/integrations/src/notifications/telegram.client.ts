import axios from 'axios';

export interface TelegramConfig {
  botToken: string;
}

export class TelegramClient {
  private readonly baseUrl: string;

  constructor(config: TelegramConfig) {
    this.baseUrl = `https://api.telegram.org/bot${config.botToken}`;
  }

  async sendMessage(chatId: string, text: string) {
    const url = `${this.baseUrl}/sendMessage`;
    const res = await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });
    return res.data;
  }
}
