import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { geocodeCity, fetchWeather, reverseGeocode } from './openWeather';

describe('openWeather client-side requests security', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('geocodeCity fetches from /api/weather and does not include appid in query params', async () => {
    mockFetch.mockImplementation(async (input: unknown) => {
      const url = String(input);
      if (url.startsWith('/api/weather/geo/1.0/direct')) {
        return new Response(
          JSON.stringify([{ name: 'Auckland', lat: -36.85, lon: 174.76, country: 'NZ' }]),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response('Not found', { status: 404 });
    });

    const result = await geocodeCity('Auckland');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const requestedUrl = String(mockFetch.mock.calls[0][0]);

    expect(requestedUrl).toBe('/api/weather/geo/1.0/direct?q=Auckland&limit=5');
    expect(requestedUrl).not.toContain('appid');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Auckland');
  });

  it('fetchWeather requests current, hourly, and daily endpoints through /api/weather without appid', async () => {
    const mockCurrent = { data: [{ temp: 20, feels_like: 19, humidity: 65, wind_speed: 10 }] };
    const mockHourly = { data: Array.from({ length: 24 }, (_, i) => ({ dt: i, temp: 20 })) };
    const mockDaily = {
      data: Array.from({ length: 5 }, (_, i) => ({ dt: i, temp: { min: 15, max: 25 } })),
    };

    mockFetch.mockImplementation(async (input: unknown) => {
      const url = String(input);
      if (url.includes('/current')) {
        return new Response(JSON.stringify(mockCurrent), { status: 200 });
      }
      if (url.includes('/timeline/1h')) {
        return new Response(JSON.stringify(mockHourly), { status: 200 });
      }
      if (url.includes('/timeline/1day')) {
        return new Response(JSON.stringify(mockDaily), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });

    const weather = await fetchWeather(-36.85, 174.76);

    expect(mockFetch).toHaveBeenCalledTimes(3);
    const urls = mockFetch.mock.calls.map((call) => String(call[0]));

    expect(urls[0]).toBe(
      '/api/weather/data/4.0/onecall/current?lat=-36.85&lon=174.76&units=metric',
    );
    expect(urls[1]).toBe(
      '/api/weather/data/4.0/onecall/timeline/1h?lat=-36.85&lon=174.76&units=metric',
    );
    expect(urls[2]).toBe(
      '/api/weather/data/4.0/onecall/timeline/1day?lat=-36.85&lon=174.76&units=metric',
    );

    urls.forEach((url) => {
      expect(url).not.toContain('appid');
    });

    expect(weather.current.temp).toBe(20);
  });

  it('reverseGeocode fetches through /api/weather without appid', async () => {
    mockFetch.mockImplementation(async (input: unknown) => {
      const url = String(input);
      if (url.startsWith('/api/weather/geo/1.0/reverse')) {
        return new Response(JSON.stringify([{ name: 'Taupō', lat: -38.68, lon: 176.07 }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not found', { status: 404 });
    });

    const name = await reverseGeocode(-38.68, 176.07);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const requestedUrl = String(mockFetch.mock.calls[0][0]);

    expect(requestedUrl).toBe('/api/weather/geo/1.0/reverse?lat=-38.68&lon=176.07&limit=1');
    expect(requestedUrl).not.toContain('appid');
    expect(name).toBe('Taupō');
  });
});
