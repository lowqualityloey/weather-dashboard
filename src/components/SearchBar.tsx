import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function SearchBar() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-2">
      <form role="search" className="relative">
        <Label htmlFor="location-search" className="mb-2">
          Search for a location
        </Label>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            id="location-search"
            type="text"
            placeholder="Search for a location..."
            className="h-12 rounded-full bg-card pl-12 pr-4 text-base shadow-sm"
          />
        </div>
      </form>
    </div>
  );
}
