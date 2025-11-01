import { Card } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import type { CurrentWeather, TemperatureUnit, Language } from '@/lib/types';
import { formatTemp, convertTemp, getAQILevel, getUVILevel, formatTime, getWindDirection, convertSpeed, formatVisibility } from '@/lib/formatters';
import { useTranslation } from '@/lib/translations';
import { ThermometerSimple, Drop, Wind, Eye, SunHorizon, Sun } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="p-6 md:p-8 overflow-hidden relative border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -z-10"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            {new Date(weather.dt * 1000).toLocaleString(locale, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('lastUpdated')}: {new Date(weather.dt * 1000).toLocaleTimeString(locale, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
          <div className="flex items-center gap-8">
            <motion.div 
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.1
              }}
            >
              <WeatherIcon condition={condition.icon} size={96} className="text-primary drop-shadow-lg" />
            </motion.div>
            <div>
              <motion.div 
                className="text-7xl md:text-8xl font-bold tracking-tighter tabular-nums leading-none bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 150,
                  damping: 12,
                  delay: 0.2
                }}
              >
                {Math.round(convertTemp(weather.temp, unit))}°
              </motion.div>
              <motion.div 
                className="text-base text-muted-foreground mt-3 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {t('feelsLike')} {formatTemp(weather.feels_like, unit)}
              </motion.div>
            </div>
          </div>
          
          <div className="flex-1 md:ml-auto">
            <p className="text-2xl font-semibold capitalize mb-1">{condition.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>H: {formatTemp(weather.temp + 3, unit)}</span>
              <span>•</span>
              <span>L: {formatTemp(weather.temp - 5, unit)}</span>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <MetricCard
            icon={<Drop size={22} weight="duotone" />}
            label={t('humidity')}
            value={`${weather.humidity}%`}
            delay={0.5}
          />
          <MetricCard
            icon={<Wind size={22} weight="duotone" />}
            label={t('windSpeed')}
            value={convertSpeed(weather.wind_speed, unit)}
            subtitle={getWindDirection(weather.wind_deg)}
            delay={0.55}
          />
          <MetricCard
            icon={<Eye size={22} weight="duotone" />}
            label={t('visibility')}
            value={formatVisibility(weather.visibility, unit)}
            delay={0.6}
          />
          <MetricCard
            icon={<Sun size={22} weight="duotone" />}
            label={t('uvIndex')}
            value={weather.uvi.toFixed(1)}
            subtitle={<span className={uviInfo.color}>{uviInfo.level}</span>}
            delay={0.65}
          />
          <MetricCard
            icon={<SunHorizon size={22} weight="duotone" />}
            label={t('sunrise')}
            value={formatTime(weather.sunrise)}
            delay={0.7}
          />
          <MetricCard
            icon={<SunHorizon size={22} weight="duotone" className="rotate-180" />}
            label={t('sunset')}
            value={formatTime(weather.sunset)}
            delay={0.75}
          />
        </motion.div>
        
        {aqi && (
          <div className="pt-6 border-t">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('airQuality')}</p>
                <p className="text-3xl font-bold tabular-nums">{aqi}</p>
              </div>
              <div className={`text-right ${aqiInfo?.color}`}>
                <p className="text-xl font-bold">{aqiInfo?.level}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </Card>
    </motion.div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: React.ReactNode;
  delay?: number;
}

function MetricCard({ icon, label, value, subtitle, delay = 0 }: MetricCardProps) {
  return (
    <motion.div 
      className="flex flex-col gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
