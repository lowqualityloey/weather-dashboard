import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="relative flex-1 p-6">
        <SearchBar />
      </main>
    </div>
  );
}

export default App;
