import { createHash } from 'crypto';

/** SHA-256 hash of any JSON-serializable value. Used for prompt inputHash tracking. */
export function hashJson(value: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify(value))
    .digest('hex')
    .slice(0, 16);
}

/** SHA-256 hash of a plain string. */
export function hashString(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}
