import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from '@phosphor-icons/react';
import type { TemperatureUnit, Theme } from '@/lib/types';

interface SettingsPanelProps {
  temperatureUnit: TemperatureUnit;
  theme: Theme;
  onTemperatureUnitChange: (unit: TemperatureUnit) => void;
  onThemeChange: (theme: Theme) => void;
}

export function SettingsPanel({
  temperatureUnit,
  theme,
  onTemperatureUnitChange,
  onThemeChange,
}: SettingsPanelProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Temperature Unit
          </Label>
          <div className="flex gap-2">
            <Button
              variant={temperatureUnit === 'celsius' ? 'default' : 'outline'}
              onClick={() => onTemperatureUnitChange('celsius')}
              className="flex-1"
            >
              Celsius (°C)
            </Button>
            <Button
              variant={temperatureUnit === 'fahrenheit' ? 'default' : 'outline'}
              onClick={() => onTemperatureUnitChange('fahrenheit')}
              className="flex-1"
            >
              Fahrenheit (°F)
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Theme
            </Label>
            <p className="text-sm text-muted-foreground">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
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
      </div>
    </Card>
  );
}
