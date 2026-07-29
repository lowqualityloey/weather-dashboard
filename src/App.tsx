import { SearchBar } from './components/SearchBar';

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-80 shrink-0 bg-sidebar p-6 text-sidebar-foreground md:block">
        <h2 className="text-lg font-semibold tracking-tight">Your Cities</h2>
      </aside>
      <main className="relative flex-1 p-6">
        <SearchBar />
      </main>
    </div>
  );
}

export default App;
