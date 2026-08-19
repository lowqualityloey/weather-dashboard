import type { MappedCurrent } from '../lib/weatherMapper';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { getIconUrl, getWindDirection } from '../lib/weatherIcons';

interface CurrentWeatherProps {
  data: MappedCurrent;
  cityName?: string;
}

export default function CurrentWeather({ data, cityName }: CurrentWeatherProps) {
  return (
    <Card className="bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {cityName ?? 'Current Location'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={getIconUrl(data.icon)} alt={data.description} className="h-24 w-24" />
            <div>
              <div className="text-5xl font-bold">{data.temp}°</div>
              <div className="text-lg">{data.description}</div>
            </div>
          </div>
          <div className="text-right">
            <div>Feels like: {data.feelsLike}°</div>
            <div>Humidity: {data.humidity}%</div>
            <div className="flex items-center justify-end gap-2">
              <Navigation
                className="h-4 w-4 fill-current transition-transform duration-300"
                style={{ transform: `rotate(${data.windDeg}deg)` }}
              />
              <span>
                {getWindDirection(data.windDeg)} ({data.windSpeed} km/h)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
