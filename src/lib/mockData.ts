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

export const mockDaily: MappedDaily[] = [
  {
    dt: 1678886400,
    tempMin: 20,
    tempMax: 28,
    description: 'Mostly sunny',
    icon: '02d',
  },
  {
    dt: 1678972800,
    tempMin: 15,
    tempMax: 25,
    description: 'Light rain',
    icon: '10d',
  },
  {
    dt: 1679059200,
    tempMin: 15,
    tempMax: 25,
    description: 'Scattered clouds',
    icon: '03d',
  },
  {
    dt: 1679145600,
    tempMin: 13,
    tempMax: 23,
    description: 'Sunny',
    icon: '01d',
  },
  {
    dt: 1679232000,
    tempMin: 16,
    tempMax: 26,
    description: 'Broken clouds',
    icon: '04d',
  },
];

export const mockHourly: MappedHourly[] = [
  {
    dt: 1678908000,
    temp: 16,
    description: 'Light Rain',
    icon: '10d',
  },
  {
    dt: 1678918800,
    temp: 22,
    description: 'Mostly sunny',
    icon: '02d',
  },
  {
    dt: 1678929600,
    temp: 20,
    description: 'Scattered clouds',
    icon: '03d',
  },
  {
    dt: 1678940400,
    temp: 28,
    description: 'Sunny',
    icon: '01d',
  },

  {
    dt: 1678962000,
    temp: 17,
    description: 'Broken clouds',
    icon: '04d',
  },
];
