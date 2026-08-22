import { useWeather, type SavedCity } from '../context/WeatherContext';
import { X } from 'lucide-react';

interface SavedCitiesListProps {
  onSelect?: (city: SavedCity) => void;
}

export function SavedCitiesList({ onSelect }: SavedCitiesListProps) {
  const { savedCities, removeSavedCity, selectSavedCity, selectedCity } = useWeather();

  const selectCity = (city: SavedCity) => {
    if (onSelect) {
      onSelect(city);
      return;
    }
    void selectSavedCity(city);
  };

  if (savedCities.length === 0) {
    return <p className="text-sm text-muted-foreground">No saved cities.</p>;
  }

  return (
    <ul className="space-y-2">
      {savedCities.map((city) => {
        const isSelected = city.name.toLowerCase() === selectedCity.toLowerCase();
        return (
          <li
            key={city.name}
            className="group flex items-center justify-between rounded-lg transition-colors"
          >
            <button
              type="button"
              onClick={() => selectCity(city)}
              className={`flex flex-1 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left ${
                isSelected
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-muted text-sidebar-foreground'
              }`}
            >
              <span className="truncate">{city.name}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSavedCity(city.name);
              }}
              aria-label={`Remove ${city.name}`}
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
