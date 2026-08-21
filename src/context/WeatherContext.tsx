import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MappedCurrent, MappedDaily, MappedHourly } from '../lib/weatherMapper';
import { geocodeCity, fetchWeather } from '../lib/openWeather';
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

  const clearError = () => setError(null);

  const addSavedCity = (city: string) => {
    setSavedCities((prev) =>
      prev.some((c) => c.toLowerCase() === city.toLowerCase()) ? prev : [...prev, city],
    );
  };

  const removeSavedCity = (city: string) => {
    setSavedCities((prev) => prev.filter((c) => c.toLowerCase() !== city.toLowerCase()));
  };

  const searchCity = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const locations = await geocodeCity(city);
      if (!locations.length) {
        throw new Error('City not found');
      }
      const weather = await fetchWeather(locations[0].lat, locations[0].lon);
      setCurrent(mapCurrent(weather));
      setDaily(mapDaily(weather.daily));
      setHourly(mapHourly(weather.hourly, new Date(), weather.timezone_offset));
      setSelectedCity(locations[0].name);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void searchCity('Taupō');
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
