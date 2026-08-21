import { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Search, Loader2, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const { searchCity, fetchCurrentLocation, isLoading } = useWeather();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      await searchCity(query);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <form role="search" className="relative" onSubmit={handleSubmit}>
        <Label htmlFor="location-search" className="mb-2">
          Search for a location
        </Label>
        <div className="relative">
          {isLoading ? (
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
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
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
    </div>
  );
}
