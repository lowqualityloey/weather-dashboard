import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';

import { mockCurrent, mockDaily } from './lib/mockData';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main id="main-content" className="relative flex-1 p-6 space-y-6">
        <SearchBar />
        <CurrentWeather data={mockCurrent} />
        <ForecastList daily={mockDaily} />
      </main>
    </div>
  );
}

export default App;
