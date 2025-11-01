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
        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} weight="bold" />
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="pl-12 h-12 text-base border-2 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-[400px] overflow-y-auto shadow-xl border-2">
          {results.map((location, index) => (
            <button
              key={location.id}
              onClick={() => handleSelect(location)}
              className={cn(
                "w-full flex items-center justify-between gap-3 p-4 hover:bg-muted/70 transition-colors text-left",
                index !== results.length - 1 && "border-b"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MapPin size={20} weight="duotone" className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-base">{location.name}</p>
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
                className="flex-shrink-0 p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-all"
              >
                <Star 
                  size={22} 
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
          <Card className="p-4 text-center text-sm text-muted-foreground shadow-lg border-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              {t('loadingWeatherData')}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
