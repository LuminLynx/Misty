import type { Location, WeatherData, CurrentWeather, DailyForecast, WeatherAlert } from './types';

const CACHE_DURATION = 10 * 60 * 1000;
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();

export async function searchLocations(query: string): Promise<Location[]> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    
    if (!response.ok) throw new Error('Location search failed');
    
    const data = await response.json();
    
    if (!data.results) return [];
    
    return data.results.map((result: any) => ({
      id: `${result.latitude},${result.longitude}`,
      name: result.name,
      lat: result.latitude,
      lon: result.longitude,
      country: result.country,
      state: result.admin1,
    }));
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
}

export async function getLocationByCoords(lat: number, lon: number): Promise<Location | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
    );
    
    if (!response.ok) throw new Error('Reverse geocoding failed');
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return {
        id: `${lat},${lon}`,
        name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
        lat,
        lon,
      };
    }
    
    const result = data.results[0];
    return {
      id: `${result.latitude},${result.longitude}`,
      name: result.name,
      lat: result.latitude,
      lon: result.longitude,
      country: result.country,
      state: result.admin1,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      id: `${lat},${lon}`,
      name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
      lat,
      lon,
    };
  }
}

export async function getCurrentPosition(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      }
    );
  });
}

function weatherCodeToCondition(code: number, isDay: boolean): { main: string; description: string; icon: string } {
  const conditions: Record<number, { main: string; description: string; dayIcon: string; nightIcon: string }> = {
    0: { main: 'Clear', description: 'Clear sky', dayIcon: '01d', nightIcon: '01n' },
    1: { main: 'Clear', description: 'Mainly clear', dayIcon: '01d', nightIcon: '01n' },
    2: { main: 'Clouds', description: 'Partly cloudy', dayIcon: '02d', nightIcon: '02n' },
    3: { main: 'Clouds', description: 'Overcast', dayIcon: '03d', nightIcon: '03n' },
    45: { main: 'Mist', description: 'Foggy', dayIcon: '50d', nightIcon: '50n' },
    48: { main: 'Mist', description: 'Depositing rime fog', dayIcon: '50d', nightIcon: '50n' },
    51: { main: 'Drizzle', description: 'Light drizzle', dayIcon: '09d', nightIcon: '09n' },
    53: { main: 'Drizzle', description: 'Moderate drizzle', dayIcon: '09d', nightIcon: '09n' },
    55: { main: 'Drizzle', description: 'Dense drizzle', dayIcon: '09d', nightIcon: '09n' },
    61: { main: 'Rain', description: 'Slight rain', dayIcon: '10d', nightIcon: '10n' },
    63: { main: 'Rain', description: 'Moderate rain', dayIcon: '10d', nightIcon: '10n' },
    65: { main: 'Rain', description: 'Heavy rain', dayIcon: '10d', nightIcon: '10n' },
    71: { main: 'Snow', description: 'Slight snow', dayIcon: '13d', nightIcon: '13n' },
    73: { main: 'Snow', description: 'Moderate snow', dayIcon: '13d', nightIcon: '13n' },
    75: { main: 'Snow', description: 'Heavy snow', dayIcon: '13d', nightIcon: '13n' },
    77: { main: 'Snow', description: 'Snow grains', dayIcon: '13d', nightIcon: '13n' },
    80: { main: 'Rain', description: 'Slight rain showers', dayIcon: '09d', nightIcon: '09n' },
    81: { main: 'Rain', description: 'Moderate rain showers', dayIcon: '09d', nightIcon: '09n' },
    82: { main: 'Rain', description: 'Violent rain showers', dayIcon: '09d', nightIcon: '09n' },
    85: { main: 'Snow', description: 'Slight snow showers', dayIcon: '13d', nightIcon: '13n' },
    86: { main: 'Snow', description: 'Heavy snow showers', dayIcon: '13d', nightIcon: '13n' },
    95: { main: 'Thunderstorm', description: 'Thunderstorm', dayIcon: '11d', nightIcon: '11n' },
    96: { main: 'Thunderstorm', description: 'Thunderstorm with light hail', dayIcon: '11d', nightIcon: '11n' },
    99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', dayIcon: '11d', nightIcon: '11n' },
  };
  
  const condition = conditions[code] || conditions[0];
  return {
    main: condition.main,
    description: condition.description,
    icon: isDay ? condition.dayIcon : condition.nightIcon,
  };
}

export async function getWeatherData(location: Location): Promise<WeatherData> {
  const cacheKey = `${location.lat},${location.lon}`;
  const cached = weatherCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=7`
    );
    
    if (!response.ok) throw new Error('Weather data fetch failed');
    
    const data = await response.json();
    
    const currentHour = new Date().getHours();
    const sunrise = new Date(data.daily.sunrise[0]).getHours();
    const sunset = new Date(data.daily.sunset[0]).getHours();
    const isDay = currentHour >= sunrise && currentHour < sunset;
    
    const currentCondition = weatherCodeToCondition(data.current.weather_code, isDay);
    
    const current: CurrentWeather = {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.pressure_msl || data.current.surface_pressure,
      visibility: 10000,
      wind_speed: data.current.wind_speed_10m,
      wind_deg: data.current.wind_direction_10m,
      clouds: data.current.cloud_cover,
      uvi: data.daily.uv_index_max[0],
      sunrise: new Date(data.daily.sunrise[0]).getTime() / 1000,
      sunset: new Date(data.daily.sunset[0]).getTime() / 1000,
      weather: [{
        id: data.current.weather_code,
        main: currentCondition.main,
        description: currentCondition.description,
        icon: currentCondition.icon,
      }],
      dt: Date.now() / 1000,
    };
    
    const daily: DailyForecast[] = data.daily.time.slice(0, 5).map((date: string, index: number) => {
      const dayCondition = weatherCodeToCondition(data.daily.weather_code[index], true);
      return {
        dt: new Date(date).getTime() / 1000,
        temp: {
          min: data.daily.temperature_2m_min[index],
          max: data.daily.temperature_2m_max[index],
          day: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
        },
        weather: [{
          id: data.daily.weather_code[index],
          main: dayCondition.main,
          description: dayCondition.description,
          icon: dayCondition.icon,
        }],
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.current.wind_speed_10m,
        pop: data.daily.precipitation_probability_max[index] / 100,
        uvi: data.daily.uv_index_max[index],
      };
    });
    
    const weatherData: WeatherData = {
      location,
      current,
      daily,
      timezone_offset: 0,
    };
    
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
    
    return weatherData;
  } catch (error) {
    console.error('Weather data error:', error);
    throw error;
  }
}

export async function getAirQuality(lat: number, lon: number): Promise<number | null> {
  try {
    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.current?.us_aqi || null;
  } catch (error) {
    console.error('Air quality error:', error);
    return null;
  }
}
