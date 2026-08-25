import { getCache, setCache } from './cache';
import type { GeoLocation, WeatherData, DailyWeather, HourlyWeather } from '../types/weather';

const API_BASE = '/api/weather';

export async function geocodeCity(city: string): Promise<GeoLocation[]> {
  const cacheKey = `geocode_${city}`;
  const cached = getCache<GeoLocation[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5`);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data: GeoLocation[] = await res.json();

  setCache(cacheKey, data);
  return data;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const cacheKey = `weather_${lat}_${lon}`;
  const cached = getCache<WeatherData>(cacheKey);
  if (cached) return cached;

  const [currentRes, hourlyRes, dailyRes] = await Promise.all([
    fetch(`${API_BASE}/data/4.0/onecall/current?lat=${lat}&lon=${lon}&units=metric`),
    fetch(`${API_BASE}/data/4.0/onecall/timeline/1h?lat=${lat}&lon=${lon}&units=metric`),
    fetch(`${API_BASE}/data/4.0/onecall/timeline/1day?lat=${lat}&lon=${lon}&units=metric`),
  ]);

  if (!currentRes.ok) throw new Error('Current weather request failed');
  if (!hourlyRes.ok) throw new Error('Hourly timeline request failed');
  if (!dailyRes.ok) throw new Error('Daily timeline request failed');

  const currentJson = await currentRes.json();
  const hourlyJson = await hourlyRes.json();
  const dailyJson = await dailyRes.json();

  const currentItem = currentJson.data?.[0];
  if (!currentItem) throw new Error('No weather data returned');

  const timezone: string = currentJson.timezone ?? '';
  const timezone_offset: number = currentJson.timezone_offset ?? 0;

  interface DailyItem {
    dt: number;
    temp: { min?: number; max?: number; day?: number };
    weather: { description: string; icon: string }[];
  }

  interface HourlyItem {
    dt: number;
    temp: number;
    weather: { description: string; icon: string }[];
  }

  let hourlyItems: HourlyItem[] = (hourlyJson.data as HourlyItem[]) ?? [];

  // Fetch page 2 if needed to provide a full 24 hours
  if (hourlyJson.next && hourlyItems.length < 24) {
    try {
      const rawNextUrl = String(hourlyJson.next);
      const nextUrl = rawNextUrl
        .replace(/^https?:\/\/api\.openweathermap\.org/i, API_BASE)
        .replace(/([?&])appid=[^&]*&?/, '$1')
        .replace(/[?&]$/, '');

      const page2Res = await fetch(nextUrl);
      if (page2Res.ok) {
        const page2Json = await page2Res.json();
        hourlyItems = [...hourlyItems, ...((page2Json.data as HourlyItem[]) ?? [])];
      }
    } catch {
      // Fall back to page 1 items
    }
  }

  const daily: DailyWeather[] = ((dailyJson.data as DailyItem[]) ?? []).slice(0, 5).map((d) => ({
    dt: d.dt,
    temp: {
      min: d.temp?.min ?? d.temp?.day ?? 0,
      max: d.temp?.max ?? d.temp?.day ?? 0,
    },
    weather: d.weather ?? [],
  }));

  // Map 24 hourly forecast snapshots
  const hourly: HourlyWeather[] = hourlyItems.slice(0, 24).map((h) => ({
    dt: h.dt,
    temp: h.temp,
    weather: h.weather ?? [],
  }));

  const data: WeatherData = {
    timezone,
    timezone_offset,
    current: {
      temp: currentItem.temp,
      feels_like: currentItem.feels_like,
      humidity: currentItem.humidity,
      wind_speed: currentItem.wind_speed,
      wind_deg: currentItem.wind_deg ?? 0,
      weather: currentItem.weather ?? [],
    },
    hourly,
    daily,
  };

  setCache(cacheKey, data);
  return data;
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const cacheKey = `reverse_geocode_${lat}_${lon}`;
  const cached = getCache<string>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1`);
  if (!res.ok) throw new Error('Reverse geocoding request failed');
  const data: GeoLocation[] = await res.json();

  const name = data[0]?.name ?? 'Current Location';
  setCache(cacheKey, name);
  return name;
}
