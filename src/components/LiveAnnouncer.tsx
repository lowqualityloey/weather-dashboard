import { useWeather } from '../context/WeatherContext';

export function LiveAnnouncer() {
  const { current, selectedCity, isLoading, error } = useWeather();

  let message = '';
  if (error) {
    message = `Error: ${error}`;
  } else if (isLoading) {
    message = 'Loading weather information...';
  } else if (current && selectedCity) {
    message = `Weather for ${selectedCity} updated. Temperature is ${current.temp} degrees Celsius, ${current.description}.`;
  }

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
