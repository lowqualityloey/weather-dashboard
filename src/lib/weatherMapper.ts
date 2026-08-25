import type { WeatherData, DailyWeather, HourlyWeather } from '../types/weather';

export interface MappedCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  icon: string;
}

export interface MappedDaily {
  dt: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
}

export interface MappedHourly {
  dt: number;
  temp: number;
  description: string;
  icon: string;
}

export function mapCurrent(data: WeatherData): MappedCurrent {
  const { current } = data;
  return {
    temp: Math.round(current.temp),
    feelsLike: Math.round(current.feels_like),
    humidity: current.humidity,
    windSpeed: Math.round(current.wind_speed * 3.6),
    windDeg: current.wind_deg,
    description: current.weather[0]?.description ?? '',
    icon: current.weather[0]?.icon ?? '01d',
  };
}

export function mapDaily(daily: DailyWeather[]): MappedDaily[] {
  return daily.slice(0, 5).map((d) => ({
    dt: d.dt,
    tempMin: Math.round(d.temp.min),
    tempMax: Math.round(d.temp.max),
    description: d.weather[0]?.description ?? '',
    icon: d.weather[0]?.icon ?? '01d',
  }));
}

export function mapHourly(hourly: HourlyWeather[]): MappedHourly[] {
  return hourly.slice(0, 24).map((h) => ({
    dt: h.dt,
    temp: Math.round(h.temp),
    description: h.weather[0]?.description ?? '',
    icon: h.weather[0]?.icon ?? '01d',
  }));
}
