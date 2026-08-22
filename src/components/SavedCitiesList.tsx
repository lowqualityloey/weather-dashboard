import { useWeather } from '../context/WeatherContext';
import { X } from 'lucide-react';

interface SavedCitiesListProps {
  onSelect?: (city: string) => void;
}

export function SavedCitiesList({ onSelect }: SavedCitiesListProps) {
  const { savedCities, removeSavedCity, searchCity, selectedCity } = useWeather();

  const handleSelect = (city: string) => {
    if (onSelect) {
      onSelect(city);
    } else {
      void searchCity(city);
    }
  };

  if (savedCities.length === 0) {
    return <p className="text-sm text-muted-foreground">No saved cities.</p>;
  }

  return (
    <ul className="space-y-2">
      {savedCities.map((city) => {
        const isSelected = city.toLowerCase() === selectedCity.toLowerCase();
        return (
          <li
            key={city}
            className="group flex items-center justify-between rounded-lg transition-colors"
          >
            <button
              type="button"
              onClick={() => handleSelect(city)}
              className={`flex flex-1 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left ${
                isSelected
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-muted text-sidebar-foreground'
              }`}
            >
              <span className="truncate">{city}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSavedCity(city);
              }}
              aria-label={`Remove ${city}`}
              className="ml-1 rounded-md p-1.5 text-muted-foreground opacity-70 transition-opacity hover:bg-muted hover:text-foreground hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
