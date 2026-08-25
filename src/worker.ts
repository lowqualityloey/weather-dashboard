// Cloudflare Worker entrypoint.
// Serves the built SPA from static assets and proxies OpenWeather API
// requests through /api/weather/* so the API key never reaches the client.

const API_PROXY_PREFIX = '/api/weather/';

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  OPENWEATHER_API_KEY?: string;
  VITE_OPENWEATHER_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith(API_PROXY_PREFIX)) {
      return proxyWeatherRequest(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
};

export async function proxyWeatherRequest(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response> {
  const apiKey = env.OPENWEATHER_API_KEY || env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    return jsonResponse(
      {
        error:
          'OpenWeather API key is missing on the server. Please set OPENWEATHER_API_KEY.',
      },
      500,
    );
  }

  const subpath = url.pathname.slice(API_PROXY_PREFIX.length);
  const targetUrl = new URL(`https://api.openweathermap.org/${subpath}${url.search}`);
  targetUrl.searchParams.set('appid', apiKey);

  try {
    const upstreamResponse = await fetch(targetUrl.toString(), {
      method: request.method,
    });
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: upstreamResponse.headers,
    });
  } catch (err) {
    return jsonResponse(
      {
        error: 'Failed to communicate with OpenWeather API',
        details: err instanceof Error ? err.message : String(err),
      },
      502,
    );
  }
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
