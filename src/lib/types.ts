export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
  isFavorite?: boolean;
  lastAccessed?: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  uvi: number;
  sunrise: number;
  sunset: number;
  weather: WeatherCondition[];
  dt: number;
}

export interface DailyForecast {
  dt: number;
  temp: {
    min: number;
    max: number;
    day: number;
  };
  weather: WeatherCondition[];
  humidity: number;
  wind_speed: number;
  pop: number;
  uvi: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
  timezone_offset: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'pt';

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  theme: Theme;
  language: Language;
  defaultLocation?: Location;
}
