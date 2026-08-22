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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-1">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={getIconUrl(data.icon)}
              alt={data.description}
              className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-md object-contain"
            />
            <div>
              <div className="text-4xl sm:text-5xl font-bold tracking-tight">{data.temp}°</div>
              <div className="text-base sm:text-lg text-blue-100 capitalize font-medium">
                {data.description}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-x-6 gap-y-1.5 text-sm sm:text-right text-blue-100 font-medium w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/15">
            <div>
              Feels like: <span className="font-semibold text-white">{data.feelsLike}°</span>
            </div>
            <div>
              Humidity: <span className="font-semibold text-white">{data.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Navigation
                className="h-4 w-4 fill-current transition-transform duration-300 text-white shrink-0"
                style={{ transform: `rotate(${data.windDeg}deg)` }}
                aria-hidden="true"
              />
              <span>
                {getWindDirection(data.windDeg)} (
                <span className="font-semibold text-white">{data.windSpeed} km/h</span>)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
