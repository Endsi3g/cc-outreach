"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
exports.slugify = slugify;
exports.truncate = truncate;
/** Normalize a phone number to digits-only (E.164-ish). */
function normalizePhone(phone) {
    return phone.replace(/\D/g, '');
}
/** Slugify a company name for deduplication keys. */
function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
/** Truncate a string to maxLength with ellipsis. */
function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 1) + '…';
}
//# sourceMappingURL=string.utils.js.map