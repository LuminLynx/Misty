# Weather Dashboard

A comprehensive, modern weather dashboard web application built with React, TypeScript, and Tailwind CSS. Get real-time weather data, extended forecasts, and rich location selection features with an elegant, data-focused interface.

## Features

### Current Weather Display
- Real-time temperature and "feels like" temperature
- Weather condition with animated icon
- Humidity, wind speed, and direction
- Visibility information
- UV Index with severity level
- Sunrise and sunset times
- Air Quality Index (AQI) with health levels

### 5-Day Weather Forecast
- Daily weather predictions with min/max temperatures
- Weather condition icons and descriptions
- Precipitation probability
- Horizontal scrolling on mobile, grid layout on desktop

### Flexible Location Selection
- **Search by city name**: Type any city name with autocomplete suggestions
- **Geolocation**: Use your device's location with one click
- **Manual coordinates**: Enter latitude/longitude for precise locations
- **Favorites**: Save frequently checked locations with star icon
- **Recent locations**: Auto-tracking of last 10 searched locations

### Location Comparison
- Compare weather conditions across up to 4 locations simultaneously
- Side-by-side view of key metrics
- Perfect for travel planning or monitoring multiple areas

### Personalization
- **Temperature units**: Toggle between Celsius and Fahrenheit
- **Dark/Light mode**: Choose your preferred theme
- **Persistent settings**: All preferences saved between sessions

### Responsive Design
- Mobile-first design that works beautifully on all screen sizes
- Collapsible sidebar on mobile devices
- Touch-friendly interactive elements
- Adaptive layout for tablets and desktops

## Weather Data APIs

This application uses **free, no-API-key-required** weather services:

### Primary APIs
1. **Open-Meteo Weather API** (https://open-meteo.com)
   - Provides current weather and 7-day forecasts
   - No API key required
   - No rate limits for reasonable use
   - Provides temperature, humidity, wind, precipitation, and more

2. **Open-Meteo Geocoding API** (https://geocoding-api.open-meteo.com)
   - Location search and reverse geocoding
   - No API key required
   - Returns coordinates and location details

3. **Open-Meteo Air Quality API** (https://air-quality-api.open-meteo.com)
   - US Air Quality Index (AQI)
   - No API key required

### Data Caching
Weather data is cached for 10 minutes to improve performance and respect API usage guidelines.

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Phosphor Icons** - Icon library
- **Sonner** - Toast notifications
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn UI components
│   ├── WeatherIcon.tsx          # Animated weather icons
│   ├── CurrentWeatherCard.tsx   # Main weather display
│   ├── ForecastCards.tsx        # 5-day forecast
│   ├── LocationSearch.tsx       # City search with autocomplete
│   ├── LocationSidebar.tsx      # Favorites and recent locations
│   ├── ManualLocationDialog.tsx # Manual coordinate entry
│   ├── SettingsPanel.tsx        # User preferences
│   └── ComparisonView.tsx       # Side-by-side comparison
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   ├── weatherApi.ts            # API integration and data fetching
│   ├── formatters.ts            # Temperature, time, and data formatters
│   └── utils.ts                 # Utility functions
├── hooks/
│   └── use-mobile.ts            # Mobile breakpoint detection
├── App.tsx                      # Main application component
└── index.css                    # Global styles and theme
```

## Customization Guide

### Changing Weather Data Source

If you want to use a different weather API:

1. Open `src/lib/weatherApi.ts`
2. Modify the `getWeatherData` function to call your preferred API
3. Map the response to match the `WeatherData` interface in `src/lib/types.ts`

Example for adding an API key to Open-Meteo (if using premium):
```typescript
const response = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&apikey=YOUR_KEY&...`
);
```

### Extending Location Features

To add voice search:
1. Use the Web Speech API (`webkitSpeechRecognition` or `SpeechRecognition`)
2. Add a microphone button in `LocationSearch.tsx`
3. Pass recognized text to the search function

To add map-based selection:
1. Install a map library like Leaflet: `npm install leaflet react-leaflet`
2. Create a map component in `ManualLocationDialog.tsx`
3. Capture click coordinates and reverse geocode them

### Theme Customization

All colors are defined in `src/index.css` using CSS custom properties:

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.25 0.01 240);
  --primary: oklch(0.6 0.15 240);    /* Main brand color */
  --accent: oklch(0.7 0.15 50);      /* Highlight color */
  /* ... more colors */
}
```

Change these values to customize the color scheme.

### Adding More Weather Metrics

To add additional data points:

1. Update the `CurrentWeather` interface in `src/lib/types.ts`
2. Parse the new data in `getWeatherData` function
3. Add a new `MetricCard` in `CurrentWeatherCard.tsx`

Example for adding "Feels Like" separately:
```tsx
<MetricCard
  icon={<ThermometerSimple size={20} />}
  label="Feels Like"
  value={formatTemp(weather.feels_like, unit)}
/>
```

## Accessibility Features

- Keyboard navigation support
- WCAG AA contrast ratios (4.5:1 minimum)
- Focus indicators on all interactive elements
- Semantic HTML structure
- Screen reader friendly labels
- Responsive touch targets (minimum 44px)

## Performance Optimizations

- Weather data caching (10-minute duration)
- Debounced search input (300ms delay)
- Lazy loading of comparison data
- Optimized re-renders with proper React patterns
- Persistent storage using Spark KV store

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- Geolocation API support
- Local Storage API

## Future Enhancement Ideas

- Hourly forecast view
- Weather radar/maps integration
- Severe weather push notifications
- Historical weather data
- Weather widgets/embeds
- Multi-language support
- Accessibility improvements (voice output)
- Offline mode with service workers
- Weather alerts customization
- Custom location groups/collections

## Credits

- Weather data provided by [Open-Meteo](https://open-meteo.com)
- Icons by [Phosphor Icons](https://phosphoricons.com)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Built with [Spark](https://github.com/spark)

## License

MIT License - Feel free to use and modify for your projects!
