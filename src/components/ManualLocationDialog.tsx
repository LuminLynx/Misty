import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getLocationByCoords } from '@/lib/weatherApi';
import type { Location, Language } from '@/lib/types';
import { useTranslation } from '@/lib/translations';

interface ManualLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: Location) => void;
  language: Language;
}

export function ManualLocationDialog({ open, onOpenChange, onLocationSelect, language }: ManualLocationDialogProps) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslation(language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      setError(t('invalidCoordinates'));
      return;
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      setError(t('invalidCoordinates'));
      return;
    }

    setIsLoading(true);
    const location = await getLocationByCoords(latitude, longitude);
    setIsLoading(false);

    if (location) {
      onLocationSelect(location);
      onOpenChange(false);
      setLat('');
      setLon('');
    } else {
      setError(t('invalidCoordinates'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('manualLocation')}</DialogTitle>
          <DialogDescription>
            {t('enterCoordinates')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">{t('latitude')}</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="e.g., 40.7128"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">{t('longitude')}</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              placeholder="e.g., -74.0060"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('loadingWeatherData') : t('loadLocation')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
