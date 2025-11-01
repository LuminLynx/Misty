import type { TemperatureUnit, Language } from './types';
import { translations } from './translations';

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const temp = Math.round(convertTemp(celsius, unit));
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${temp}${symbol}`;
}

export function getAQILevel(aqi: number, language: Language = 'en'): { level: string; color: string } {
  const t = translations[language];
  if (aqi <= 50) return { level: t.good, color: 'text-green-600' };
  if (aqi <= 100) return { level: t.moderate, color: 'text-yellow-600' };
  if (aqi <= 150) return { level: t.unhealthySensitive, color: 'text-orange-600' };
  if (aqi <= 200) return { level: t.unhealthy, color: 'text-red-600' };
  if (aqi <= 300) return { level: t.veryUnhealthy, color: 'text-purple-600' };
  return { level: t.hazardous, color: 'text-red-900' };
}

export function getUVILevel(uvi: number): { level: string; color: string } {
  if (uvi <= 2) return { level: 'Low', color: 'text-green-600' };
  if (uvi <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
  if (uvi <= 7) return { level: 'High', color: 'text-orange-600' };
  if (uvi <= 10) return { level: 'Very High', color: 'text-red-600' };
  return { level: 'Extreme', color: 'text-purple-600' };
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(timestamp: number, language: Language = 'en'): string {
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';
  const date = new Date(timestamp * 1000);
  const isToday = new Date().toDateString() === date.toDateString();
  
  if (isToday) {
    return translations[language].today;
  }
  
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function convertSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const mph = kmh * 0.621371;
    return `${mph.toFixed(1)} mph`;
  }
  return `${kmh.toFixed(1)} km/h`;
}

export function formatVisibility(meters: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(1)} mi`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}
