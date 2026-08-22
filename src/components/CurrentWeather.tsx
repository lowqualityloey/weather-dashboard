import type { MappedCurrent } from '../lib/weatherMapper';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { MapPin, Navigation, Star } from 'lucide-react';
import { getIconUrl, getWindDirection } from '../lib/weatherIcons';
import { useWeather } from '../context/WeatherContext';

interface CurrentWeatherProps {
  data: MappedCurrent;
  cityName?: string;
}

export default function CurrentWeather({ data, cityName }: CurrentWeatherProps) {
  const { savedCities, addSavedCity, removeSavedCity } = useWeather();
  const name = cityName ?? 'Current Location';
  const isSaved = savedCities.some((c) => c.toLowerCase() === name.toLowerCase());

  const handleToggleSave = () => {
    if (isSaved) {
      removeSavedCity(name);
    } else {
      addSavedCity(name);
    }
  };

  return (
    <Card className="bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <MapPin className="h-5 w-5 text-blue-200 shrink-0" />
          <span className="truncate">{name}</span>
        </CardTitle>
        <button
          type="button"
          onClick={handleToggleSave}
          title={isSaved ? `Remove ${name} from saved cities` : `Save ${name} to saved cities`}
          aria-label={isSaved ? `Remove ${name} from saved cities` : `Save ${name} to saved cities`}
          className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 cursor-pointer select-none active:scale-95 shadow-xs ${
            isSaved
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 hover:bg-amber-400/30'
              : 'bg-white/15 text-white/90 border border-white/25 hover:bg-white/25 hover:text-white'
          }`}
        >
          <Star
            className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
              isSaved
                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'text-white/80'
            }`}
          />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
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
