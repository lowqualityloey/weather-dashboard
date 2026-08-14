import type { MappedCurrent, MappedDaily, MappedHourly } from './weatherMapper';

export const mockCurrent: MappedCurrent = {
  temp: 24,
  feelsLike: 24,
  humidity: 60,
  windSpeed: 5,
  windDeg: 90,
  description: 'Sunny',
  icon: '01d',
};

export const mockDaily: MappedDaily[] = [];

export const mockHourly: MappedHourly[] = [];
