import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { geocodeCity, fetchWeather, reverseGeocode } from './openWeather';
import { setCache, getCache } from './cache';
import type { GeoLocation } from '../types/weather';

describe('openWeather API module', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('geocodeCity', () => {
    const mockLocations: GeoLocation[] = [
      {
        name: 'Auckland',
        lat: -36.8485,
        lon: 174.7633,
        country: 'NZ',
        state: 'Auckland',
      },
      {
        name: 'Auckland',
        lat: 37.8044,
        lon: -122.2712,
        country: 'US',
        state: 'California',
      },
    ];

    it('fetches geocoding data on cache miss, caches the result, and returns data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLocations,
      });

      const result = await geocodeCity('Auckland');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain('https://api.openweathermap.org/geo/1.0/direct?q=Auckland&limit=5&appid=');
      expect(result).toEqual(mockLocations);

      // Verify cached entry was created
      const cached = getCache<GeoLocation[]>('geocode_Auckland');
      expect(cached).toEqual(mockLocations);
    });

    it('returns cached data on cache hit without calling fetch', async () => {
      setCache('geocode_Auckland', mockLocations);

      const result = await geocodeCity('Auckland');

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toEqual(mockLocations);
    });

    it('properly encodes city names with spaces and special characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLocations,
      });

      await geocodeCity('São Paulo & New York');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain('q=S%C3%A3o%20Paulo%20%26%20New%20York');
    });

    it('throws Error when HTTP response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(geocodeCity('London')).rejects.toThrow('Geocoding request failed');
      expect(getCache('geocode_London')).toBeNull();
    });

    it('propagates network fetch failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(geocodeCity('London')).rejects.toThrow('Network error');
      expect(getCache('geocode_London')).toBeNull();
    });

    it('handles empty results array returned by API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await geocodeCity('NonExistentCityXYZ123');

      expect(result).toEqual([]);
      expect(getCache('geocode_NonExistentCityXYZ123')).toEqual([]);
    });
  });

  describe('fetchWeather', () => {
    const lat = -36.85;
    const lon = 174.76;

    const currentResponseBody = {
      timezone: 'Pacific/Auckland',
      timezone_offset: 43200,
      data: [
        {
          temp: 18.5,
          feels_like: 18.0,
          humidity: 75,
          wind_speed: 4.5,
          wind_deg: 180,
          weather: [{ description: 'light rain', icon: '10d' }],
        },
      ],
    };

    const hourlyResponseBody = {
      data: Array.from({ length: 24 }, (_, i) => ({
        dt: 1700000000 + i * 3600,
        temp: 15 + i * 0.2,
        weather: [{ description: 'clear sky', icon: '01d' }],
      })),
    };

    const dailyResponseBody = {
      data: Array.from({ length: 7 }, (_, i) => ({
        dt: 1700000000 + i * 86400,
        temp: { min: 12 + i, max: 20 + i, day: 16 + i },
        weather: [{ description: 'few clouds', icon: '02d' }],
      })),
    };

    it('returns cached weather data on cache hit', async () => {
      const dummyWeatherData = {
        timezone: 'UTC',
        timezone_offset: 0,
        current: {
          temp: 20,
          feels_like: 20,
          humidity: 50,
          wind_speed: 5,
          wind_deg: 0,
          weather: [],
        },
        hourly: [],
        daily: [],
      };
      setCache(`weather_${lat}_${lon}`, dummyWeatherData);

      const result = await fetchWeather(lat, lon);

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toEqual(dummyWeatherData);
    });

    it('fetches weather datasets in parallel and structures response on cache miss', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => currentResponseBody })
        .mockResolvedValueOnce({ ok: true, json: async () => hourlyResponseBody })
        .mockResolvedValueOnce({ ok: true, json: async () => dailyResponseBody });

      const weather = await fetchWeather(lat, lon);

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(weather.timezone).toBe('Pacific/Auckland');
      expect(weather.timezone_offset).toBe(43200);
      expect(weather.current.temp).toBe(18.5);
      expect(weather.hourly).toHaveLength(24);
      expect(weather.daily).toHaveLength(5);
    });

    it('handles hourly pagination when next URL is present and hourly count < 24', async () => {
      const page1Hourly = {
        next: 'http://api.openweathermap.org/data/4.0/onecall/timeline/1h?page=2',
        data: Array.from({ length: 12 }, (_, i) => ({
          dt: 1700000000 + i * 3600,
          temp: 15,
          weather: [{ description: 'clear', icon: '01d' }],
        })),
      };

      const page2Hourly = {
        data: Array.from({ length: 12 }, (_, i) => ({
          dt: 1700000000 + (i + 12) * 3600,
          temp: 16,
          weather: [{ description: 'clear', icon: '01d' }],
        })),
      };

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => currentResponseBody })
        .mockResolvedValueOnce({ ok: true, json: async () => page1Hourly })
        .mockResolvedValueOnce({ ok: true, json: async () => dailyResponseBody })
        .mockResolvedValueOnce({ ok: true, json: async () => page2Hourly });

      const weather = await fetchWeather(lat, lon);

      expect(mockFetch).toHaveBeenCalledTimes(4);
      expect(weather.hourly).toHaveLength(24);
      const page2FetchUrl = mockFetch.mock.calls[3][0] as string;
      expect(page2FetchUrl).toContain('https://api.openweathermap.org');
    });

    it('throws error when current weather request fails', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: true, json: async () => hourlyResponseBody })
        .mockResolvedValueOnce({ ok: true, json: async () => dailyResponseBody });

      await expect(fetchWeather(lat, lon)).rejects.toThrow('Current weather request failed');
    });

    it('throws error when no weather data is returned in current response', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) })
        .mockResolvedValueOnce({ ok: true, json: async () => hourlyResponseBody })
        .mockResolvedValueOnce({ ok: true, json: async () => dailyResponseBody });

      await expect(fetchWeather(lat, lon)).rejects.toThrow('No weather data returned');
    });
  });

  describe('reverseGeocode', () => {
    const lat = -36.85;
    const lon = 174.76;

    it('returns cached name on cache hit', async () => {
      setCache(`reverse_geocode_${lat}_${lon}`, 'Auckland');

      const result = await reverseGeocode(lat, lon);

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toBe('Auckland');
    });

    it('fetches location name on cache miss and caches result', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ name: 'Auckland', country: 'NZ' }],
      });

      const result = await reverseGeocode(lat, lon);

      expect(result).toBe('Auckland');
      expect(getCache(`reverse_geocode_${lat}_${lon}`)).toBe('Auckland');
    });

    it('returns fallback name "Current Location" when empty array is returned', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await reverseGeocode(lat, lon);

      expect(result).toBe('Current Location');
      expect(getCache(`reverse_geocode_${lat}_${lon}`)).toBe('Current Location');
    });

    it('throws Error when reverse geocoding request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(reverseGeocode(lat, lon)).rejects.toThrow('Reverse geocoding request failed');
    });
  });
});
