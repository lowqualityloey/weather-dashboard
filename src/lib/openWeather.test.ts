import { beforeEach, describe, expect, it, vi } from 'vitest';
import { geocodeCity, fetchWeather, reverseGeocode } from './openWeather';

describe('openWeather API functions', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('fetchWeather', () => {
    it('throws "Current weather request failed" when current weather request fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/current?')) {
          return new Response(null, { status: 500, statusText: 'Internal Server Error' });
        }
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      });

      await expect(fetchWeather(-36.85, 174.76)).rejects.toThrow('Current weather request failed');
    });

    it('throws "Hourly timeline request failed" when hourly timeline request fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/timeline/1h?')) {
          return new Response(null, { status: 500, statusText: 'Internal Server Error' });
        }
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      });

      await expect(fetchWeather(-36.85, 174.76)).rejects.toThrow('Hourly timeline request failed');
    });

    it('throws "Daily timeline request failed" when daily timeline request fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/timeline/1day?')) {
          return new Response(null, { status: 500, statusText: 'Internal Server Error' });
        }
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      });

      await expect(fetchWeather(-36.85, 174.76)).rejects.toThrow('Daily timeline request failed');
    });

    it('throws "No weather data returned" when current weather response has no data item', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/current?')) {
          return new Response(JSON.stringify({ data: [] }), { status: 200 });
        }
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      });

      await expect(fetchWeather(-36.85, 174.76)).rejects.toThrow('No weather data returned');
    });

    it('successfully fetches and maps weather data', async () => {
      const mockCurrentData = {
        timezone: 'Pacific/Auckland',
        timezone_offset: 43200,
        data: [
          {
            temp: 20,
            feels_like: 19,
            humidity: 60,
            wind_speed: 5,
            wind_deg: 180,
            weather: [{ description: 'clear sky', icon: '01d' }],
          },
        ],
      };

      const mockHourlyData = {
        data: [{ dt: 1600000000, temp: 18, weather: [{ description: 'clear sky', icon: '01d' }] }],
      };

      const mockDailyData = {
        data: [
          {
            dt: 1600000000,
            temp: { min: 15, max: 22 },
            weather: [{ description: 'clear sky', icon: '01d' }],
          },
        ],
      };

      vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/current?')) {
          return new Response(JSON.stringify(mockCurrentData), { status: 200 });
        }
        if (urlStr.includes('/timeline/1h?')) {
          return new Response(JSON.stringify(mockHourlyData), { status: 200 });
        }
        if (urlStr.includes('/timeline/1day?')) {
          return new Response(JSON.stringify(mockDailyData), { status: 200 });
        }
        return new Response(null, { status: 404 });
      });

      const weather = await fetchWeather(-36.85, 174.76);

      expect(weather.timezone).toBe('Pacific/Auckland');
      expect(weather.timezone_offset).toBe(43200);
      expect(weather.current.temp).toBe(20);
      expect(weather.hourly).toHaveLength(1);
      expect(weather.daily).toHaveLength(1);
      expect(weather.daily[0].temp.min).toBe(15);
      expect(weather.daily[0].temp.max).toBe(22);
    });

    it('handles hourly page 2 pagination when next property is present', async () => {
      const mockCurrentData = {
        timezone: 'UTC',
        timezone_offset: 0,
        data: [{ temp: 20, feels_like: 19, humidity: 60, wind_speed: 5, weather: [] }],
      };

      const mockHourlyPage1 = {
        next: 'http://api.openweathermap.org/data/4.0/onecall/timeline/1h?page=2',
        data: Array.from({ length: 12 }, (_, i) => ({
          dt: 1600000000 + i * 3600,
          temp: 15 + i,
          weather: [],
        })),
      };

      const mockHourlyPage2 = {
        data: Array.from({ length: 12 }, (_, i) => ({
          dt: 1600043200 + i * 3600,
          temp: 27 + i,
          weather: [],
        })),
      };

      vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('/current?')) {
          return new Response(JSON.stringify(mockCurrentData), { status: 200 });
        }
        if (urlStr.includes('/timeline/1h?') && !urlStr.includes('page=2')) {
          return new Response(JSON.stringify(mockHourlyPage1), { status: 200 });
        }
        if (urlStr.includes('page=2')) {
          return new Response(JSON.stringify(mockHourlyPage2), { status: 200 });
        }
        if (urlStr.includes('/timeline/1day?')) {
          return new Response(JSON.stringify({ data: [] }), { status: 200 });
        }
        return new Response(null, { status: 404 });
      });

      const weather = await fetchWeather(10, 10);
      expect(weather.hourly).toHaveLength(24);
      expect(weather.hourly[12].temp).toBe(27);
    });

    it('returns cached weather data on subsequent calls', async () => {
      const mockCurrentData = {
        data: [{ temp: 25, feels_like: 25, humidity: 50, wind_speed: 2, weather: [] }],
      };

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
        return new Response(JSON.stringify(mockCurrentData), { status: 200 });
      });

      const firstCall = await fetchWeather(50, 50);
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockClear();
      const secondCall = await fetchWeather(50, 50);
      expect(fetchSpy).toHaveBeenCalledTimes(0);
      expect(secondCall).toEqual(firstCall);
    });
  });

  describe('geocodeCity', () => {
    it('throws error on geocoding request failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 400 }));

      await expect(geocodeCity('InvalidCity')).rejects.toThrow('Geocoding request failed');
    });

    it('returns geocoded locations and caches result', async () => {
      const mockGeo = [{ name: 'Auckland', lat: -36.85, lon: 174.76, country: 'NZ' }];
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockGeo), { status: 200 }));

      const res1 = await geocodeCity('Auckland');
      expect(res1).toEqual(mockGeo);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockClear();
      const res2 = await geocodeCity('Auckland');
      expect(res2).toEqual(mockGeo);
      expect(fetchSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('reverseGeocode', () => {
    it('throws error on reverse geocoding request failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

      await expect(reverseGeocode(0, 0)).rejects.toThrow('Reverse geocoding request failed');
    });

    it('returns location name or default "Current Location" and caches result', async () => {
      const mockGeo = [{ name: 'Taupo', lat: -38.68, lon: 176.07, country: 'NZ' }];
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify(mockGeo), { status: 200 }));

      const name = await reverseGeocode(-38.68, 176.07);
      expect(name).toBe('Taupo');
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockClear();
      const cachedName = await reverseGeocode(-38.68, 176.07);
      expect(cachedName).toBe('Taupo');
      expect(fetchSpy).toHaveBeenCalledTimes(0);
    });
  });
});
