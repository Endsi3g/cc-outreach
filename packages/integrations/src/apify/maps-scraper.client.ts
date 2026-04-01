import { ApifyClient } from 'apify-client';

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
  location?: { lat: number; lng: number };
  rating?: number;
  reviewsCount?: number;
  [key: string]: any;
}

export class GoogleMapsScraperClient {
  private client: ApifyClient;

  constructor(apiKey: string) {
    this.client = new ApifyClient({ token: apiKey });
  }

  async runScraper(options: MapsScrapingTaskOptions): Promise<GoogleMapsResult[]> {
    const actId = 'compass/google-maps-extractor'; // Or any specific Apify actor for G-Maps
    
    const input = {
      searchStringsArray: options.searchTerms.map(t => `${t} in ${options.location}`),
      maxCrawledPlacesPerSearch: options.maxResults ?? 20,
      language: 'fr',
      proxyConfig: { useApifyProxy: true },
      // Other configurable actor inputs here...
    };

    const run = await this.client.actor(actId).call(input);
    const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

    return items as GoogleMapsResult[];
  }
}
