import { WeatherProvider, useWeather } from './context/WeatherContext';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';

//import { mockCurrent, mockDaily, mockHourly } from './lib/mockData';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';

function WeatherDashboard() {
  const { current, hourly, daily, selectedCity, isLoading, error } = useWeather();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main id="main-content" className="relative flex-1 p-6 space-y-6">
        <SearchBar />

        {isLoading && (
          <div className="text-muted-foreground text-center py-8">Loading weather data...</div>
        )}
        {error && <div className="text-destructive text-center py-8">{error}</div>}

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
    <WeatherProvider>
      <WeatherDashboard />
    </WeatherProvider>
  );
}
