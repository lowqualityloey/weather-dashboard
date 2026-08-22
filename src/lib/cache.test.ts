import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCache, setCache } from './cache';

describe('cache utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores and retrieves cached data before TTL expires', () => {
    setCache('test_key', { temp: 22 }, 10000);
    const result = getCache<{ temp: number }>('test_key');
    expect(result).toEqual({ temp: 22 });
  });

  it('returns null and clears item when cache is expired', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    setCache('expired_key', { temp: 15 }, 1000); // 1s TTL

    // Advance time past expiry
    vi.spyOn(Date, 'now').mockReturnValue(now + 2000);

    const result = getCache('expired_key');
    expect(result).toBeNull();
    expect(localStorage.getItem('weather_v4_expired_key')).toBeNull();
  });

  it('returns null for non-existent keys', () => {
    expect(getCache('unknown_key')).toBeNull();
  });
});
