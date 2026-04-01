export interface MapsScrapingTaskOptions {
    searchTerms: string[];
    location: string;
    maxResults?: number;
}
export interface GoogleMapsResult {
    title: string;
    website?: string;
    phone?: string;
    address?: string;
    categoryName?: string;
    location?: {
        lat: number;
        lng: number;
    };
    rating?: number;
    reviewsCount?: number;
    [key: string]: any;
}
export declare class GoogleMapsScraperClient {
    private client;
    constructor(apiKey: string);
    runScraper(options: MapsScrapingTaskOptions): Promise<GoogleMapsResult[]>;
}
//# sourceMappingURL=maps-scraper.client.d.ts.map