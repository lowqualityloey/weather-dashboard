import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleOpenWeatherProxy } from './openWeatherProxy';
import type { IncomingMessage, ServerResponse } from 'node:http';

describe('handleOpenWeatherProxy', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function createMockReqRes(url: string) {
    const req = {
      url,
      method: 'GET',
    } as unknown as IncomingMessage;

    const resHeaders: Record<string, string> = {};
    let statusCode = 200;
    let responseData = '';

    const res = {
      get statusCode() {
        return statusCode;
      },
      set statusCode(code: number) {
        statusCode = code;
      },
      setHeader(name: string, value: string) {
        resHeaders[name.toLowerCase()] = value;
      },
      end(data?: string | Uint8Array) {
        if (data) {
          responseData = typeof data === 'string' ? data : new TextDecoder().decode(data);
        }
      },
    } as unknown as ServerResponse;

    return {
      req,
      res,
      getHeaders: () => resHeaders,
      getStatusCode: () => statusCode,
      getData: () => responseData,
    };
  }

  it('appends appid to the upstream OpenWeather API request', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify([{ name: 'Taupō' }]), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const { req, res, getStatusCode, getData } = createMockReqRes(
      '/geo/1.0/direct?q=Taupo&limit=5',
    );

    await handleOpenWeatherProxy(req, res, 'test-secret-key');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const upstreamUrl = String(mockFetch.mock.calls[0][0]);
    expect(upstreamUrl).toContain('https://api.openweathermap.org/geo/1.0/direct?q=Taupo&limit=5');
    expect(upstreamUrl).toContain('appid=test-secret-key');

    expect(getStatusCode()).toBe(200);
    expect(JSON.parse(getData())).toEqual([{ name: 'Taupō' }]);
  });

  it('returns 500 error if API key is not configured', async () => {
    const { req, res, getStatusCode, getData } = createMockReqRes('/geo/1.0/direct?q=Taupo');

    const originalApiKey = process.env.OPENWEATHER_API_KEY;
    const originalViteKey = process.env.VITE_OPENWEATHER_API_KEY;
    delete process.env.OPENWEATHER_API_KEY;
    delete process.env.VITE_OPENWEATHER_API_KEY;

    await handleOpenWeatherProxy(req, res, '');

    process.env.OPENWEATHER_API_KEY = originalApiKey;
    process.env.VITE_OPENWEATHER_API_KEY = originalViteKey;

    expect(getStatusCode()).toBe(500);
    expect(JSON.parse(getData()).error).toContain('missing on the server');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 502 error if upstream fetch fails due to network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { req, res, getStatusCode, getData } = createMockReqRes('/geo/1.0/direct?q=Taupo');

    await handleOpenWeatherProxy(req, res, 'test-secret-key');

    expect(getStatusCode()).toBe(502);
    expect(JSON.parse(getData()).error).toContain('Failed to communicate with OpenWeather API');
  });
});
