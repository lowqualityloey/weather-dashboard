import { describe, it } from 'vitest';
import { mapHourly } from '../lib/weatherMapper';
import type { HourlyWeather } from '../types/weather';

describe('ForecastList Performance Benchmark', () => {
  it('measures date formatting vs pre-computed string access', { timeout: 30000 }, () => {
    const rawHourly: HourlyWeather[] = Array.from({ length: 24 }, (_, i) => ({
      dt: 1700000000 + i * 3600,
      temp: 20 + i,
      weather: [{ description: 'clear sky', icon: '01d' }],
    }));

    const iterations = 1000;

    // Baseline: Creating Date and calling toLocaleTimeString in render loop
    const startBaseline = performance.now();
    let sink = '';
    for (let i = 0; i < iterations; i++) {
      for (let idx = 0; idx < rawHourly.length; idx++) {
        const h = rawHourly[idx];
        sink =
          idx === 0
            ? 'Now'
            : new Date(h.dt * 1000).toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: true,
              });
      }
    }
    const endBaseline = performance.now();
    const baselineTime = endBaseline - startBaseline;

    // Pre-computed approach
    // Step 1: Pre-compute formatted string when data is mapped via mapHourly
    const startPrecompute = performance.now();
    const mappedHourly = mapHourly(rawHourly);
    const endPrecompute = performance.now();
    const mapTime = endPrecompute - startPrecompute;

    // Step 2: Render loop accessing pre-computed string
    const startOptimized = performance.now();
    for (let i = 0; i < iterations; i++) {
      for (let idx = 0; idx < mappedHourly.length; idx++) {
        const h = mappedHourly[idx];
        sink = h.formattedTime;
      }
    }
    const endOptimized = performance.now();
    const optimizedRenderTime = endOptimized - startOptimized;

    // Ensure sink is used so compiler/linter doesn't complain
    void sink;

    console.log(`--- BENCHMARK RESULTS (${iterations} renders of 24 hourly items) ---`);
    console.log(`Baseline in-render formatting time: ${baselineTime.toFixed(2)}ms`);
    console.log(`Mapping time (one-time fetch): ${mapTime.toFixed(2)}ms`);
    console.log(`Optimized render time: ${optimizedRenderTime.toFixed(2)}ms`);
    console.log(
      `Speedup factor for renders: ${(baselineTime / Math.max(optimizedRenderTime, 0.001)).toFixed(1)}x faster`,
    );
  });
});
