interface CacheEntry<T> {
  data: T;
  expiry: number; // Unix timestamp in ms
}

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes
const CACHE_PREFIX = 'weather_v4_';

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      expiry: Date.now() + ttlMs,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (err) {
    console.warn('Failed to write to cache:', err);
  }
}
