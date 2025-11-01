import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WeatherIcon } from './WeatherIcon';
import type { DailyForecast, TemperatureUnit } from '@/lib/types';
import { formatTemp, formatDate } from '@/lib/formatters';

interface ForecastCardsProps {
  forecast: DailyForecast[];
  unit: TemperatureUnit;
}

export function ForecastCards({ forecast, unit }: ForecastCardsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">5-Day Forecast</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 md:grid md:grid-cols-5">
          {forecast.slice(0, 5).map((day) => (
            <ForecastCard key={day.dt} forecast={day} unit={unit} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ForecastCardProps {
  forecast: DailyForecast;
  unit: TemperatureUnit;
}

function ForecastCard({ forecast, unit }: ForecastCardProps) {
  const condition = forecast.weather[0];
  
  return (
    <Card className="p-4 min-w-[140px] md:min-w-0 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-muted-foreground">
        {formatDate(forecast.dt)}
      </p>
      
      <WeatherIcon condition={condition.icon} size={48} className="text-primary" />
      
      <div className="text-center">
        <p className="text-sm font-medium capitalize text-muted-foreground">
          {condition.description}
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-center">
        <span className="text-lg font-semibold tabular-nums">
          {formatTemp(forecast.temp.max, unit)}
        </span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatTemp(forecast.temp.min, unit)}
        </span>
      </div>
      
      {forecast.pop > 0 && (
        <p className="text-xs text-muted-foreground">
          {Math.round(forecast.pop * 100)}% rain
        </p>
      )}
    </Card>
  );
}
