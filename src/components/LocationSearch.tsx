import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MagnifyingGlass, MapPin, Star } from '@phosphor-icons/react';
import { searchLocations } from '@/lib/weatherApi';
import type { Location, Language } from '@/lib/types';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  favorites: Location[];
  onToggleFavorite: (location: Location) => void;
  language: Language;
}

export function LocationSearch({ onLocationSelect, favorites, onToggleFavorite, language }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const t = useTranslation(language);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      const locations = await searchLocations(query);
      setResults(locations);
      setShowResults(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery('');
    setShowResults(false);
    setResults([]);
  };

  const isFavorite = (location: Location) => {
    return favorites.some(fav => fav.id === location.id);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="pl-10"
        />
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-[300px] overflow-y-auto">
          {results.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelect(location)}
              className="w-full flex items-center justify-between gap-2 p-3 hover:bg-muted transition-colors text-left border-b last:border-b-0"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{location.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {[location.state, location.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(location);
                }}
                className="flex-shrink-0 p-1 hover:text-accent transition-colors"
              >
                <Star 
                  size={20} 
                  weight={isFavorite(location) ? 'fill' : 'regular'}
                  className={cn(
                    isFavorite(location) && 'text-accent'
                  )}
                />
              </button>
            </button>
          ))}
        </Card>
      )}

      {isSearching && (
        <div className="absolute top-full mt-2 w-full">
          <Card className="p-4 text-center text-sm text-muted-foreground">
            {t('loadingWeatherData')}
          </Card>
        </div>
      )}
    </div>
  );
}
