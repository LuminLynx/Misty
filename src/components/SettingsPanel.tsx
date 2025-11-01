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
    <Card className="p-8 border-2 shadow-lg">
      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('temperatureUnit')}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={temperatureUnit === 'celsius' ? 'default' : 'outline'}
              onClick={() => onTemperatureUnitChange('celsius')}
              className="h-14 text-base font-semibold"
              size="lg"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">°C</span>
                <span className="text-xs">{t('celsius')}</span>
              </div>
            </Button>
            <Button
              variant={temperatureUnit === 'fahrenheit' ? 'default' : 'outline'}
              onClick={() => onTemperatureUnitChange('fahrenheit')}
              className="h-14 text-base font-semibold"
              size="lg"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">°F</span>
                <span className="text-xs">{t('fahrenheit')}</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-muted/30 border-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('theme')}
              </Label>
              <p className="text-base font-semibold">
                {theme === 'dark' ? t('dark') : t('light')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Sun 
                size={24} 
                weight="duotone"
                className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} 
              />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                className="data-[state=checked]:bg-primary"
              />
              <Moon 
                size={24} 
                weight="duotone"
                className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('language')}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('en')}
              className="h-14 text-base font-semibold"
              size="lg"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">🇺🇸</span>
                <span className="text-xs">{t('english')}</span>
              </div>
            </Button>
            <Button
              variant={language === 'pt' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('pt')}
              className="h-14 text-base font-semibold"
              size="lg"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">🇧🇷</span>
                <span className="text-xs">{t('portuguese')}</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
