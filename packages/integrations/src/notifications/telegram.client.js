"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramClient = void 0;
const axios_1 = __importDefault(require("axios"));
class TelegramClient {
    baseUrl;
    constructor(config) {
        this.baseUrl = `https://api.telegram.org/bot${config.botToken}`;
    }
    async sendMessage(chatId, text) {
        const url = `${this.baseUrl}/sendMessage`;
        const res = await axios_1.default.post(url, {
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
        });
        return res.data;
    }
}
exports.TelegramClient = TelegramClient;
//# sourceMappingURL=telegram.client.js.map