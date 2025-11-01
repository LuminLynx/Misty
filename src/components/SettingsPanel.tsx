import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from '@phosphor-icons/react';
import type { TemperatureUnit, Theme, Language } from '@/lib/types';
import { useTranslation } from '@/lib/translations';

interface SettingsPanelProps {
  temperatureUnit: TemperatureUnit;
  theme: Theme;
  language: Language;
  onTemperatureUnitChange: (unit: TemperatureUnit) => void;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (language: Language) => void;
}

export function SettingsPanel({
  temperatureUnit,
  theme,
  language,
  onTemperatureUnitChange,
  onThemeChange,
  onLanguageChange,
}: SettingsPanelProps) {
  const t = useTranslation(language);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">{t('settings')}</h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t('temperatureUnit')}
          </Label>
          <div className="flex gap-2">
            <Button
              variant={temperatureUnit === 'celsius' ? 'default' : 'outline'}
              onClick={() => onTemperatureUnitChange('celsius')}
              className="flex-1"
            >
              {t('celsius')} (°C)
            </Button>
            <Button
              variant={temperatureUnit === 'fahrenheit' ? 'default' : 'outline'}
              onClick={() => onTemperatureUnitChange('fahrenheit')}
              className="flex-1"
            >
              {t('fahrenheit')} (°F)
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {t('theme')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {theme === 'dark' ? t('dark') : t('light')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sun size={18} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
            />
            <Moon size={18} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t('language')}
          </Label>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('en')}
              className="flex-1"
            >
              {t('english')}
            </Button>
            <Button
              variant={language === 'pt' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('pt')}
              className="flex-1"
            >
              {t('portuguese')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
