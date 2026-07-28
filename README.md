# 🌤️ Modern Weather Dashboard

A responsive weather dashboard built with React and TypeScript as a refresher project. It lets users search for locations, view current conditions and a five-day forecast, expand a day for hourly weather, save favourite cities, and switch between light and dark themes.

> This project focuses on refreshing React, TypeScript, API integration, responsive UI development, state management, local storage, Git workflow, and deployment.

## Live Demo

🚧 Coming soon

## Preview

🚧 Screenshots coming soon

## Features

### Core Features

- Search for a city using the OpenWeather Geocoding API
- View current weather conditions
  - Temperature
  - “Feels like” temperature
  - Weather condition and icon
  - Humidity
  - Wind speed and direction
- View a five-day forecast
- Expand a forecast day to view weather at three-hour intervals
- Save and remove favourite cities
- Persist saved cities with `localStorage`
- Toggle between light and dark themes
- Responsive desktop and mobile layouts
- Use metric units: Celsius and kilometres per hour

### Stretch Features

- Browser geolocation for the user’s current location
- Celsius/Fahrenheit unit toggle
- Search-result suggestions for locations with the same name
- Skeleton loading states
- “Last updated” weather timestamp
- Request caching and debounced search
- Progressive Web App support

## Design Reference

The dashboard is inspired by a modern, calm weather interface with:

- Pale blue gradient background
- White, rounded weather cards with soft shadows
- A sidebar for saved cities
- A central current-weather card
- Expandable forecast rows
- A fixed light/dark mode switch

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe JavaScript |
| Vite | Development server and production build tooling |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible and reusable UI component primitives |
| Lucide React | Icons |
| OpenWeather Geocoding API | Convert location names into coordinates |
| OpenWeather One Call API 4.0 | Current, hourly, and daily weather data |
| localStorage | Save favourite cities and theme preference |
| Cloudflare Pages | Planned hosting and deployment |

## Project Structure

```text
src/
├── components/
│   ├── ui/                  # shadcn/ui generated components
│   ├── Sidebar.tsx          # Saved cities navigation
│   ├── SearchBar.tsx        # Location search input
│   ├── CurrentWeather.tsx   # Current conditions card
│   ├── ForecastList.tsx     # Five-day forecast container
│   ├── ForecastDay.tsx      # Forecast row and expandable hourly panel
│   └── ThemeToggle.tsx      # Light/dark mode switch
├── lib/
│   ├── openWeather.ts       # OpenWeather API requests
│   ├── weatherMapper.ts     # API response to UI data mapping
│   ├── weatherIcons.ts      # Weather condition icon helpers
│   └── utils.ts             # shadcn/ui utility functions
├── types/
│   └── weather.ts           # TypeScript weather interfaces
├── App.tsx
├── main.tsx
└── index.css
```

## API Flow

OpenWeather One Call API requests require latitude and longitude, so the app uses two API calls:

1. The user searches for a city, for example `Taupō`.
2. The Geocoding API returns matching locations with coordinates.
3. The app selects a location and sends its latitude and longitude to One Call API 4.0.
4. The app maps the response into UI-friendly data and displays it.

```text
City search
    ↓
OpenWeather Geocoding API
    ↓
Latitude + Longitude
    ↓
OpenWeather One Call API 4.0
    ↓
Current weather + hourly forecast + daily forecast
```

## Weather Data Mapping

| Dashboard item | One Call API field |
|---|---|
| Current temperature | `current.temp` |
| Feels-like temperature | `current.feels_like` |
| Humidity | `current.humidity` |
| Wind speed | `current.wind_speed` |
| Wind direction | `current.wind_deg` |
| Current weather condition | `current.weather[0].description` |
| Current weather icon | `current.weather[0].icon` |
| Five-day forecast | `daily.slice(0, 5)` |
| Expanded hourly forecast | `hourly`, filtered for the selected date |
| Time zone | `timezone` and `timezone_offset` |

## Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) version 20 or later
- Yarn, npm, or another Node package manager
- An OpenWeather API key
- A GitHub account for version control and deployment

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

## shadcn/ui Setup

This project uses shadcn/ui with the **Nova** preset.

To initialise shadcn/ui in the existing Vite project:

```bash
npx shadcn@latest init
```

Add UI components as they are needed:

```bash
npx shadcn@latest add button card input switch collapsible badge
```

The dashboard will use shadcn/ui primitives as a foundation, then customise them with Tailwind classes to match the weather-dashboard design.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_OPENWEATHER_API_KEY` | OpenWeather API key used by the frontend |

> **Security note:** Variables prefixed with `VITE_` are included in the client-side application bundle. Do not use a sensitive unrestricted production key in a public frontend application. For this portfolio project, use an API key with appropriate usage monitoring or restrictions.

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Starts the Vite development server |
| `yarn build` | Creates an optimised production build in `dist/` |
| `yarn lint` | Runs ESLint |
| `yarn preview` | Runs a local preview of the production build |

## Development Roadmap

- [ ] Write and confirm project scope
- [ ] Configure shadcn/ui and Tailwind CSS
- [ ] Create the design system and theme tokens
- [ ] Build the static dashboard using mock data
- [ ] Add forecast accordion and theme toggle interactions
- [ ] Build OpenWeather API service and TypeScript types
- [ ] Connect city search and live weather data
- [ ] Add saved cities with `localStorage`
- [ ] Add responsive and accessibility improvements
- [ ] Finalise documentation and screenshots
- [ ] Deploy to Cloudflare Pages

The complete task backlog is managed in Notion.

## Deployment

Deployment is planned through **Cloudflare Pages**.

### Planned Cloudflare Pages Settings

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `yarn build` |
| Build output directory | `dist` |
| Environment variable | `VITE_OPENWEATHER_API_KEY` |

Before deploying:

```bash
yarn lint
yarn build
```

The deployed app should be tested for city search, weather loading, saved cities, theme switching, and mobile responsiveness.

## Learning Goals

This project is intended to refresh and demonstrate:

- Building reusable React components
- Using TypeScript interfaces for API data
- Managing state with React hooks
- Fetching and handling asynchronous API data
- Handling loading, error, and empty UI states
- Designing responsive layouts with Tailwind CSS
- Using shadcn/ui components effectively
- Persisting client-side data using `localStorage`
- Managing environment variables in Vite
- Writing clean commits and documentation
- Deploying a frontend application

## Future Improvements

- Add browser-location weather
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
- [Lucide](https://lucide.dev/) for icons