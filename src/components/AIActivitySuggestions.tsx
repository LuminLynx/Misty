import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowsClockwise } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherData, TemperatureUnit, Language } from '@/lib/types';

interface ActivityRecommendation {
  activity: string;
  reason: string;
  category: 'outdoor' | 'indoor' | 'exercise' | 'relaxation' | 'travel';
}

interface AIActivitySuggestionsProps {
  weatherData: WeatherData;
  locationName: string;
  unit: TemperatureUnit;
  language: Language;
}

export function AIActivitySuggestions({ 
  weatherData, 
  locationName, 
  unit, 
  language 
}: AIActivitySuggestionsProps) {
  const [recommendations, setRecommendations] = useState<ActivityRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categoryColors: Record<ActivityRecommendation['category'], string> = {
    outdoor: 'bg-green-500/10 text-green-700 dark:text-green-400',
    indoor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    exercise: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    relaxation: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    travel: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
  };

  const categoryLabels: Record<ActivityRecommendation['category'], { en: string; pt: string }> = {
    outdoor: { en: 'Outdoor', pt: 'Ao ar livre' },
    indoor: { en: 'Indoor', pt: 'Interior' },
    exercise: { en: 'Exercise', pt: 'Exercício' },
    relaxation: { en: 'Relaxation', pt: 'Relaxamento' },
    travel: { en: 'Travel', pt: 'Viagem' },
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Check if window.spark.llm is available
      if (!window.spark?.llm) {
        throw new Error('AI features are not available in this environment');
      }

      const current = weatherData.current;
      const forecast = weatherData.daily[0];
      
      const promptText = `You are a helpful activity planner that suggests activities based on weather conditions.

Weather in ${locationName}:
- Temperature: ${current.temp}°${unit === 'celsius' ? 'C' : 'F'}
- Condition: ${current.weather[0].description}
- Humidity: ${current.humidity}%
- Wind: ${current.wind_speed} ${unit === 'celsius' ? 'm/s' : 'mph'}
- UV Index: ${current.uvi}
- Visibility: ${current.visibility}m
- Rain probability: ${forecast.pop * 100}%

Suggest 4 appropriate activities for these weather conditions. Return ONLY a valid JSON object with this exact structure:
{
  "activities": [
    {
      "activity": "Activity name",
      "reason": "Brief reason why this activity is good now",
      "category": "outdoor|indoor|exercise|relaxation|travel"
    }
  ]
}

${language === 'pt' ? 'Provide activity names and reasons in Portuguese.' : 'Provide activity names and reasons in English.'}`;

      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true);
      const parsed = JSON.parse(response);
      setRecommendations(parsed.activities || []);
    } catch (error) {
      console.error('Failed to generate activity recommendations:', error);
      
      // Show helpful error message
      if (error instanceof Error && error.message.includes('not available')) {
        console.warn('AI features not available - app must run in GitHub Spark environment');
      }
      
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-accent/5 border-accent/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <Lightbulb size={20} weight="fill" className="text-accent" />
          </div>
          <h3 className="font-semibold text-lg">
            {language === 'pt' ? 'Sugestões de Atividades' : 'Activity Suggestions'}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={generateRecommendations}
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
        {recommendations.length === 0 && !isLoading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'pt' 
                ? 'Clique no botão acima para obter sugestões personalizadas de atividades'
                : 'Click the button above to get personalized activity suggestions'}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {language === 'pt'
                ? 'Nota: Este recurso requer que o aplicativo seja executado no GitHub Spark'
                : 'Note: This feature requires the app to run in GitHub Spark'}
            </p>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-full" />
              </div>
            ))}
          </motion.div>
        )}

        {recommendations.length > 0 && !isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm">{rec.activity}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${categoryColors[rec.category]}`}
                  >
                    {categoryLabels[rec.category][language]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rec.reason}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
