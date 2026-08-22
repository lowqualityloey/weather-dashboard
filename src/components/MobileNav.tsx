import { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { SavedCitiesList } from './SavedCitiesList';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { searchCity } = useWeather();

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
              <SavedCitiesList onSelect={handleSelectCity} />
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
