import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatCircleDots, PaperPlaneRight, User, Robot } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherData, TemperatureUnit, Language } from '@/lib/types';
import { useKV } from '@github/spark/hooks';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIWeatherChatProps {
  weatherData: WeatherData;
  locationName: string;
  unit: TemperatureUnit;
  language: Language;
}

export function AIWeatherChat({ 
  weatherData, 
  locationName, 
  unit, 
  language 
}: AIWeatherChatProps) {
  const [messages, setMessages] = useKV<Message[]>('weather-chat-messages', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((current = []) => [...current, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if window.spark.llm is available
      if (!window.spark?.llm) {
        throw new Error('AI features are not available in this environment');
      }

      const current = weatherData.current;
      const forecast = weatherData.daily.slice(0, 5);
      
      const conversationHistory = (messages || [])
        .slice(-6)
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const promptText = `You are a knowledgeable weather assistant helping users understand weather conditions and plan accordingly.

Current weather in ${locationName}:
- Temperature: ${current.temp}°${unit === 'celsius' ? 'C' : 'F'} (feels like ${current.feels_like}°${unit === 'celsius' ? 'C' : 'F'})
- Condition: ${current.weather[0].description}
- Humidity: ${current.humidity}%
- Wind: ${current.wind_speed} ${unit === 'celsius' ? 'm/s' : 'mph'}
- UV Index: ${current.uvi}
- Visibility: ${current.visibility}m

5-day forecast summary:
${forecast.map((day, i) => `Day ${i + 1}: ${day.temp.min}-${day.temp.max}°${unit === 'celsius' ? 'C' : 'F'}, ${day.weather[0].description}, ${Math.round(day.pop * 100)}% rain`).join('\n')}

Previous conversation:
${conversationHistory}

User question: ${userMessage.content}

Provide a helpful, concise answer (2-3 sentences max). ${language === 'pt' ? 'Respond in Portuguese.' : 'Respond in English.'}`;

      const response = await window.spark.llm(promptText, 'gpt-4o-mini');
      
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.trim(),
        timestamp: Date.now(),
      };

      setMessages((current = []) => [...current, assistantMessage]);
    } catch (error) {
      console.error('Failed to get chat response:', error);
      
      const errorContent = error instanceof Error && error.message.includes('not available')
        ? (language === 'pt'
          ? 'Os recursos de IA não estão disponíveis neste ambiente. Esta funcionalidade requer que o aplicativo seja executado no GitHub Spark.'
          : 'AI features are not available in this environment. This feature requires the app to run in GitHub Spark.')
        : (language === 'pt' 
          ? 'Desculpe, não consegui processar sua pergunta. Tente novamente.'
          : 'Sorry, I couldn\'t process your question. Please try again.');
      
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: errorContent,
        timestamp: Date.now(),
      };
      setMessages((current = []) => [...current, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const suggestedQuestions = language === 'pt' ? [
    'Devo levar um guarda-chuva?',
    'É bom para atividades ao ar livre?',
    'Como estará o tempo amanhã?',
  ] : [
    'Should I bring an umbrella?',
    'Is it good for outdoor activities?',
    'How will the weather be tomorrow?',
  ];

  return (
    <Card className="flex flex-col h-[500px] bg-gradient-to-br from-card via-card to-secondary/5">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-secondary/10">
            <ChatCircleDots size={20} weight="fill" className="text-secondary-foreground" />
          </div>
          <h3 className="font-semibold">
            {language === 'pt' ? 'Assistente Meteorológico' : 'Weather Assistant'}
          </h3>
        </div>
        {(messages || []).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-xs"
          >
            {language === 'pt' ? 'Limpar' : 'Clear'}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {(!messages || messages.length === 0) && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm mb-4">
                {language === 'pt' 
                  ? 'Faça uma pergunta sobre o tempo'
                  : 'Ask me anything about the weather'}
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(question)}
                    className="block w-full text-left px-3 py-2 text-xs rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {(messages || []).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <Robot size={16} className="text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                    <User size={16} className="text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Robot size={16} className="text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'pt' ? 'Digite sua pergunta...' : 'Type your question...'}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <PaperPlaneRight size={18} weight="fill" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
