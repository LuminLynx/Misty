import { Card } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import type { DailyForecast, TemperatureUnit, Language } from '@/lib/types';
import { formatTemp, formatDate } from '@/lib/formatters';
import { useTranslation } from '@/lib/translations';

interface ForecastCardsProps {
  forecast: DailyForecast[];
  unit: TemperatureUnit;
  language: Language;
}

export function ForecastCards({ forecast, unit, language }: ForecastCardsProps) {
  const t = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('forecast')}</h2>
        <p className="text-sm text-muted-foreground">5 {language === 'pt' ? 'dias' : 'days'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.slice(0, 5).map((day, index) => (
          <ForecastCard key={day.dt} forecast={day} unit={unit} language={language} index={index} />
        ))}
      </div>
    </div>
  );
}

interface ForecastCardProps {
  forecast: DailyForecast;
  unit: TemperatureUnit;
  language: Language;
  index: number;
}

function ForecastCard({ forecast, unit, language, index }: ForecastCardProps) {
  const condition = forecast.weather[0];
  const t = useTranslation(language);
  
  return (
    <Card className="p-5 flex flex-col items-center gap-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 group">
      <div className="w-full flex flex-col items-center gap-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {index === 0 ? t('today') : formatDate(forecast.dt, language)}
        </p>
      </div>
      
      <div className="relative">
        <WeatherIcon condition={condition.icon} size={56} className="text-primary group-hover:scale-110 transition-transform duration-300" />
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-sm font-medium capitalize text-foreground/80 leading-tight">
          {condition.description}
        </p>
      </div>
      
      <div className="flex items-baseline gap-3 text-center">
        <span className="text-2xl font-bold tabular-nums">
          {formatTemp(forecast.temp.max, unit)}
        </span>
        <span className="text-base text-muted-foreground tabular-nums font-medium">
          {formatTemp(forecast.temp.min, unit)}
        </span>
      </div>
      
      {forecast.pop > 0 && (
        <div className="w-full pt-3 border-t flex items-center justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
          <p className="text-xs font-medium text-muted-foreground">
            {Math.round(forecast.pop * 100)}% {t('chanceOfRain').toLowerCase()}
          </p>
        </div>
      )}
    </Card>
  );
}
