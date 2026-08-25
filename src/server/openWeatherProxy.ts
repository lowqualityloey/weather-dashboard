import type { IncomingMessage, ServerResponse } from 'node:http';

export async function handleOpenWeatherProxy(
  req: IncomingMessage,
  res: ServerResponse,
  apiKeyOverride?: string,
) {
  const apiKey =
    apiKeyOverride || process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'OpenWeather API key is missing on the server. Please set OPENWEATHER_API_KEY.',
      }),
    );
    return;
  }

  try {
    const reqUrl = req.url ?? '/';
    const parsedUrl = new URL(reqUrl, 'http://localhost');
    const targetUrl = new URL(
      `https://api.openweathermap.org${parsedUrl.pathname}${parsedUrl.search}`,
    );
    targetUrl.searchParams.set('appid', apiKey);

    const upstreamResponse = await fetch(targetUrl.toString(), {
      method: req.method ?? 'GET',
    });

    res.statusCode = upstreamResponse.status;
    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const buffer = await upstreamResponse.arrayBuffer();
    res.end(Buffer.from(buffer));
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Failed to communicate with OpenWeather API',
        details: err instanceof Error ? err.message : String(err),
      }),
    );
  }
}
