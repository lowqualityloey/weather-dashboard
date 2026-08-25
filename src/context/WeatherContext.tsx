import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type { MappedCurrent, MappedDaily, MappedHourly } from '../lib/weatherMapper';
import type { WeatherData } from '../types/weather';
import { geocodeCity, fetchWeather, reverseGeocode } from '../lib/openWeather';
import { mapCurrent, mapDaily, mapHourly } from '../lib/weatherMapper';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface SavedCity {
  name: string;
  lat: number;
  lon: number;
}

type SavedCityStorage = SavedCity[] | string[];

interface WeatherContextType {
  current: MappedCurrent | null;
  hourly: MappedHourly[];
  daily: MappedDaily[];
  selectedCity: string;
  selectedLocation: { lat: number; lon: number } | null;
  isLoading: boolean;
  error: string | null;
  savedCities: SavedCity[];
  searchCity: (city: string) => Promise<void>;
  clearError: () => void;
  addSavedCity: (name: string, lat: number, lon: number) => void;
  removeSavedCity: (name: string) => void;
  selectSavedCity: (city: SavedCity) => Promise<void>;
  fetchCurrentLocation: () => void;
  fetchWeatherByCoords: (lat: number, lon: number, cityName?: string) => Promise<void>;
}

const DEFAULT_SAVED_CITIES: SavedCity[] = [
  { name: 'Taupō', lat: -38.6857, lon: 176.0702 },
  { name: 'Auckland', lat: -36.8485, lon: 174.7633 },
  { name: 'Wellington', lat: -41.2865, lon: 174.7762 },
];

// Normalize legacy string-only entries (saved before coordinates were stored).
function normalizeSavedCities(raw: SavedCityStorage): SavedCity[] {
  return raw.map((c) => (typeof c === 'string' ? { name: c, lat: NaN, lon: NaN } : c));
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<MappedCurrent | null>(null);
  const [hourly, setHourly] = useState<MappedHourly[]>([]);
  const [daily, setDaily] = useState<MappedDaily[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Taupō');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [savedCitiesStorage, setSavedCitiesStorage] = useLocalStorage<SavedCityStorage>(
    'weather_saved_cities',
    DEFAULT_SAVED_CITIES,
  );
  const savedCities = useMemo(() => normalizeSavedCities(savedCitiesStorage), [savedCitiesStorage]);

  // Monotonic id so only the latest in-flight request can apply its result.
  const requestRef = useRef(0);
  // Ensures the mount-only Taupō seed runs once even under StrictMode.
  const didInitRef = useRef(false);

  const clearError = useCallback(() => setError(null), []);

  const addSavedCity = useCallback(
    (name: string, lat: number, lon: number) => {
      setSavedCitiesStorage((prev) => {
        const list = normalizeSavedCities(prev ?? []);
        if (list.some((c) => c.name.toLowerCase() === name.toLowerCase())) return list;
        return [...list, { name, lat, lon }];
      });
    },
    [setSavedCitiesStorage],
  );

  const removeSavedCity = useCallback(
    (name: string) => {
      setSavedCitiesStorage((prev) => {
        const list = normalizeSavedCities(prev ?? []);
        return list.filter((c) => c.name.toLowerCase() !== name.toLowerCase());
      });
    },
    [setSavedCitiesStorage],
  );

  const applyWeather = useCallback(
    (name: string, location: { lat: number; lon: number }, weather: WeatherData) => {
      setCurrent(mapCurrent(weather));
      setDaily(mapDaily(weather.daily));
      setHourly(mapHourly(weather.hourly));
      setSelectedCity(name);
      setSelectedLocation(location);
    },
    [],
  );

  const runWeatherRequest = useCallback(
    async (
      work: () => Promise<{
        name: string;
        location: { lat: number; lon: number };
        weather: WeatherData;
      }>,
    ) => {
      const id = ++requestRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const { name, location, weather } = await work();
        if (id !== requestRef.current) return; // stale response, discard
        applyWeather(name, location, weather);
      } catch (err: unknown) {
        if (id !== requestRef.current) return;
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        if (id === requestRef.current) setIsLoading(false);
      }
    },
    [applyWeather],
  );

  const fetchWeatherByCoords = useCallback(
    async (lat: number, lon: number, cityName?: string) => {
      await runWeatherRequest(async () => ({
        name: cityName ?? (await reverseGeocode(lat, lon)),
        location: { lat, lon },
        weather: await fetchWeather(lat, lon),
      }));
    },
    [runWeatherRequest],
  );

  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const id = ++requestRef.current;
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (id !== requestRef.current) return; // superseded by a newer request
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              'Location permission denied. Please allow location access or search manually.',
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('Failed to detect location.');
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }, [fetchWeatherByCoords]);

  const searchCity = useCallback(
    async (city: string) => {
      await runWeatherRequest(async () => {
        const locations = await geocodeCity(city);
        if (!locations.length) {
          throw new Error('City not found');
        }
        return {
          name: locations[0].name,
          location: { lat: locations[0].lat, lon: locations[0].lon },
          weather: await fetchWeather(locations[0].lat, locations[0].lon),
        };
      });
    },
    [runWeatherRequest],
  );

  // Prefer exact coordinates; fall back to a name search for legacy entries.
  const selectSavedCity = useCallback(
    async (city: SavedCity) => {
      if (Number.isFinite(city.lat) && Number.isFinite(city.lon)) {
        await fetchWeatherByCoords(city.lat, city.lon, city.name);
      } else {
        await searchCity(city.name);
      }
    },
    [fetchWeatherByCoords, searchCity],
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    void searchCity('Taupō');
  }, [searchCity]);

  const value = useMemo(
    () => ({
      current,
      hourly,
      daily,
      selectedCity,
      selectedLocation,
      isLoading,
      error,
      savedCities,
      searchCity,
      clearError,
      addSavedCity,
      removeSavedCity,
      selectSavedCity,
      fetchCurrentLocation,
      fetchWeatherByCoords,
    }),
    [
      current,
      hourly,
      daily,
      selectedCity,
      selectedLocation,
      isLoading,
      error,
      savedCities,
      searchCity,
      clearError,
      addSavedCity,
      removeSavedCity,
      selectSavedCity,
      fetchCurrentLocation,
      fetchWeatherByCoords,
    ],
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
