import { Card } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import type { CurrentWeather, TemperatureUnit, Language } from '@/lib/types';
import { formatTemp, convertTemp, getAQILevel, getUVILevel, formatTime, getWindDirection, convertSpeed, formatVisibility } from '@/lib/formatters';
import { useTranslation } from '@/lib/translations';
import { ThermometerSimple, Drop, Wind, Eye, SunHorizon, Sun } from '@phosphor-icons/react';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  locationName: string;
  unit: TemperatureUnit;
  aqi?: number | null;
  language: Language;
}

export function CurrentWeatherCard({ weather, locationName, unit, aqi, language }: CurrentWeatherCardProps) {
  const condition = weather.weather[0];
  const aqiInfo = aqi ? getAQILevel(aqi, language) : null;
  const uviInfo = getUVILevel(weather.uvi);
  const t = useTranslation(language);
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  
  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{locationName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(weather.dt * 1000).toLocaleString(locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
          <div className="flex items-center gap-6">
            <WeatherIcon condition={condition.icon} size={80} className="text-primary" />
            <div>
              <div className="text-6xl md:text-7xl font-bold tracking-tighter tabular-nums">
                {Math.round(convertTemp(weather.temp, unit))}°
              </div>
              <div className="text-lg text-muted-foreground mt-1">
                {t('feelsLike')} {formatTemp(weather.feels_like, unit)}
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-xl font-medium capitalize">{condition.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            icon={<ThermometerSimple size={20} />}
            label={t('humidity')}
            value={`${weather.humidity}%`}
          />
          <MetricCard
            icon={<Wind size={20} />}
            label={t('windSpeed')}
            value={convertSpeed(weather.wind_speed, unit)}
            subtitle={getWindDirection(weather.wind_deg)}
          />
          <MetricCard
            icon={<Eye size={20} />}
            label={t('visibility')}
            value={formatVisibility(weather.visibility, unit)}
          />
          <MetricCard
            icon={<Sun size={20} />}
            label={t('uvIndex')}
            value={weather.uvi.toFixed(1)}
            subtitle={<span className={uviInfo.color}>{uviInfo.level}</span>}
          />
          <MetricCard
            icon={<SunHorizon size={20} />}
            label={t('sunrise')}
            value={formatTime(weather.sunrise)}
          />
          <MetricCard
            icon={<SunHorizon size={20} className="rotate-180" />}
            label={t('sunset')}
            value={formatTime(weather.sunset)}
          />
        </div>
        
        {aqi && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t('airQuality')}</p>
                <p className="text-2xl font-semibold mt-1">{aqi}</p>
              </div>
              <div className={`text-right ${aqiInfo?.color}`}>
                <p className="text-lg font-medium">{aqiInfo?.level}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: React.ReactNode;
}

function MetricCard({ icon, label, value, subtitle }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
