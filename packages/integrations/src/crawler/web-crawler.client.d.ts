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
export declare class WebCrawlerClient {
    private axiosInstance;
    constructor();
    crawl(url: string): Promise<WebAuditResult>;
}
//# sourceMappingURL=web-crawler.client.d.ts.map