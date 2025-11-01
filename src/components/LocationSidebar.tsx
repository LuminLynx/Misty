import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, MapPin, X } from '@phosphor-icons/react';
import type { Location, Language } from '@/lib/types';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface LocationSidebarProps {
  favorites: Location[];
  recent: Location[];
  currentLocation?: Location;
  onLocationSelect: (location: Location) => void;
  onToggleFavorite: (location: Location) => void;
  onRemoveRecent: (location: Location) => void;
  language: Language;
}

export function LocationSidebar({
  favorites,
  recent,
  currentLocation,
  onLocationSelect,
  onToggleFavorite,
  onRemoveRecent,
  language,
}: LocationSidebarProps) {
  const isCurrent = (location: Location) => {
    return currentLocation?.id === location.id;
  };
  const t = useTranslation(language);

  return (
    <Card className="p-5 h-full flex flex-col shadow-lg border-2">
      <div className="space-y-6 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <Star size={20} weight="fill" className="text-accent" />
            <h3 className="font-bold text-sm uppercase tracking-wider">{t('favorites')}</h3>
          </div>
          
          {favorites.length === 0 ? (
            <div className="text-center py-8 px-4 bg-muted/30 rounded-lg">
              <Star size={32} weight="duotone" className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('noFavorites')}
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[250px] pr-2">
              <div className="space-y-2">
                {favorites.map((location) => (
                  <LocationItem
                    key={location.id}
                    location={location}
                    isCurrent={isCurrent(location)}
                    onSelect={() => onLocationSelect(location)}
                    onToggleFavorite={() => onToggleFavorite(location)}
                    isFavorite={true}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <Clock size={20} weight="bold" className="text-muted-foreground" />
            <h3 className="font-bold text-sm uppercase tracking-wider">{t('recent')}</h3>
          </div>
          
          {recent.length === 0 ? (
            <div className="text-center py-8 px-4 bg-muted/30 rounded-lg">
              <Clock size={32} weight="duotone" className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('noRecent')}
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[250px] pr-2">
              <div className="space-y-2">
                {recent.map((location) => (
                  <LocationItem
                    key={location.id}
                    location={location}
                    isCurrent={isCurrent(location)}
                    onSelect={() => onLocationSelect(location)}
                    onRemove={() => onRemoveRecent(location)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </Card>
  );
}

interface LocationItemProps {
  location: Location;
  isCurrent: boolean;
  onSelect: () => void;
  onToggleFavorite?: () => void;
  onRemove?: () => void;
  isFavorite?: boolean;
}

function LocationItem({
  location,
  isCurrent,
  onSelect,
  onToggleFavorite,
  onRemove,
  isFavorite,
}: LocationItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 p-3 rounded-lg transition-all group border-2',
        isCurrent 
          ? 'bg-primary/10 border-primary/30 shadow-sm' 
          : 'hover:bg-muted/50 border-transparent hover:border-muted'
      )}
    >
      <button
        onClick={onSelect}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <MapPin 
          size={16} 
          weight={isCurrent ? 'fill' : 'regular'}
          className={cn(
            'flex-shrink-0 transition-colors',
            isCurrent ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-semibold truncate',
            isCurrent && 'text-primary'
          )}>
            {location.name}
          </p>
          {(location.state || location.country) && (
            <p className="text-xs text-muted-foreground truncate">
              {[location.state, location.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </button>
      
      <div className="flex items-center gap-1 flex-shrink-0">
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="p-1.5 rounded-md hover:bg-accent/10 hover:text-accent transition-all"
          >
            <Star size={16} weight={isFavorite ? 'fill' : 'regular'} className={cn(isFavorite && 'text-accent')} />
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
