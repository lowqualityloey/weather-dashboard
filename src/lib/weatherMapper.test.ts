import { describe, it, expect } from 'vitest';
import { mapCurrent, mapDaily, mapHourly } from './weatherMapper';
import type { WeatherData, DailyWeather, HourlyWeather } from '../types/weather';

describe('weatherMapper utilities', () => {
  it('mapCurrent formats current weather metrics correctly', () => {
    const mockRaw: WeatherData = {
      timezone: 'Pacific/Auckland',
      timezone_offset: 43200,
      current: {
        temp: 21.6,
        feels_like: 20.4,
        humidity: 65,
        wind_speed: 5.5, // 5.5 m/s * 3.6 = 19.8 -> 20 km/h
        wind_deg: 180,
        weather: [{ description: 'scattered clouds', icon: '03d' }],
      },
      daily: [],
      hourly: [],
    };

    const result = mapCurrent(mockRaw);

    expect(result).toEqual({
      temp: 22,
      feelsLike: 20,
      humidity: 65,
      windSpeed: 20,
      windDeg: 180,
      description: 'scattered clouds',
      icon: '03d',
    });
  });

  it('mapDaily limits to 5 days and rounds temperatures', () => {
    const mockDaily: DailyWeather[] = Array.from({ length: 8 }, (_, i) => ({
      dt: 1700000000 + i * 86400,
      temp: { min: 12.3 + i, max: 22.7 + i },
      weather: [{ description: `day ${i} weather`, icon: '10d' }],
    }));

    const result = mapDaily(mockDaily);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({
      dt: 1700000000,
      tempMin: 12,
      tempMax: 23,
      description: 'day 0 weather',
      icon: '10d',
    });
  });

  it('mapHourly limits to 24 items and handles fallback icons', () => {
    const mockHourly: HourlyWeather[] = Array.from({ length: 30 }, (_, i) => ({
      dt: 1700000000 + i * 3600,
      temp: 18.2,
      weather: [{ description: 'clear sky', icon: '01d' }],
    }));

    const result = mapHourly(mockHourly);

    expect(result).toHaveLength(24);
    expect(result[0].temp).toBe(18);
    expect(result[0].icon).toBe('01d');
    expect(result[0].formattedTime).toBe('Now');
    expect(result[1].formattedTime).toMatch(/\d{1,2}\s?(AM|PM)/i);
  });
});
