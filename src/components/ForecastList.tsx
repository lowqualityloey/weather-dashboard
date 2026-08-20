import type { MappedDaily, MappedHourly } from '../lib/weatherMapper';
import ForecastDay from './ForecastDay';

interface ForecastListProps {
  daily: MappedDaily[];
  hourly?: MappedHourly[];
}

export default function ForecastList({ daily, hourly }: ForecastListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {daily.map((day) => (
        <ForecastDay key={day.dt} day={day} hourly={hourly} />
      ))}
    </div>
  );
}
