import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherData, TemperatureUnit, Language } from '@/lib/types';
import { formatTemp, convertTemp } from '@/lib/formatters';
import { useTranslation } from '@/lib/translations';
import { X } from '@phosphor-icons/react';

interface ComparisonViewProps {
  weatherData: WeatherData[];
  unit: TemperatureUnit;
  onRemove: (index: number) => void;
  language: Language;
}

export function ComparisonView({ weatherData, unit, onRemove, language }: ComparisonViewProps) {
  const t = useTranslation(language);

  if (weatherData.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg font-medium mb-2">{t('noLocationsToCompare')}</p>
        <p className="text-muted-foreground">
          {t('selectLocations')}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {weatherData.map((data, index) => (
        <Card key={data.location.id} className="p-6 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => onRemove(index)}
          >
            <X size={16} />
          </Button>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg truncate pr-8">{data.location.name}</h3>
              {(data.location.state || data.location.country) && (
                <p className="text-sm text-muted-foreground truncate">
                  {[data.location.state, data.location.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <WeatherIcon 
                condition={data.current.weather[0].icon} 
                size={48} 
                className="text-primary" 
              />
              <div>
                <div className="text-4xl font-bold tabular-nums">
                  {Math.round(convertTemp(data.current.temp, unit))}°
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {data.current.weather[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t text-sm">
              <div>
                <p className="text-muted-foreground">{t('feelsLike')}</p>
                <p className="font-medium">{formatTemp(data.current.feels_like, unit)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('humidity')}</p>
                <p className="font-medium">{data.current.humidity}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('windSpeed')}</p>
                <p className="font-medium">{data.current.wind_speed.toFixed(1)} km/h</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('uvIndex')}</p>
                <p className="font-medium">{data.current.uvi.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
