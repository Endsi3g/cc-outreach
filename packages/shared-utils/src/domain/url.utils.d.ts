/** Normalize a domain by stripping protocol, www and trailing slash. */
export declare function normalizeDomain(url: string): string;
/** Extract the root domain from a full URL. */
export declare function extractDomain(url: string): string | null;
/** Check if two URLs share the same root domain. */
export declare function sameDomain(a: string, b: string): boolean;
//# sourceMappingURL=url.utils.d.ts.map