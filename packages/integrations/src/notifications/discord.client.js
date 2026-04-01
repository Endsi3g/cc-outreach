"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordClient = void 0;
const axios_1 = __importDefault(require("axios"));
class DiscordClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async sendEmbed(embed) {
        const res = await axios_1.default.post(this.config.webhookUrl, {
            embeds: [embed],
        });
        return res.data;
    }
    async sendMessage(content) {
        const res = await axios_1.default.post(this.config.webhookUrl, {
            content,
        });
        return res.data;
    }
}
exports.DiscordClient = DiscordClient;
//# sourceMappingURL=discord.client.js.map