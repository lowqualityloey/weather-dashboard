# 🌤️ Modern Weather Dashboard (SkyPulse)

A high-performance, responsive Progressive Web App (PWA) built with React 19, TypeScript, Tailwind CSS v4, and OpenWeather APIs. It delivers real-time weather metrics, debounced location search with autocomplete, interactive 24-hour carousels, 5-day forecasts, GPS location detection, client-side caching with TTL, saved city persistence, dark mode, screen-reader accessibility, and an automated GitHub Actions CI pipeline.

---

## 🚀 Key Features

### 🔍 Search & Geolocation

- **Debounced Location Search:** 400ms debounced queries via custom `useDebounce` hook with real-time geocoding autocomplete suggestions.
- **One-Click GPS Detection:** Auto-detect current coordinates using `navigator.geolocation` with reverse geocoding fallback.
- **Keyboard Navigation:** Full WAI-ARIA combobox support with `ArrowUp`, `ArrowDown`, `Enter`, and `Escape` keyboard shortcuts.

### 📊 Weather Insights

- **Current Conditions Card:** Temperature, "feels like", condition icon, humidity, and rotating wind compass with metric conversion (`km/h`).
- **24-Hour Hourly Forecast:** Smooth horizontal scrolling carousel showing temperature curves and weather conditions throughout the day.
- **5-Day Extended Forecast:** Structured daily forecast cards displaying condition descriptions and min/max temperature ranges.

### 💾 Performance & State Management

- **TTL Client-Side Caching:** 10-minute cache layer (`cache.ts`) using `localStorage` to eliminate redundant API calls and stay well within API quotas.
- **Favorite Cities Persistence:** Save favorite locations with duplicate prevention and synchronized `localStorage` state across sessions.
- **Theme Customization:** System, light, and dark mode theming with smooth transition toggles.
- **Loading & Error Feedback:** Skeleton placeholders (`WeatherSkeleton.tsx`) and dismissible error alerts (`ErrorAlert.tsx`).
- **Screen Reader Support:** Accessible `LiveAnnouncer` with `aria-live="polite"` region broadcasting status updates and weather reports.

### 📱 Progressive Web App (PWA) & CI/CD

- **Installable PWA:** Configured via `vite-plugin-pwa` with Web App Manifest, maskable SVG icons, and Workbox offline asset precaching.
- **Continuous Integration (CI):** Automated GitHub Actions workflow (`.github/workflows/ci.yml`) validating Prettier formatting, ESLint rules, TypeScript checks, Vitest unit tests, and production bundling on every push and PR.

---

## 🛠️ Tech Stack

| Technology                         | Purpose                                               |
| :--------------------------------- | :---------------------------------------------------- |
| **React 19**                       | Component architecture and state management           |
| **TypeScript**                     | Strict compile-time type safety                       |
| **Vite 8**                         | High-speed frontend build tool and dev server         |
| **Tailwind CSS 4**                 | Modern utility-first CSS design tokens                |
| **shadcn/ui + Base UI**            | Accessible headless UI component primitives           |
| **Vitest & React Testing Library** | Unit testing suite with 100% test pass rate           |
| **vite-plugin-pwa**                | Progressive Web App & Service Worker precaching       |
| **GitHub Actions**                 | Automated CI/CD test and build validation pipeline    |
| **Geist Variable Font**            | Self-hosted typography (`@fontsource-variable/geist`) |
| **Lucide React**                   | Feather-light SVG icons                               |
| **OpenWeather One Call & Geo API** | Real-time weather and geocoding endpoints             |

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── ui/                  # Base UI / shadcn accessible primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── CurrentWeather.tsx   # Hero weather card with favorite toggle & wind direction
│   ├── ErrorAlert.tsx       # Dismissible alert banner
│   ├── ForecastDay.tsx      # Individual daily forecast card
│   ├── ForecastList.tsx     # 24-hour carousel + 5-day forecast grid
│   ├── LiveAnnouncer.tsx    # Screen reader aria-live announcement region
│   ├── MobileNav.tsx        # Slide-over navigation drawer for saved cities
│   ├── SearchBar.tsx        # Debounced combobox with GPS location detection
│   ├── Sidebar.tsx          # Saved cities sidebar with theme toggle
│   ├── ThemeToggle.tsx      # Light/dark mode button
│   └── WeatherSkeleton.tsx  # Pulsing skeleton loading state
├── context/
│   ├── ThemeContext.tsx     # Theme state provider (light/dark/system)
│   └── WeatherContext.tsx   # Global weather and saved cities provider
├── hooks/
│   ├── useDebounce.test.ts  # Fake timer unit tests for debounced queries
│   ├── useDebounce.ts       # Generic debouncing hook
│   ├── useLocalStorage.test.ts # Storage persistence unit tests
│   └── useLocalStorage.ts  # Synchronized localStorage state hook
├── lib/
│   ├── cache.test.ts        # TTL cache expiration unit tests
│   ├── cache.ts             # Generic localStorage cache with TTL
│   ├── env.ts               # Runtime environment variable validation
│   ├── openWeather.ts       # OpenWeather API client + reverse geocoding
│   ├── utils.ts             # cn() utility helper
│   ├── weatherIcons.ts      # OpenWeather icon URL mapping
│   ├── weatherMapper.test.ts # Metric conversions and data slicing unit tests
│   └── weatherMapper.ts     # OpenWeather response transformer
├── test/
│   └── setup.ts             # Vitest DOM matcher setup (@testing-library/jest-dom)
├── types/
│   └── weather.ts           # TypeScript interfaces for API models
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🧪 Testing Suite

The repository includes a comprehensive unit testing suite using **Vitest** and **React Testing Library**:

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch
```

**Tested Areas:**

- `cache.test.ts`: Cache retrieval, TTL expiration handling, and stale key eviction.
- `weatherMapper.test.ts`: Wind speed conversions (`m/s` to `km/h`), rounding, 5-day daily slicing, and 24-hour hourly limits.
- `useDebounce.test.ts`: Timed value propagation using `vi.useFakeTimers()`.
- `useLocalStorage.test.ts`: State initialization, updates, and persistence.

---

## ⚡ Getting Started

### Prerequisites

- **Node.js**: v20 or later
- **npm**: v10 or later
- An [OpenWeather API Key](https://openweathermap.org/api)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/lowqualityloey/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:

   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

4. **Start the Local Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📜 Available Scripts

| Script               | Command                | Purpose                                                   |
| :------------------- | :--------------------- | :-------------------------------------------------------- |
| **Dev Server**       | `npm run dev`          | Starts Vite local development server with HMR             |
| **Run Tests**        | `npm test`             | Executes Vitest unit tests                                |
| **Type Check**       | `npx tsc --noEmit`     | Runs strict TypeScript validation                         |
| **Lint Code**        | `npm run lint`         | Runs ESLint                                               |
| **Format Check**     | `npm run format:check` | Verifies Prettier code formatting                         |
| **Format Code**      | `npm run format`       | Automatically formats all files with Prettier             |
| **Build Production** | `npm run build`        | Compiles optimized production bundle & PWA service worker |
| **Preview Build**    | `npm run preview`      | Serves local production build from `dist/`                |

---

## 👤 Author

**Jonell Balanay**

- GitHub: [@lowqualityloey](https://github.com/lowqualityloey)
- Location: Taupō, New Zealand

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
