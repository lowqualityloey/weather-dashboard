import type { MappedDaily, MappedHourly } from '../lib/weatherMapper';
import ForecastDay from './ForecastDay';
import { Card } from './ui/card';
import { Clock, CalendarDays } from 'lucide-react';
import { getIconUrl } from '../lib/weatherIcons';

interface ForecastListProps {
  daily: MappedDaily[];
  hourly?: MappedHourly[];
}

export default function ForecastList({ daily, hourly = [] }: ForecastListProps) {
  return (
    <div className="space-y-6">
      {/* 24-Hour Hourly Forecast Section */}
      {hourly.length > 0 && (
        <Card className="overflow-hidden bg-card border-border shadow-xs">
          <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                24-Hour Forecast
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Next 24 hours</span>
          </div>

          <div className="p-4 sm:p-5 pt-3">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 min-w-0 no-scrollbar scroll-smooth">
              {hourly.map((h, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center shrink-0 min-w-16 p-2 rounded-xl hover:bg-muted/60 transition-colors space-y-1.5"
                >
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {h.formattedTime ??
                      (idx === 0
                        ? 'Now'
                        : new Date(h.dt * 1000).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            hour12: true,
                          }))}
                  </span>
                  <img
                    src={getIconUrl(h.icon)}
                    alt={h.description || 'Weather icon'}
                    className="w-9 h-9 drop-shadow-xs object-contain"
                  />
                  <span className="text-base font-semibold text-foreground">{h.temp}°</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 5-Day Daily Forecast Section */}
      {daily.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              5-Day Forecast
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {daily.map((day) => (
              <ForecastDay key={day.dt} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
