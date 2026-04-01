/** Normalize a domain by stripping protocol, www and trailing slash. */
export function normalizeDomain(url: string): string {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .split('/')[0];
}

/** Extract the root domain from a full URL. */
export function extractDomain(url: string): string | null {
  try {
    const { hostname } = new URL(url.startsWith('http') ? url : `https://${url}`);
    return hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Check if two URLs share the same root domain. */
export function sameDomain(a: string, b: string): boolean {
  return normalizeDomain(a) === normalizeDomain(b);
}
