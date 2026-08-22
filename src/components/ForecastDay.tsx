import type { MappedDaily } from '../lib/weatherMapper';
import { getIconUrl } from '../lib/weatherIcons';
import { Card } from './ui/card';

interface ForecastDayProps {
  day: MappedDaily;
}

export default function ForecastDay({ day }: ForecastDayProps) {
  const dateObj = new Date(day.dt * 1000);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Card className="flex flex-col items-center justify-between p-4 text-center transition-all duration-200 hover:shadow-md hover:border-primary/40 bg-card">
      <div className="space-y-0.5">
        <span className="font-semibold text-foreground text-base">{dayName}</span>
        <div className="text-xs text-muted-foreground">{dateFormatted}</div>
      </div>

      <div className="my-3 flex flex-col items-center">
        <img
          src={getIconUrl(day.icon)}
          alt={day.description}
          className="w-12 h-12 drop-shadow-xs object-contain"
        />
        <span
          className="text-xs text-muted-foreground capitalize line-clamp-1 max-w-30 font-medium"
          title={day.description}
        >
          {day.description}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2.5 w-full pt-2.5 border-t border-border/50">
        <span className="text-base font-bold text-foreground">{day.tempMax}°</span>
        <span className="text-sm text-muted-foreground font-medium">{day.tempMin}°</span>
      </div>
    </Card>
  );
}
