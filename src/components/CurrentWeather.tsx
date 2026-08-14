import type { MappedCurrent } from '../lib/weatherMapper';

interface CurrentWeatherProps {
  current: MappedCurrent;
  cityName?: string;
}

export default function CurrentWeather({ current, cityName }: CurrentWeatherProps) {
  return null;
}
