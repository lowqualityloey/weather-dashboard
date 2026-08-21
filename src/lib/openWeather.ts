import { env } from './env';
import type { GeoLocation, WeatherData } from '../types/weather';

const API_KEY = env.OPENWEATHER_API_KEY;
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';
const ONECALL_BASE = 'https://api.openweathermap.org/data/3.0';

export async function geocodeCity(city: string): Promise<GeoLocation[]> {
  const res = await fetch(
    `${GEO_BASE}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`,
  );
  if (!res.ok) throw new Error('Geocoding request failed');
  return res.json();
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(
    `${ONECALL_BASE}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`,
  );
  if (!res.ok) throw new Error('Weather request failed');
  return res.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(`${GEO_BASE}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
  if (!res.ok) throw new Error('Reverse geocoding request failed');
  const data: GeoLocation[] = await res.json();
  return data[0]?.name ?? 'Current Location';
}
