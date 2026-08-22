import { WeatherProvider, useWeather } from './context/WeatherContext';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';

//import { mockCurrent, mockDaily, mockHourly } from './lib/mockData';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';

import { ThemeProvider } from './context/ThemeContext';
import { MobileNav } from './components/MobileNav';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { ErrorAlert } from './components/ErrorAlert';
import { LiveAnnouncer } from './components/LiveAnnouncer';

function WeatherDashboard() {
  const { current, hourly, daily, selectedCity, isLoading, error } = useWeather();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <LiveAnnouncer />
      <main id="main-content" className="relative flex-1 p-6 space-y-6">
        <MobileNav />
        <SearchBar />

        {error && <ErrorAlert message={error} />}
        {isLoading && <WeatherSkeleton />}

        {current && !isLoading && (
          <>
            <CurrentWeather data={current} cityName={selectedCity} />
            <ForecastList daily={daily} hourly={hourly} />
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <WeatherDashboard />
      </WeatherProvider>
    </ThemeProvider>
  );
}
