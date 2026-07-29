const mockCities = [
  { name: 'Taupō', current: true },
  { name: 'Auckland', current: false },
  { name: 'Wellington', current: false },
];

export function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 bg-sidebar p-6 text-sidebar-foreground md:block">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Your Cities</h2>
      <ul className="space-y-2">
        {mockCities.map((city) => (
          <li key={city.name}>
            <a
              href="#"
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                city.current ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-muted'
              }`}
            >
              {city.name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
