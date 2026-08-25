import { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useDebounce } from '../hooks/useDebounce';
import { geocodeCity } from '../lib/openWeather';
import type { GeoLocation } from '../types/weather';
import { Search, Loader2, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { searchCity, fetchWeatherByCoords, fetchCurrentLocation, isLoading } = useWeather();
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        setActiveIndex(-1);
        return;
      }

      setIsSearchingSuggestions(true);
      try {
        const results = await geocodeCity(debouncedQuery.trim());
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }

    void fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      await handleSelectSuggestion(suggestions[activeIndex]);
      return;
    }
    if (query.trim()) {
      setIsOpen(false);
      await searchCity(query.trim());
    }
  };

  const handleSelectSuggestion = async (location: GeoLocation) => {
    setQuery(`${location.name}${location.country ? `, ${location.country}` : ''}`);
    setIsOpen(false);
    setActiveIndex(-1);
    await fetchWeatherByCoords(location.lat, location.lon, location.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
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
              aria-hidden="true"
            />
          ) : (
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
              aria-hidden="true"
            />
          )}
          <Input
            id="location-search"
            type="text"
            role="combobox"
            aria-expanded={isOpen && suggestions.length > 0}
            aria-controls="location-suggestions-list"
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `suggestion-option-${activeIndex}` : undefined
            }
            placeholder="Search for a location..."
            className="h-12 rounded-full bg-card pl-12 pr-14 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              setQuery('');
              fetchCurrentLocation();
            }}
            disabled={isLoading}
            aria-label="Use current location"
            title="Use current location"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-primary active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id="location-suggestions-list"
          role="listbox"
          aria-label="Location suggestions"
          className="absolute z-50 mt-1 w-full rounded-2xl border border-border bg-card p-1 shadow-lg backdrop-blur-md"
        >
          {suggestions.map((loc, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <li
                id={`suggestion-option-${idx}`}
                key={`${loc.lat}-${loc.lon}-${idx}`}
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(loc)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                    isSelected ? 'bg-muted text-primary' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="font-medium">
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
