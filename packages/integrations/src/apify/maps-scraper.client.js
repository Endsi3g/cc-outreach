"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleMapsScraperClient = void 0;
const apify_client_1 = require("apify-client");
class GoogleMapsScraperClient {
    client;
    constructor(apiKey) {
        this.client = new apify_client_1.ApifyClient({ token: apiKey });
    }
    async runScraper(options) {
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
        return items;
    }
}
exports.GoogleMapsScraperClient = GoogleMapsScraperClient;
//# sourceMappingURL=maps-scraper.client.js.map