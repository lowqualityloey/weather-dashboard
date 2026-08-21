import { useWeather } from '../context/WeatherContext';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  const { clearError } = useWeather();

  return (
    <div
      role="alert"
      className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive shadow-xs"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={clearError}
        aria-label="Dismiss error"
        className="h-8 w-8 text-destructive hover:bg-destructive/20 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
