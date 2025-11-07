import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkle, ArrowsClockwise } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherData, TemperatureUnit, Language } from '@/lib/types';
import { useTranslation } from '@/lib/translations';

interface AIInsightsProps {
  weatherData: WeatherData;
  locationName: string;
  unit: TemperatureUnit;
  language: Language;
}

export function AIInsights({ weatherData, locationName, unit, language }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslation(language);

  const generateInsights = async () => {
    setIsLoading(true);
    
    try {
      // Check if window.spark.llm is available
      if (!window.spark?.llm) {
        throw new Error('AI features are not available in this environment');
      }

      const current = weatherData.current;
      const forecast = weatherData.daily.slice(0, 3);
      
      const weatherContext = {
        location: locationName,
        current: {
          temperature: current.temp,
          feelsLike: current.feels_like,
          condition: current.weather[0].description,
          humidity: current.humidity,
          windSpeed: current.wind_speed,
          uvIndex: current.uvi,
          visibility: current.visibility,
        },
        forecast: forecast.map(day => ({
          temp: day.temp,
          condition: day.weather[0].description,
          pop: day.pop,
        })),
        unit,
      };

      const promptText = `You are a friendly weather assistant providing helpful insights and recommendations.

Given this weather data for ${locationName}:
- Current: ${weatherContext.current.temperature}°${unit === 'celsius' ? 'C' : 'F'}, ${weatherContext.current.condition}
- Feels like: ${weatherContext.current.feelsLike}°${unit === 'celsius' ? 'C' : 'F'}
- Humidity: ${weatherContext.current.humidity}%
- Wind: ${weatherContext.current.windSpeed} ${unit === 'celsius' ? 'm/s' : 'mph'}
- UV Index: ${weatherContext.current.uvIndex}
- 3-day forecast: ${JSON.stringify(weatherContext.forecast)}

Provide a concise, helpful weather insight (2-3 sentences) that includes:
1. A brief summary of current conditions
2. One practical recommendation or tip based on the weather
3. A brief mention of what to expect in the next few days

Keep it conversational, friendly, and practical. ${language === 'pt' ? 'Respond in Portuguese.' : 'Respond in English.'}`;

      const response = await window.spark.llm(promptText, 'gpt-4o-mini');
      setInsights(response.trim());
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      const errorMessage = error instanceof Error && error.message.includes('not available')
        ? (language === 'pt'
          ? 'Os recursos de IA não estão disponíveis neste ambiente. Esta funcionalidade requer que o aplicativo seja executado no GitHub Spark.'
          : 'AI features are not available in this environment. This feature requires the app to run in GitHub Spark.')
        : (language === 'pt' 
          ? 'Não foi possível gerar insights neste momento. Tente novamente.'
          : 'Unable to generate insights at this time. Please try again.');
      setInsights(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [weatherData.current.dt, locationName]);

  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-primary/5 border-primary/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkle size={20} weight="fill" className="text-primary" />
          </div>
          <h3 className="font-semibold text-lg">
            {language === 'pt' ? 'Insights AI' : 'AI Insights'}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={generateInsights}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <ArrowsClockwise 
            size={16} 
            className={isLoading ? 'animate-spin' : ''} 
          />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
            <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
          </motion.div>
        ) : (
          <motion.p
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground leading-relaxed"
          >
            {insights}
          </motion.p>
        )}
      </AnimatePresence>
    </Card>
  );
}
