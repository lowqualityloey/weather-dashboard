import { env } from './env';
import { getCache, setCache } from './cache';
import type { GeoLocation, WeatherData } from '../types/weather';

const API_KEY = env.OPENWEATHER_API_KEY;
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';
const ONECALL_BASE = 'https://api.openweathermap.org/data/3.0';

export async function geocodeCity(city: string): Promise<GeoLocation[]> {
  const cacheKey = `geocode_${city}`;
  const cached = getCache<GeoLocation[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `${GEO_BASE}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`,
  );
  if (!res.ok) throw new Error('Geocoding request failed');
  const data: GeoLocation[] = await res.json();

  setCache(cacheKey, data);
  return data;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const cacheKey = `weather_${lat}_${lon}`;
  const cached = getCache<WeatherData>(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `${ONECALL_BASE}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`,
  );
  if (!res.ok) throw new Error('Weather request failed');
  const data: WeatherData = await res.json();

  setCache(cacheKey, data);
  return data;
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const cacheKey = `reverse_geocode_${lat}_${lon}`;
  const cached = getCache<string>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${GEO_BASE}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
  if (!res.ok) throw new Error('Reverse geocoding request failed');
  const data: GeoLocation[] = await res.json();

  const name = data[0]?.name ?? 'Current Location';
  setCache(cacheKey, name);
  return name;
}
