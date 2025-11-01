import { Card } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import type { DailyForecast, TemperatureUnit, Language } from '@/lib/types';
import { formatTemp, formatDate } from '@/lib/formatters';
import { useTranslation } from '@/lib/translations';
import { motion } from 'framer-motion';

interface ForecastCardsProps {
  forecast: DailyForecast[];
  unit: TemperatureUnit;
  language: Language;
}

export function ForecastCards({ forecast, unit, language }: ForecastCardsProps) {
  const t = useTranslation(language);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold">{t('forecast')}</h2>
        <p className="text-sm text-muted-foreground">5 {language === 'pt' ? 'dias' : 'days'}</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.slice(0, 5).map((day, index) => (
          <ForecastCard key={day.dt} forecast={day} unit={unit} language={language} index={index} />
        ))}
      </div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="p-5 flex flex-col items-center gap-4 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 hover:border-primary/30 group">
        <motion.div 
          className="w-full flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {index === 0 ? t('today') : formatDate(forecast.dt, language)}
          </p>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: index * 0.1 + 0.3
          }}
        >
          <WeatherIcon condition={condition.icon} size={56} className="text-primary" />
        </motion.div>
        
        <div className="text-center space-y-1">
          <p className="text-sm font-medium capitalize text-foreground/80 leading-tight">
            {condition.description}
          </p>
        </div>
        
        <motion.div 
          className="flex items-baseline gap-3 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          <span className="text-2xl font-bold tabular-nums">
            {formatTemp(forecast.temp.max, unit)}
          </span>
          <span className="text-base text-muted-foreground tabular-nums font-medium">
            {formatTemp(forecast.temp.min, unit)}
          </span>
        </motion.div>
        
        {forecast.pop > 0 && (
          <motion.div 
            className="w-full pt-3 border-t flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <motion.div 
              className="h-1.5 w-1.5 rounded-full bg-primary/60"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-xs font-medium text-muted-foreground">
              {Math.round(forecast.pop * 100)}% {t('chanceOfRain').toLowerCase()}
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
