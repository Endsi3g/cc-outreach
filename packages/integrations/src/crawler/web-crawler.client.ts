import axios from 'axios';
import * as cheerio from 'cheerio';
import { Agent } from 'https';

export interface WebAuditResult {
  url: string;
  title: string;
  metaDescription: string;
  headings: string[];
  mainText: string;
  detectedLanguage?: string;
  links: string[];
  socialLinks: string[];
}

export class WebCrawlerClient {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
      httpsAgent: new Agent({ rejectUnauthorized: false }), // In case of invalid SSLs on target sites
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
  }

  async crawl(url: string): Promise<WebAuditResult> {
    try {
      const response = await this.axiosInstance.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
      
      const headings: string[] = [];
      $('h1, h2').each((_, el) => {
        const text = $(el).text().trim();
        if (text) headings.push(text);
      });

      // Simple extraction strategy for body text
      $('script, style, noscript, nav, footer, header').remove();
      const rawText = $('body').text().replace(/\s+/g, ' ').trim();
      
      const detectedLanguage = $('html').attr('lang') || undefined;

      const links: string[] = [];
      $('a[href^="/"], a[href^="'+url+'"]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) links.push(href);
      });

      const socialLinks: string[] = [];
      $('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="linkedin.com"]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) socialLinks.push(href);
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
    } catch (e: any) {
      throw new Error(`Crawler failed for ${url}: ${e.message}`);
    }
  }
}
