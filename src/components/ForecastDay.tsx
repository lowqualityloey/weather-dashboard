import type { MappedDaily, MappedHourly } from '../lib/weatherMapper';

import { getIconUrl } from '../lib/weatherIcons';
import { Card, CardContent } from './ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface ForecastDayProps {
  day: MappedDaily;
  hourly?: MappedHourly[];
}

export default function ForecastDay({ day, hourly = [] }: ForecastDayProps) {
  const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
  });

  return (
    <Card>
      <Collapsible>
        <CollapsibleTrigger className="group w-full cursor-pointer">
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
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-panel-open:rotate-180" />
            </div>
          </CardContent>
        </CollapsibleTrigger>

        {hourly.length > 0 && (
          <CollapsibleContent className="border-t p-4">
            <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 min-w-0">
              {hourly.map((h, idx) => (
                <div key={idx} className="flex flex-col items-center shrink-0 min-w-14 space-y-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(h.dt * 1000).toLocaleTimeString([], { hour: 'numeric' })}
                  </span>
                  <img src={getIconUrl(h.icon)} alt="Weather icon" className="w-8 h-8" />
                  <span className="text-sm font-medium">{h.temp}°</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </Card>
  );
}
