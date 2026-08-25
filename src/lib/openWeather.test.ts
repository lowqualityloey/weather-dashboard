import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sanitizeNextUrl, fetchWeather } from './openWeather';

describe('sanitizeNextUrl', () => {
  it('returns https URL for valid OpenWeather http URL', () => {
    const raw = 'http://api.openweathermap.org/data/4.0/onecall/timemachine?page=2';
    const sanitized = sanitizeNextUrl(raw);
    expect(sanitized).toBe('https://api.openweathermap.org/data/4.0/onecall/timemachine?page=2');
  });

  it('preserves valid OpenWeather https URL', () => {
    const raw = 'https://api.openweathermap.org/data/4.0/onecall/timemachine?page=2';
    const sanitized = sanitizeNextUrl(raw);
    expect(sanitized).toBe('https://api.openweathermap.org/data/4.0/onecall/timemachine?page=2');
  });

  it('rejects untrusted domains', () => {
    expect(sanitizeNextUrl('https://evil.com/data/4.0/onecall')).toBeNull();
    expect(sanitizeNextUrl('http://attacker.org/phishing')).toBeNull();
    expect(sanitizeNextUrl('https://api.openweathermap.org.evil.com/test')).toBeNull();
  });

  it('handles invalid or non-string inputs gracefully', () => {
    expect(sanitizeNextUrl(null)).toBeNull();
    expect(sanitizeNextUrl(undefined)).toBeNull();
    expect(sanitizeNextUrl(123)).toBeNull();
    expect(sanitizeNextUrl('not a url')).toBeNull();
    expect(sanitizeNextUrl('javascript:alert(1)')).toBeNull();
  });

  it('strips credentials embedded in URL', () => {
    const raw = 'https://user:pass@api.openweathermap.org/data/4.0/onecall';
    const sanitized = sanitizeNextUrl(raw);
    expect(sanitized).toBe('https://api.openweathermap.org/data/4.0/onecall');
  });
});

describe('fetchWeather pagination security', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('fetches page 2 when next URL is on allowed domain', async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url === 'https://api.openweathermap.org/data/4.0/onecall/timeline/1h?page=2') {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: Array.from({ length: 14 }, (_, i) => ({
                dt: 10 + i,
                temp: 30 + i,
                weather: [],
              })),
            }),
            { status: 200 },
          ),
        );
      }
      if (url.includes('/current')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              timezone: 'UTC',
              timezone_offset: 0,
              data: [
                {
                  temp: 20,
                  feels_like: 19,
                  humidity: 50,
                  wind_speed: 5,
                  wind_deg: 180,
                  weather: [],
                },
              ],
            }),
            { status: 200 },
          ),
        );
      }
      if (url.includes('/timeline/1h')) {
        // Return 10 items and a next URL
        return Promise.resolve(
          new Response(
            JSON.stringify({
              next: 'http://api.openweathermap.org/data/4.0/onecall/timeline/1h?page=2',
              data: Array.from({ length: 10 }, (_, i) => ({ dt: i, temp: 20 + i, weather: [] })),
            }),
            { status: 200 },
          ),
        );
      }
      if (url.includes('/timeline/1day')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: [{ dt: 1, temp: { min: 10, max: 20 }, weather: [] }],
            }),
            { status: 200 },
          ),
        );
      }
      return Promise.reject(new Error(`Unexpected fetch URL: ${url}`));
    });

    globalThis.fetch = mockFetch;

    const weather = await fetchWeather(10, 20);
    expect(weather.hourly.length).toBe(24);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openweathermap.org/data/4.0/onecall/timeline/1h?page=2',
    );
  });

  it('ignores page 2 fetch if next URL points to an untrusted host', async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/current')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              timezone: 'UTC',
              timezone_offset: 0,
              data: [
                {
                  temp: 20,
                  feels_like: 19,
                  humidity: 50,
                  wind_speed: 5,
                  wind_deg: 180,
                  weather: [],
                },
              ],
            }),
            { status: 200 },
          ),
        );
      }
      if (url.includes('/timeline/1h')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              next: 'https://evil-malicious-site.com/exploit',
              data: Array.from({ length: 10 }, (_, i) => ({ dt: i, temp: 20 + i, weather: [] })),
            }),
            { status: 200 },
          ),
        );
      }
      if (url.includes('/timeline/1day')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: [{ dt: 1, temp: { min: 10, max: 20 }, weather: [] }],
            }),
            { status: 200 },
          ),
        );
      }
      return Promise.reject(new Error(`Unexpected fetch URL: ${url}`));
    });

    globalThis.fetch = mockFetch;

    const weather = await fetchWeather(10, 20);
    expect(weather.hourly.length).toBe(10);
    expect(mockFetch).not.toHaveBeenCalledWith('https://evil-malicious-site.com/exploit');
  });
});
