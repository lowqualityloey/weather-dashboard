export function SearchBar() {
  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search for a location"
        className="w-full rounded-full bg-card py-2 pl-12 pr-4 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
