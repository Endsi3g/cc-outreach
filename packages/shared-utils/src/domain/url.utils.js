"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDomain = normalizeDomain;
exports.extractDomain = extractDomain;
exports.sameDomain = sameDomain;
/** Normalize a domain by stripping protocol, www and trailing slash. */
function normalizeDomain(url) {
    return url
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .split('/')[0];
}
/** Extract the root domain from a full URL. */
function extractDomain(url) {
    try {
        const { hostname } = new URL(url.startsWith('http') ? url : `https://${url}`);
        return hostname.replace(/^www\./, '');
    }
    catch {
        return null;
    }
}
/** Check if two URLs share the same root domain. */
function sameDomain(a, b) {
    return normalizeDomain(a) === normalizeDomain(b);
}
//# sourceMappingURL=url.utils.js.map