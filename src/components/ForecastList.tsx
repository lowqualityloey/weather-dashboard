import type { MappedDaily } from '../lib/weatherMapper';
import ForecastDay from './ForecastDay';

interface ForecastListProps {
  daily: MappedDaily[];
}

export default function ForecastList({ daily }: ForecastListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {daily.map((day) => (
        <ForecastDay key={day.dt} day={day} />
      ))}
    </div>
  );
}
