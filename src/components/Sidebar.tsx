import { ThemeToggle } from './ThemeToggle';
import { SavedCitiesList } from './SavedCitiesList';

export function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 bg-sidebar p-6 text-sidebar-foreground md:flex md:flex-col md:justify-between h-screen sticky top-0 border-r border-sidebar-border">
      <div className="flex-1 overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Your Cities</h2>
        <SavedCitiesList />
      </div>

      <div className="pt-4 border-t border-sidebar-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Appearance</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
