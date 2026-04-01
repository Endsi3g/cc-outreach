/** Normalize a phone number to digits-only (E.164-ish). */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/** Slugify a company name for deduplication keys. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Truncate a string to maxLength with ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}
