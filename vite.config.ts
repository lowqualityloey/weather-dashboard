/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { handleOpenWeatherProxy } from './src/server/openWeatherProxy';

function openWeatherProxyPlugin(apiKey: string): Plugin {
  return {
    name: 'openweather-proxy',
    configureServer(server) {
      server.middlewares.use('/api/weather', (req, res) => {
        void handleOpenWeatherProxy(req, res, apiKey);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/weather', (req, res) => {
        void handleOpenWeatherProxy(req, res, apiKey);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const openWeatherApiKey = env.OPENWEATHER_API_KEY || env.VITE_OPENWEATHER_API_KEY || '';

  return {
    plugins: [
      openWeatherProxyPlugin(openWeatherApiKey),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons.svg'],
        manifest: {
          name: 'SkyPulse Weather Dashboard',
          short_name: 'SkyPulse',
          description: 'Modern real-time weather dashboard with hourly & 5-day forecasts',
          theme_color: '#2563EB',
          background_color: '#F0F4F8',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: false,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: true,
      },
      hmr: {
        clientPort: 5173,
      },
    },
  };
});
