import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherData, TemperatureUnit, Language } from '@/lib/types';
import { formatTemp, convertTemp } from '@/lib/formatters';
import { useTranslation } from '@/lib/translations';
import { X, Scales } from '@phosphor-icons/react';

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
      <Card className="p-12 text-center border-2 border-dashed">
        <Scales size={64} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
        <p className="text-xl font-semibold mb-2">{t('noLocationsToCompare')}</p>
        <p className="text-muted-foreground">
          {t('selectLocations')}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {weatherData.map((data, index) => (
        <Card key={data.location.id} className="p-6 relative border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(index)}
          >
            <X size={18} weight="bold" />
          </Button>

          <div className="space-y-5">
            <div className="pr-8">
              <h3 className="font-bold text-lg truncate">{data.location.name}</h3>
              {(data.location.state || data.location.country) && (
                <p className="text-sm text-muted-foreground truncate">
                  {[data.location.state, data.location.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-5 pb-5 border-b">
              <WeatherIcon 
                condition={data.current.weather[0].icon} 
                size={56} 
                className="text-primary" 
              />
              <div>
                <div className="text-5xl font-bold tabular-nums leading-none">
                  {Math.round(convertTemp(data.current.temp, unit))}°
                </div>
                <p className="text-sm text-muted-foreground capitalize mt-2 leading-tight">
                  {data.current.weather[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{t('feelsLike')}</p>
                <p className="font-bold text-base">{formatTemp(data.current.feels_like, unit)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{t('humidity')}</p>
                <p className="font-bold text-base">{data.current.humidity}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{t('windSpeed')}</p>
                <p className="font-bold text-base">{data.current.wind_speed.toFixed(1)} km/h</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{t('uvIndex')}</p>
                <p className="font-bold text-base">{data.current.uvi.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
