import { createContext, useState, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { MappedCurrent, MappedDaily, MappedHourly } from '../lib/weatherMapper';
import type { WeatherData } from '../types/weather';
import { geocodeCity, fetchWeather, reverseGeocode } from '../lib/openWeather';
import { mapCurrent, mapDaily, mapHourly } from '../lib/weatherMapper';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface WeatherContextType {
  current: MappedCurrent | null;
  hourly: MappedHourly[];
  daily: MappedDaily[];
  selectedCity: string;
  isLoading: boolean;
  error: string | null;
  savedCities: string[];
  searchCity: (city: string) => Promise<void>;
  clearError: () => void;
  addSavedCity: (city: string) => void;
  removeSavedCity: (city: string) => void;
  fetchCurrentLocation: () => void;
  fetchWeatherByCoords: (lat: number, lon: number, cityName?: string) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<MappedCurrent | null>(null);
  const [hourly, setHourly] = useState<MappedHourly[]>([]);
  const [daily, setDaily] = useState<MappedDaily[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Taupō');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [savedCities, setSavedCities] = useLocalStorage<string[]>('weather_saved_cities', [
    'Taupō',
    'Auckland',
    'Wellington',
  ]);

  // Monotonic id so only the latest in-flight request can apply its result.
  const requestRef = useRef(0);

  const clearError = () => setError(null);

  const addSavedCity = (city: string) => {
    setSavedCities((prev) =>
      prev.some((c) => c.toLowerCase() === city.toLowerCase()) ? prev : [...prev, city],
    );
  };

  const removeSavedCity = (city: string) => {
    setSavedCities((prev) => prev.filter((c) => c.toLowerCase() !== city.toLowerCase()));
  };

  const applyWeather = (name: string, weather: WeatherData) => {
    setCurrent(mapCurrent(weather));
    setDaily(mapDaily(weather.daily));
    setHourly(mapHourly(weather.hourly));
    setSelectedCity(name);
  };

  const runWeatherRequest = async (work: () => Promise<{ name: string; weather: WeatherData }>) => {
    const id = ++requestRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const { name, weather } = await work();
      if (id !== requestRef.current) return; // stale response, discard
      applyWeather(name, weather);
    } catch (err: unknown) {
      if (id !== requestRef.current) return;
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      if (id === requestRef.current) setIsLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number, cityName?: string) => {
    await runWeatherRequest(async () => ({
      name: cityName ?? (await reverseGeocode(lat, lon)),
      weather: await fetchWeather(lat, lon),
    }));
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission denied. Please allow location access or search manually.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Location information is unavailable.');
        } else if (err.code === err.TIMEOUT) {
          setError('Location request timed out.');
        } else {
          setError('Failed to detect location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const searchCity = async (city: string) => {
    await runWeatherRequest(async () => {
      const locations = await geocodeCity(city);
      if (!locations.length) {
        throw new Error('City not found');
      }
      return {
        name: locations[0].name,
        weather: await fetchWeather(locations[0].lat, locations[0].lon),
      };
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void searchCity('Taupō');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        current,
        hourly,
        daily,
        selectedCity,
        isLoading,
        error,
        savedCities,
        searchCity,
        clearError,
        addSavedCity,
        removeSavedCity,
        fetchCurrentLocation,
        fetchWeatherByCoords,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
