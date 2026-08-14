import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';

import {mockCurrent} from './lib/mockData';
import CurrentWeather from './components/CurrentWeather';

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main id="main-content" className="relative flex-1 p-6 space-y-6">
        <SearchBar />
        <CurrentWeather data={mockCurrent}/>
      </main>
    </div>
  );
}

export default App;
