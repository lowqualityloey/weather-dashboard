import type { MappedDaily } from '../lib/weatherMapper';
import { getIconUrl } from '../lib/weatherIcons';
import { Card, CardContent } from './ui/card';

interface ForecastDayProps {
  day: MappedDaily;
}

export default function ForecastDay({ day }: ForecastDayProps) {
  const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
  });
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{dayName}</span>
        </div>

        <div className="flex flex-col items-center">
          <img src={getIconUrl(day.icon)} alt={day.description} className="w-12 h-12" />
          <span className="text-sm text-muted-foreground capitalize">{day.description}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{day.tempMax}°</span>
          <span className="text-sm text-muted-foreground">{day.tempMin}°</span>
        </div>
      </CardContent>
    </Card>
  );
}
