"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebCrawlerClient = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const https_1 = require("https");
class WebCrawlerClient {
    axiosInstance;
    constructor() {
        this.axiosInstance = axios_1.default.create({
            timeout: 10000,
            httpsAgent: new https_1.Agent({ rejectUnauthorized: false }), // In case of invalid SSLs on target sites
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        });
    }
    async crawl(url) {
        try {
            const response = await this.axiosInstance.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            const title = $('title').text().trim();
            const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
            const headings = [];
            $('h1, h2').each((_, el) => {
                const text = $(el).text().trim();
                if (text)
                    headings.push(text);
            });
            // Simple extraction strategy for body text
            $('script, style, noscript, nav, footer, header').remove();
            const rawText = $('body').text().replace(/\s+/g, ' ').trim();
            const detectedLanguage = $('html').attr('lang') || undefined;
            const links = [];
            $('a[href^="/"], a[href^="' + url + '"]').each((_, el) => {
                const href = $(el).attr('href');
                if (href)
                    links.push(href);
            });
            const socialLinks = [];
            $('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="linkedin.com"]').each((_, el) => {
                const href = $(el).attr('href');
                if (href)
                    socialLinks.push(href);
            });
            return {
                url,
                title,
                metaDescription,
                headings,
                mainText: rawText.substring(0, 5000), // Keep it within bounds for LLM
                detectedLanguage,
                links: Array.from(new Set(links)),
                socialLinks: Array.from(new Set(socialLinks)),
            };
        }
        catch (e) {
            throw new Error(`Crawler failed for ${url}: ${e.message}`);
        }
    }
}
exports.WebCrawlerClient = WebCrawlerClient;
//# sourceMappingURL=web-crawler.client.js.map