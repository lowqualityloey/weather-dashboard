import { describe, it, expect, vi, afterEach } from 'vitest';
import worker, { proxyWeatherRequest, type Env } from './worker';

const baseEnv: Env = {
  ASSETS: { fetch: vi.fn(async () => new Response('asset')) },
  OPENWEATHER_API_KEY: 'test-api-key',
};

describe('weather worker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('proxies /api/weather requests to OpenWeather with the API key appended', async () => {
    let capturedInput: unknown;
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      capturedInput = input;
      return new Response('{"ok":true}', { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const request = new Request(
      'https://weather-dashboard.example/api/weather/geo/1.0/direct?q=Auckland&limit=5',
    );
    const response = await worker.fetch(request, baseEnv);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = new URL(String(capturedInput));
    expect(calledUrl.origin).toBe('https://api.openweathermap.org');
    expect(calledUrl.pathname).toBe('/geo/1.0/direct');
    expect(calledUrl.searchParams.get('q')).toBe('Auckland');
    expect(calledUrl.searchParams.get('appid')).toBe('test-api-key');
  });

  it('serves static assets for non-API requests', async () => {
    const request = new Request('https://weather-dashboard.example/');
    const response = await worker.fetch(request, baseEnv);

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe('asset');
    expect(baseEnv.ASSETS.fetch).toHaveBeenCalledWith(request);
  });

  it('returns 500 when the API key is not configured', async () => {
    const request = new Request(
      'https://weather-dashboard.example/api/weather/geo/1.0/direct?q=Auckland',
    );
    const response = await worker.fetch(request, { ...baseEnv, OPENWEATHER_API_KEY: undefined });

    expect(response.status).toBe(500);
    const body = (await response.json()) as { error: string };
    expect(body.error).toContain('OpenWeather API key is missing');
  });

  it('returns 502 when the upstream request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('boom');
      }),
    );

    const request = new Request(
      'https://weather-dashboard.example/api/weather/data/4.0/onecall/current?lat=1&lon=2',
    );
    const response = await proxyWeatherRequest(request, baseEnv, new URL(request.url));

    expect(response.status).toBe(502);
  });
});
