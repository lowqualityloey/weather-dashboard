import { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const { searchCity, isLoading } = useWeather();

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
            className="h-12 rounded-full bg-card pl-12 pr-4 text-base shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}
