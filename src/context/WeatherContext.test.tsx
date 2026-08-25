import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { WeatherProvider, useWeather } from './WeatherContext';
import { geocodeCity, fetchWeather, reverseGeocode } from '../lib/openWeather';
import type { WeatherData } from '../types/weather';

vi.mock('../lib/openWeather', () => ({
  geocodeCity: vi.fn(),
  fetchWeather: vi.fn(),
  reverseGeocode: vi.fn(),
}));

const geocodeMock = vi.mocked(geocodeCity);
const fetchMock = vi.mocked(fetchWeather);
const reverseMock = vi.mocked(reverseGeocode);

function makeWeather(description: string): WeatherData {
  return {
    timezone: 'UTC',
    timezone_offset: 0,
    current: {
      temp: 20,
      feels_like: 19,
      humidity: 50,
      wind_speed: 3,
      wind_deg: 0,
      weather: [{ description, icon: '01d' }],
    },
    hourly: [],
    daily: [],
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return <WeatherProvider>{children}</WeatherProvider>;
}

describe('WeatherContext request orchestration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Defaults so the mount-only Taupō seed resolves harmlessly.
    geocodeMock.mockImplementation(async () => []);
    fetchMock.mockResolvedValue(makeWeather('empty'));
    reverseMock.mockResolvedValue('Unknown');
  });

  it('applies only the latest search result when responses resolve out of order', async () => {
    let seq = 0;
    geocodeMock.mockImplementation(async (city) => [
      { name: city, country: 'X', lat: ++seq, lon: 0 },
    ]);

    const pending = new Map<number, (data: WeatherData) => void>();
    fetchMock.mockImplementation(
      (lat) =>
        new Promise<WeatherData>((resolve) => {
          pending.set(lat, resolve);
        }),
    );

    const { result } = renderHook(() => useWeather(), { wrapper });

    // Fire both searches without awaiting (their fetch promises are pending).
    act(() => {
      void result.current.searchCity('A');
    });
    act(() => {
      void result.current.searchCity('B');
    });
    // Let each search's geocode resolve so its fetch registers in `pending`.
    await act(async () => {});

    // Latest request is B; resolve B first, then the stale A.
    await act(async () => {
      pending.get(3)!(makeWeather('B result'));
    });
    await act(async () => {
      pending.get(2)!(makeWeather('A result'));
    });
    await act(async () => {});

    expect(result.current.selectedCity).toBe('B');
    expect(result.current.current?.description).toBe('B result');
  });

  it('ignores an error thrown by a stale request', async () => {
    let seq = 0;
    geocodeMock.mockImplementation(async (city) => [
      { name: city, country: 'X', lat: ++seq, lon: 0 },
    ]);

    const pending = new Map<
      number,
      { resolve: (d: WeatherData) => void; reject: (e: Error) => void }
    >();
    fetchMock.mockImplementation(
      (lat) =>
        new Promise<WeatherData>((resolve, reject) => {
          pending.set(lat, { resolve, reject });
        }),
    );

    const { result } = renderHook(() => useWeather(), { wrapper });

    act(() => {
      void result.current.searchCity('A');
    });
    act(() => {
      void result.current.searchCity('B');
    });
    // Let each search's geocode resolve so its fetch registers in `pending`.
    await act(async () => {});

    // B succeeds, then stale A fails — its error must not surface.
    await act(async () => {
      pending.get(3)!.resolve(makeWeather('B result'));
    });
    await act(async () => {
      pending.get(2)!.reject(new Error('stale failure'));
    });
    await act(async () => {});

    expect(result.current.selectedCity).toBe('B');
    expect(result.current.current?.description).toBe('B result');
    expect(result.current.error).toBeNull();
  });

  it('stores coordinates alongside a saved city', async () => {
    const { result } = renderHook(() => useWeather(), { wrapper });

    act(() => {
      result.current.addSavedCity('Wellington', -41.2865, 174.7762);
    });

    const saved = result.current.savedCities.find((c) => c.name === 'Wellington');
    expect(saved).toMatchObject({ name: 'Wellington', lat: -41.2865, lon: 174.7762 });
  });

  it('normalizes legacy string-only saved cities on read', () => {
    localStorage.setItem('weather_saved_cities', JSON.stringify(['Auckland']));

    const { result } = renderHook(() => useWeather(), { wrapper });

    const saved = result.current.savedCities;
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Auckland');
    expect(Number.isFinite(saved[0].lat)).toBe(false);
  });

  it('preserves user-safe error messages like "City not found"', async () => {
    geocodeMock.mockResolvedValue([]);

    const { result } = renderHook(() => useWeather(), { wrapper });

    await act(async () => {
      await result.current.searchCity('NonExistentCity12345');
    });

    expect(result.current.error).toBe('City not found');
  });

  it('sanitizes detailed or internal error messages to a safe generic message', async () => {
    geocodeMock.mockRejectedValue(
      new Error('Database error connecting to postgres://user:secret_pass@db.local:5432/weather'),
    );

    const { result } = renderHook(() => useWeather(), { wrapper });

    await act(async () => {
      await result.current.searchCity('London');
    });

    expect(result.current.error).toBe('Failed to fetch weather data. Please try again.');
  describe('fetchCurrentLocation error handling', () => {
    const setupGeolocationError = (code: number) => {
      const mockObj = {
        getCurrentPosition: vi.fn(
          (
            _success: (pos: unknown) => void,
            error?: (err: {
              code: number;
              PERMISSION_DENIED: number;
              POSITION_UNAVAILABLE: number;
              TIMEOUT: number;
            }) => void,
          ) => {
            if (error) {
              error({
                code,
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
              });
            }
          },
        ),
      };
      vi.stubGlobal('navigator', {
        ...globalThis.navigator,
        geolocation: mockObj,
      });
    };

    it('handles PERMISSION_DENIED error', async () => {
      setupGeolocationError(1);
      const { result } = renderHook(() => useWeather(), { wrapper });

      act(() => {
        result.current.fetchCurrentLocation();
      });

      expect(result.current.error).toBe(
        'Location permission denied. Please allow location access or search manually.',
      );
    });

    it('handles POSITION_UNAVAILABLE error', async () => {
      setupGeolocationError(2);
      const { result } = renderHook(() => useWeather(), { wrapper });

      act(() => {
        result.current.fetchCurrentLocation();
      });

      expect(result.current.error).toBe('Location information is unavailable.');
    });

    it('handles TIMEOUT error', async () => {
      setupGeolocationError(3);
      const { result } = renderHook(() => useWeather(), { wrapper });

      act(() => {
        result.current.fetchCurrentLocation();
      });

      expect(result.current.error).toBe('Location request timed out.');
    });

    it('handles default unknown error', async () => {
      setupGeolocationError(99);
      const { result } = renderHook(() => useWeather(), { wrapper });

      act(() => {
        result.current.fetchCurrentLocation();
      });

      expect(result.current.error).toBe('Failed to detect location.');
    });
  });
});
