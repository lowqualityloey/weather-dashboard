import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'h-9 w-9 rounded-full border border-sidebar-border bg-sidebar hover:bg-muted transition-all cursor-pointer',
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-foreground transition-all" />
      )}
    </Button>
  );
}
