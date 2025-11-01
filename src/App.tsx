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
import { getWeatherData, getCurrentPosition, getLocationByCoords, getAirQuality } from '@/lib/weatherApi';
import type { Location, WeatherData, UserPreferences, TemperatureUnit, Theme } from '@/lib/types';
import { MapPin, NavigationArrow, List, Gear, Scales } from '@phosphor-icons/react';
import { useIsMobile } from '@/hooks/use-mobile';

const DEFAULT_LOCATION: Location = {
  id: '40.7128,-74.0060',
  name: 'New York',
  lat: 40.7128,
  lon: -74.0060,
  country: 'United States',
};

function App() {
  const isMobile = useIsMobile();
  const [preferences, setPreferences] = useKV<UserPreferences>('weather-preferences', {
    temperatureUnit: 'celsius',
    theme: 'light',
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
      toast.error('Failed to load weather data. Please try again.');
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
        toast.error('You can compare up to 4 locations at once');
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
      toast.error('Failed to load comparison data');
      console.error('Comparison load error:', error);
    }
  };

  const handleToggleFavorite = (location: Location) => {
    setFavorites((currentFavorites = []) => {
      const isFav = currentFavorites.some((fav) => fav.id === location.id);
      if (isFav) {
        toast.success('Removed from favorites');
        return currentFavorites.filter((fav) => fav.id !== location.id);
      } else {
        toast.success('Added to favorites');
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
        toast.success('Location detected');
      }
    } else {
      toast.error('Unable to access your location. Please check your browser permissions.');
    }
  };

  const handleTemperatureUnitChange = (unit: TemperatureUnit) => {
    setPreferences((current = { temperatureUnit: 'celsius', theme: 'light' }) => ({ 
      ...current, 
      temperatureUnit: unit 
    }));
  };

  const handleThemeChange = (theme: Theme) => {
    setPreferences((current = { temperatureUnit: 'celsius', theme: 'light' }) => ({ 
      ...current, 
      theme 
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
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {!isMobile && (
            <aside className="w-full lg:w-64 flex-shrink-0">
              <Sidebar />
            </aside>
          )}

          <main className="flex-1 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">Weather Dashboard</h1>
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <List size={20} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <Sidebar />
                    </SheetContent>
                  </Sheet>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <LocationSearch
                    onLocationSelect={handleLocationSelect}
                    favorites={favorites || []}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleGeolocation}
                    className="flex-1 sm:flex-none"
                  >
                    <NavigationArrow size={18} />
                    <span className="ml-2">Use My Location</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setManualDialogOpen(true)}
                  >
                    <MapPin size={18} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={compareMode ? 'default' : 'outline'}
                  onClick={toggleCompareMode}
                >
                  <Scales size={18} />
                  <span className="ml-2">{compareMode ? 'Exit Compare' : 'Compare Locations'}</span>
                </Button>
              </div>
            </div>

            {isLoading && !weatherData ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading weather data...</p>
              </div>
            ) : compareMode ? (
              <ComparisonView
                weatherData={compareWeatherData}
                unit={preferences?.temperatureUnit || 'celsius'}
                onRemove={removeComparisonLocation}
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="forecast">Forecast</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-6">
                  {weatherData && currentLocation && (
                    <CurrentWeatherCard
                      weather={weatherData.current}
                      locationName={currentLocation.name}
                      unit={preferences?.temperatureUnit || 'celsius'}
                      aqi={aqi}
                    />
                  )}
                </TabsContent>

                <TabsContent value="forecast" className="space-y-6">
                  {weatherData && (
                    <ForecastCards
                      forecast={weatherData.daily}
                      unit={preferences?.temperatureUnit || 'celsius'}
                    />
                  )}
                </TabsContent>

                <TabsContent value="settings">
                  <SettingsPanel
                    temperatureUnit={preferences?.temperatureUnit || 'celsius'}
                    theme={preferences?.theme || 'light'}
                    onTemperatureUnitChange={handleTemperatureUnitChange}
                    onThemeChange={handleThemeChange}
                  />
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>

      <ManualLocationDialog
        open={manualDialogOpen}
        onOpenChange={setManualDialogOpen}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}

export default App;