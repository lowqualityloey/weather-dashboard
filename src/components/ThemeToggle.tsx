import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="rounded-full"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-all" />
      )}
    </Button>
  );
}
