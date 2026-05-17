import { createHash } from 'crypto';

const WINDOW_MS = 60 * 60 * 1000;

class ViewDebouncer {
  private readonly store = new Map<string, Map<string, number>>();

  shouldCount(resourceId: string, ipOrFingerprint: string): boolean {
    const hash = createHash('sha256').update(ipOrFingerprint).digest('hex').slice(0, 16);
    const now = Date.now();

    let bucket = this.store.get(resourceId);
    if (!bucket) {
      bucket = new Map();
      this.store.set(resourceId, bucket);
    }

    const last = bucket.get(hash);
    if (last && now - last < WINDOW_MS) return false;

    bucket.set(hash, now);

    if (bucket.size > 5000) {
      for (const [k, ts] of bucket) {
        if (now - ts > WINDOW_MS) bucket.delete(k);
      }
    }
    return true;
  }
}

export const viewDebouncer = new ViewDebouncer();
