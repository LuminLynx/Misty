import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { CurrentWeatherCard } from '@/components/CurrentWeatherCard';
import { ForecastCards } from '@/components/ForecastCards';
import { LocationSearch } from '@/components/LocationSearch';
import { LocationSidebar } from '@/components/LocationSidebar';
import { ManualLocationDialog } from '@/components/ManualLocationDialog';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ComparisonView } from '@/components/ComparisonView';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { InstallPrompt } from '@/components/InstallPrompt';
import { getWeatherData, getCurrentPosition, getLocationByCoords, getAirQuality } from '@/lib/weatherApi';
import type { Location, WeatherData, UserPreferences, TemperatureUnit, Theme, Language } from '@/lib/types';
import { useTranslation } from '@/lib/translations';
import { MapPin, NavigationArrow, List, Gear, Scales } from '@phosphor-icons/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_LOCATION: Location = {
  id: '40.7128,-74.0060',
  name: 'New York',
  lat: 40.7128,
  lon: -74.0060,
  country: 'United States',
};

function App() {
  const isMobile = useIsMobile();
  const { isInstallable, promptInstall } = usePWAInstall();
  const [preferences, setPreferences] = useKV<UserPreferences>('weather-preferences', {
    temperatureUnit: 'celsius',
    theme: 'dark',
    language: 'en',
  });
  const [favorites, setFavorites] = useKV<Location[]>('weather-favorites', []);
  const [recent, setRecent] = useKV<Location[]>('weather-recent', []);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareLocations, setCompareLocations] = useState<Location[]>([]);
  const [compareWeatherData, setCompareWeatherData] = useState<WeatherData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('current');

  const t = useTranslation(preferences?.language || 'en');

  useEffect(() => {
    if (preferences?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences]);

  useEffect(() => {
    const initLocation = async () => {
      const savedDefault = preferences?.defaultLocation;
      if (savedDefault) {
        loadWeather(savedDefault);
      } else {
        loadWeather(DEFAULT_LOCATION);
      }
    };
    initLocation();
  }, []);

  const loadWeather = async (location: Location) => {
    setIsLoading(true);
    setCurrentLocation(location);

    try {
      const [weather, aqiData] = await Promise.all([
        getWeatherData(location),
        getAirQuality(location.lat, location.lon),
      ]);

      setWeatherData(weather);
      setAqi(aqiData);
      addToRecent(location);
    } catch (error) {
      toast.error(t('failedToLoadWeather'));
      console.error('Weather load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToRecent = (location: Location) => {
    setRecent((currentRecent = []) => {
      const filtered = currentRecent.filter((loc) => loc.id !== location.id);
      const updated = [{ ...location, lastAccessed: Date.now() }, ...filtered].slice(0, 10);
      return updated;
    });
  };

  const handleLocationSelect = (location: Location) => {
    if (compareMode) {
      if (compareLocations.length < 4 && !compareLocations.some(loc => loc.id === location.id)) {
        setCompareLocations((prev) => [...prev, location]);
        loadComparisonWeather([...compareLocations, location]);
      } else {
        toast.error(t('compareUpToFour'));
      }
    } else {
      loadWeather(location);
      setActiveTab('current');
    }
  };

  const loadComparisonWeather = async (locations: Location[]) => {
    try {
      const weatherPromises = locations.map((loc) => getWeatherData(loc));
      const weatherResults = await Promise.all(weatherPromises);
      setCompareWeatherData(weatherResults);
    } catch (error) {
      toast.error(t('failedToLoadComparison'));
      console.error('Comparison load error:', error);
    }
  };

  const handleToggleFavorite = (location: Location) => {
    setFavorites((currentFavorites = []) => {
      const isFav = currentFavorites.some((fav) => fav.id === location.id);
      if (isFav) {
        toast.success(t('removedFromFavorites'));
        return currentFavorites.filter((fav) => fav.id !== location.id);
      } else {
        toast.success(t('addedToFavorites'));
        return [...currentFavorites, { ...location, isFavorite: true }];
      }
    });
  };

  const handleRemoveRecent = (location: Location) => {
    setRecent((currentRecent = []) => currentRecent.filter((loc) => loc.id !== location.id));
  };

  const handleGeolocation = async () => {
    const coords = await getCurrentPosition();
    if (coords) {
      const location = await getLocationByCoords(coords.lat, coords.lon);
      if (location) {
        handleLocationSelect(location);
        toast.success(t('locationDetected'));
      }
    } else {
      toast.error(t('unableToAccessLocation'));
    }
  };

  const handleTemperatureUnitChange = (unit: TemperatureUnit) => {
    setPreferences((current = { temperatureUnit: 'celsius', theme: 'light', language: 'en' }) => ({ 
      ...current, 
      temperatureUnit: unit 
    }));
  };

  const handleThemeChange = (theme: Theme) => {
    setPreferences((current = { temperatureUnit: 'celsius', theme: 'light', language: 'en' }) => ({ 
      ...current, 
      theme 
    }));
  };

  const handleLanguageChange = (language: Language) => {
    setPreferences((current = { temperatureUnit: 'celsius', theme: 'light', language: 'en' }) => ({ 
      ...current, 
      language 
    }));
  };

  const toggleCompareMode = () => {
    setCompareMode((prev) => !prev);
    if (!compareMode) {
      setCompareLocations([]);
      setCompareWeatherData([]);
      setActiveTab('compare');
    } else {
      setActiveTab('current');
    }
  };

  const removeComparisonLocation = (index: number) => {
    const newLocations = compareLocations.filter((_, i) => i !== index);
    setCompareLocations(newLocations);
    setCompareWeatherData((prev) => prev.filter((_, i) => i !== index));
  };

  const Sidebar = () => (
    <LocationSidebar
      favorites={favorites || []}
      recent={recent || []}
      currentLocation={currentLocation || undefined}
      onLocationSelect={handleLocationSelect}
      onToggleFavorite={handleToggleFavorite}
      onRemoveRecent={handleRemoveRecent}
      language={preferences?.language || 'en'}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <AnimatedBackground weatherCondition={weatherData?.current?.weather?.[0]?.main} />
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        <motion.div 
          className="flex flex-col lg:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {!isMobile && (
            <motion.aside 
              className="w-full lg:w-72 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="sticky top-6">
                <Sidebar />
              </div>
            </motion.aside>
          )}

          <main className="flex-1 space-y-6 min-w-0">
            <header className="space-y-4">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t('weatherDashboard')}
                  </h1>
                  <AnimatePresence mode="wait">
                    {currentLocation && (
                      <motion.p 
                        key={currentLocation.id}
                        className="text-sm text-muted-foreground mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {currentLocation.name}
                        {currentLocation.country && `, ${currentLocation.country}`}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
                {isMobile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <List size={20} />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <Sidebar />
                      </SheetContent>
                    </Sheet>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0">
                  <LocationSearch
                    onLocationSelect={handleLocationSelect}
                    favorites={favorites || []}
                    onToggleFavorite={handleToggleFavorite}
                    language={preferences?.language || 'en'}
                  />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleGeolocation}
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    <NavigationArrow size={18} weight="bold" />
                    {!isMobile && <span>{t('useMyLocation')}</span>}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setManualDialogOpen(true)}
                    size="icon"
                  >
                    <MapPin size={18} weight="bold" />
                  </Button>
                  <Button
                    variant={compareMode ? 'default' : 'outline'}
                    onClick={toggleCompareMode}
                    size="icon"
                    className="relative"
                  >
                    <Scales size={18} weight="bold" />
                    {compareMode && compareLocations.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                        {compareLocations.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </header>

            {isLoading && !weatherData ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4 w-full max-w-2xl">
                  <motion.div 
                    className="h-48 bg-muted rounded-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div 
                        key={i}
                        className="h-32 bg-muted rounded-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : compareMode ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t('compareLocations')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {compareLocations.length} / 4 {preferences?.language === 'pt' ? 'locais' : 'locations'}
                  </p>
                </div>
                <ComparisonView
                  weatherData={compareWeatherData}
                  unit={preferences?.temperatureUnit || 'celsius'}
                  onRemove={removeComparisonLocation}
                  language={preferences?.language || 'en'}
                />
              </motion.div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 backdrop-blur-sm">
                  <TabsTrigger value="current" className="gap-2 data-[state=active]:shadow-sm">
                    {t('current')}
                  </TabsTrigger>
                  <TabsTrigger value="forecast" className="gap-2 data-[state=active]:shadow-sm">
                    {t('forecast')}
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2 data-[state=active]:shadow-sm">
                    <Gear size={16} weight="bold" />
                    {!isMobile && t('settings')}
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="current" className="space-y-6 mt-0">
                    {weatherData && currentLocation && (
                      <motion.div
                        key="current"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CurrentWeatherCard
                          weather={weatherData.current}
                          locationName={currentLocation.name}
                          unit={preferences?.temperatureUnit || 'celsius'}
                          aqi={aqi}
                          language={preferences?.language || 'en'}
                        />
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="forecast" className="space-y-6 mt-0">
                    {weatherData && (
                      <motion.div
                        key="forecast"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ForecastCards
                          forecast={weatherData.daily}
                          unit={preferences?.temperatureUnit || 'celsius'}
                          language={preferences?.language || 'en'}
                        />
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <SettingsPanel
                        temperatureUnit={preferences?.temperatureUnit || 'celsius'}
                        theme={preferences?.theme || 'light'}
                        language={preferences?.language || 'en'}
                        onTemperatureUnitChange={handleTemperatureUnitChange}
                        onThemeChange={handleThemeChange}
                        onLanguageChange={handleLanguageChange}
                      />
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            )}
          </main>
        </motion.div>
      </div>

      <ManualLocationDialog
        open={manualDialogOpen}
        onOpenChange={setManualDialogOpen}
        onLocationSelect={handleLocationSelect}
        language={preferences?.language || 'en'}
      />

      {isInstallable && (
        <InstallPrompt
          onInstall={promptInstall}
          language={preferences?.language || 'en'}
        />
      )}
    </div>
  );
}

export default App;