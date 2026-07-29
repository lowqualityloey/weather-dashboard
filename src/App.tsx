import { SearchBar } from './components/SearchBar';

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-80 shrink-0 bg-sidebar md:block"></aside>
      <main className="flex-1 p-6">
        <SearchBar />
      </main>
    </div>
  );
}

export default App;
