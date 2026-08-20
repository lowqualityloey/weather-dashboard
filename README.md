# 🌤️ Modern Weather Dashboard

A responsive weather dashboard built with React and TypeScript as a refresher project. It lets users search for locations, view current conditions and a five-day forecast, expand a day for hourly weather, save favourite cities, and switch between light and dark themes.

> This project focuses on refreshing React, TypeScript, API integration, responsive UI development, state management, local storage, Git workflow, and deployment.

## Live Demo

🚧 Coming soon

## Preview

🚧 Screenshots coming soon

## Features

### Core Features

- [ ] Search for a city using the OpenWeather Geocoding API
- [x] View current weather conditions
  - Temperature
  - "Feels like" temperature
  - Weather condition and icon
  - Humidity
  - Wind speed and direction
- [x] View a five-day forecast
- [x] Expand a forecast day to view weather at three-hour intervals
- [ ] Save and remove favourite cities
- [ ] Persist saved cities with `localStorage`
- [ ] Toggle between light and dark themes
- [x] Responsive desktop and mobile layouts
- [x] Use metric units: Celsius and kilometres per hour

### Stretch Features

- [ ] Browser geolocation for the user's current location
- [ ] Celsius/Fahrenheit unit toggle
- [ ] Search-result suggestions for locations with the same name
- [ ] Skeleton loading states
- [ ] "Last updated" weather timestamp
- [ ] Request caching and debounced search
- [ ] Progressive Web App support

## Design Reference

The dashboard is inspired by a modern, calm weather interface with:

- Pale blue gradient background
- White, rounded weather cards with soft shadows
- A sidebar for saved cities
- A central current-weather card
- Expandable forecast rows

## Tech Stack

| Technology                   | Purpose                                                       |
| ---------------------------- | ------------------------------------------------------------- |
| React 19                     | Component-based user interface                                |
| TypeScript 6                 | Type-safe JavaScript                                          |
| Vite 8                       | Development server and production build tooling               |
| Tailwind CSS 4               | Utility-first styling                                         |
| shadcn/ui + Base UI          | Accessible and reusable UI component primitives (Nova preset) |
| Lucide React                 | Icons                                                         |
| Geist (variable font)        | Typography                                                    |
| ESLint + Prettier            | Linting and formatting                                        |
| OpenWeather Geocoding API    | Convert location names into coordinates                       |
| OpenWeather One Call API 3.0 | Current, hourly, and daily weather data                       |

## Project Structure

```text
src/
├── components/
│   ├── ui/                  # shadcn/ui components (Base UI + Nova)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── collapsible.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── switch.tsx
│   ├── SearchBar.tsx        # Location search input (presentational)
│   ├── Sidebar.tsx          # City list sidebar (mock data)
│   ├── CurrentWeather.tsx   # Current conditions card (stub)
│   ├── ForecastList.tsx     # Five-day forecast container (stub)
│   └── ForecastDay.tsx      # Forecast row + hourly panel (stub)
├── lib/
│   ├── openWeather.ts       # OpenWeather API requests
│   ├── weatherMapper.ts     # API response → UI data mapping
│   ├── weatherIcons.ts      # Weather condition icon helpers
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
├── types/
│   └── weather.ts           # TypeScript weather interfaces
├── App.tsx
├── main.tsx
└── index.css                # Tailwind v4 imports, theme tokens, base styles
```

## API Flow

OpenWeather One Call API requests require latitude and longitude, so the app uses two API calls:

1. The user searches for a city, for example `Taupō`.
2. The Geocoding API returns matching locations with coordinates.
3. The app selects a location and sends its latitude and longitude to One Call API 3.0.
4. The app maps the response into UI-friendly data and displays it.

```text
City search
    ↓
OpenWeather Geocoding API
    ↓
Latitude + Longitude
    ↓
OpenWeather One Call API 3.0
    ↓
Current weather + hourly forecast + daily forecast
```

## Weather Data Mapping

| Dashboard item            | One Call API field                       |
| ------------------------- | ---------------------------------------- |
| Current temperature       | `current.temp`                           |
| Feels-like temperature    | `current.feels_like`                     |
| Humidity                  | `current.humidity`                       |
| Wind speed                | `current.wind_speed`                     |
| Wind direction            | `current.wind_deg`                       |
| Current weather condition | `current.weather[0].description`         |
| Current weather icon      | `current.weather[0].icon`                |
| Five-day forecast         | `daily.slice(0, 5)`                      |
| Expanded hourly forecast  | `hourly`, filtered for the selected date |
| Time zone                 | `timezone` and `timezone_offset`         |

## Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) version 20 or later
- Yarn (package manager)
- An OpenWeather API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lowqualityloey/weather-dashboard.git
   ```

2. Move into the project directory:

   ```bash
   cd weather-dashboard
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Create a local environment file:

   ```bash
   touch .env
   ```

5. Add your OpenWeather API key to `.env`:

   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

6. Start the development server:

   ```bash
   yarn dev
   ```

7. Open the local URL shown in your terminal, usually:

   ```text
   http://localhost:5173
   ```

## Available Scripts

| Command             | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `yarn dev`          | Start the Vite development server                                |
| `yarn build`        | Type-check with `tsc -b` then create production build in `dist/` |
| `yarn lint`         | Run ESLint                                                       |
| `yarn format`       | Format all files with Prettier                                   |
| `yarn format:check` | Check if files are formatted (CI-friendly)                       |
| `yarn preview`      | Preview the production build locally                             |

## shadcn/ui Setup

This project uses shadcn/ui with the **Base UI + Nova** preset.

The following components are already installed:

```
button, card, input, label, switch, collapsible, badge
```

To add a new component:

```bash
npx shadcn@latest add <component-name>
```

Component configuration is in `components.json` (points to `tsconfig.app.json` for path alias resolution).

## Environment Variables

| Variable                   | Description                              |
| -------------------------- | ---------------------------------------- |
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API key used by the frontend |

> **Security note:** Variables prefixed with `VITE_` are included in the client-side application bundle. Do not use a sensitive unrestricted production key in a public frontend application.

## Development Roadmap

- [x] Write and confirm project scope
- [x] Project scaffold — Vite + React + TypeScript + Tailwind CSS
- [x] Configure shadcn/ui (Base UI + Nova preset)
- [x] Set up ESLint (flat config) + Prettier
- [x] Build OpenWeather API service and TypeScript types
- [x] Add data mappers and weather icon helpers
- [x] Install UI component primitives (Button, Card, Input, Label, Badge, Switch, Collapsible)
- [x] Build the static dashboard using mock data
- [ ] Add forecast accordion and theme toggle interactions
- [ ] Connect city search and live weather data
- [ ] Add saved cities with `localStorage`
- [ ] Add responsive and accessibility improvements
- [ ] Finalise documentation and screenshots
- [ ] Deploy to Cloudflare Pages

The complete task backlog is managed in Notion.

## Deployment

Deployment is planned through **Cloudflare Pages**.

### Planned Cloudflare Pages Settings

| Setting                | Value                      |
| ---------------------- | -------------------------- |
| Framework              | Vite                       |
| Build command          | `yarn build`               |
| Build output directory | `dist`                     |
| Environment variable   | `VITE_OPENWEATHER_API_KEY` |

Before deploying:

```bash
yarn lint
yarn build
```

## Learning Goals

This project is intended to refresh and demonstrate:

- Building reusable React components
- Using TypeScript interfaces for API data
- Managing state with React hooks
- Fetching and handling asynchronous API data
- Handling loading, error, and empty UI states
- Designing responsive layouts with Tailwind CSS
- Using shadcn/ui with Base UI primitives effectively
- Persisting client-side data using `localStorage`
- Managing environment variables in Vite
- Writing clean commits and documentation
- Deploying a frontend application

## Future Improvements

- Add browser-location weather
- Celsius/Fahrenheit unit toggle
- Add a 7-day / 10-day forecast view
- Display precipitation probability and UV index
- Add weather charts
- Add offline support
- Add a backend or serverless proxy to keep API credentials private

## Author

**Jonell Balanay**

- GitHub: [@lowqualityloey](https://github.com/lowqualityloey)
- Location: Taupō, New Zealand

## Acknowledgements

- [OpenWeather](https://openweathermap.org/) for weather and geocoding data
- [shadcn/ui](https://ui.shadcn.com/) for reusable UI component primitives
- [Base UI](https://base-ui.dev/) for accessible headless primitives
- [Lucide](https://lucide.dev/) for icons
