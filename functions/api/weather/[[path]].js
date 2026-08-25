export async function onRequest(context) {
  const { request, env, params } = context;
  const apiKey =
    env.OPENWEATHER_API_KEY ||
    env.VITE_OPENWEATHER_API_KEY ||
    (typeof process !== 'undefined'
      ? process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY
      : undefined);

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'OpenWeather API key is missing on the server. Please set OPENWEATHER_API_KEY.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const url = new URL(request.url);
  const subpath = params.path
    ? Array.isArray(params.path)
      ? params.path.join('/')
      : params.path
    : '';
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
    return new Response(
      JSON.stringify({
        error: 'Failed to communicate with OpenWeather API',
        details: err instanceof Error ? err.message : String(err),
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
