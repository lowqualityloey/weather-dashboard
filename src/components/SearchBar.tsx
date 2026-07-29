import { Search } from 'lucide-react';
import { Input } from './ui/input';

export function SearchBar() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={20}
      />
      <Input
        type="text"
        placeholder="Search for a location..."
        className="h-12 rounded-full bg-card pl-12 pr-4 text-base shadow-sm"
      />
    </div>
  );
}
