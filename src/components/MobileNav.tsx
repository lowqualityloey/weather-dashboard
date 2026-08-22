import { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { savedCities, removeSavedCity, searchCity, selectedCity } = useWeather();

  const handleSelectCity = (city: string) => {
    void searchCity(city);
    setIsOpen(false);
  };

  return (
    <div className="block md:hidden">
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open saved cities navigation"
        className="rounded-full"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Slide-over Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative z-50 flex w-72 max-w-[80vw] flex-col bg-sidebar p-6 text-sidebar-foreground shadow-2xl transition-transform">
            <div className="flex items-center justify-between pb-4 border-b border-sidebar-border">
              <h2 className="text-lg font-semibold tracking-tight">Your Cities</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {savedCities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved cities.</p>
              ) : (
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
                          onClick={() => handleSelectCity(city)}
                          className={`flex flex-1 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left ${
                            isSelected
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
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
              )}
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-4 border-t border-sidebar-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
