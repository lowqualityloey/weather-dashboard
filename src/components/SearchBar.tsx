import { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useDebounce } from '../hooks/useDebounce';
import { geocodeCity } from '../lib/openWeather';
import type { GeoLocation } from '../types/weather';
import { Search, Loader2, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { searchCity, fetchWeatherByCoords, fetchCurrentLocation, isLoading } = useWeather();
  const debouncedQuery = useDebounce(query, 400);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    async function fetchSuggestions() {
      if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsSearchingSuggestions(true);
      try {
        const results = await geocodeCity(debouncedQuery.trim());
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }

    void fetchSuggestions();
  }, [debouncedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      await searchCity(query.trim());
    }
  };

  const handleSelectSuggestion = async (location: GeoLocation) => {
    setQuery(`${location.name}${location.country ? `, ${location.country}` : ''}`);
    setIsOpen(false);
    await fetchWeatherByCoords(location.lat, location.lon, location.name);
  };

  return (
    <div ref={dropdownRef} className="mx-auto w-full max-w-lg space-y-2 relative">
      <form role="search" className="relative" onSubmit={handleSubmit}>
        <Label htmlFor="location-search" className="mb-2">
          Search for a location
        </Label>
        <div className="relative">
          {isLoading || isSearchingSuggestions ? (
            <Loader2
              className="absolute left-4 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
              size={20}
            />
          ) : (
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
          )}
          <Input
            id="location-search"
            type="text"
            placeholder="Search for a location..."
            className="h-12 rounded-full bg-card pl-12 pr-12 text-base shadow-sm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            disabled={isLoading}
            autoComplete="off"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={fetchCurrentLocation}
            disabled={isLoading}
            aria-label="Use current location"
            title="Use current location"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <MapPin size={18} />
          </Button>
        </div>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-2xl border border-border bg-card p-1 shadow-lg backdrop-blur-md">
          {suggestions.map((loc, idx) => (
            <li key={`${loc.lat}-${loc.lon}-${idx}`}>
              <button
                type="button"
                onClick={() => handleSelectSuggestion(loc)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors"
              >
                <div className="font-medium text-foreground">
                  {loc.name}
                  {loc.state && (
                    <span className="text-muted-foreground font-normal">, {loc.state}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground bg-muted-foreground/10 px-2 py-0.5 rounded-md font-mono">
                  {loc.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
