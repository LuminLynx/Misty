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
    <Card className="p-4 h-full flex flex-col">
      <div className="space-y-4 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={18} weight="fill" className="text-accent" />
            <h3 className="font-semibold text-sm uppercase tracking-wide">{t('favorites')}</h3>
          </div>
          
          {favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              {t('noFavorites')}
            </p>
          ) : (
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-1">
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

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-muted-foreground" />
            <h3 className="font-semibold text-sm uppercase tracking-wide">{t('recent')}</h3>
          </div>
          
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              {t('noRecent')}
            </p>
          ) : (
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-1">
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
        'flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted transition-colors group',
        isCurrent && 'bg-primary/10'
      )}
    >
      <button
        onClick={onSelect}
        className="flex items-center gap-2 flex-1 min-w-0 text-left"
      >
        <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium truncate',
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
            className="p-1 hover:text-accent transition-colors"
          >
            <Star size={16} weight={isFavorite ? 'fill' : 'regular'} className={cn(isFavorite && 'text-accent')} />
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
