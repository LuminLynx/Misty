# Weather Widget API Integration

This directory contains the Open-Meteo API integration for the Android weather widget.

## Overview

The widget now uses real weather data from the [Open-Meteo API](https://open-meteo.com/), a free weather API that doesn't require an API key.

## Architecture

### Components

1. **OpenMeteoApiService.kt** - Retrofit interface defining the API endpoints
2. **ApiClient.kt** - Factory for creating configured Retrofit instances

### API Endpoints

#### Weather Forecast
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Method**: GET
- **Parameters**:
  - `latitude`: Double - Location latitude
  - `longitude`: Double - Location longitude
  - `current`: String - Current weather variables (temperature, humidity, etc.)
  - `daily`: String - Daily forecast variables (high/low temps, sunrise/sunset, etc.)
  - `timezone`: String - Timezone (defaults to "auto")
  - `forecast_days`: Int - Number of days to forecast (default: 7)

### Response Models

#### WeatherForecastResponse
Contains the complete API response with:
- Current weather conditions
- Daily forecast data
- Location coordinates
- Timezone information

#### CurrentWeatherResponse
Real-time weather data:
- Temperature (°C)
- Feels like temperature (°C)
- Humidity (%)
- Weather code (WMO standard)
- Wind speed (km/h)

#### DailyWeatherResponse
Daily forecast arrays:
- High/low temperatures
- Weather codes
- Sunrise/sunset times
- UV index

## Data Flow

```
Widget Request
    ↓
WeatherWidgetRepository
    ↓
ApiClient.weatherApi
    ↓
OpenMeteoApiService (Retrofit)
    ↓
OkHttp Client
    ↓
Open-Meteo API
    ↓
JSON Response
    ↓
Gson Parsing
    ↓
Response Models
    ↓
WeatherData Model
    ↓
Widget UI
```

## Features

### Unit Conversion
The repository automatically converts:
- **Temperature**: Celsius → Fahrenheit (when needed)
- **Wind Speed**: km/h → mph (when needed)

### Weather Codes
Uses WMO Weather Interpretation Codes (WW):
- 0-3: Clear to cloudy
- 45-48: Fog
- 51-67: Rain variants
- 71-77: Snow variants
- 80-86: Showers
- 95-99: Thunderstorms

### Error Handling
- Retry logic with exponential backoff (3 attempts)
- Cached data fallback for offline scenarios
- Graceful degradation with default values

### Network Configuration
- Connect timeout: 10 seconds
- Read timeout: 30 seconds
- Write timeout: 15 seconds
- HTTP logging for debugging

## Usage Example

```kotlin
// In WeatherWidgetRepository
val lat = 37.7749
val lon = -122.4194

val response = ApiClient.weatherApi.getWeatherForecast(lat, lon)

// Access current weather
val temp = response.current.temperature_2m
val humidity = response.current.relative_humidity_2m
val weatherCode = response.current.weather_code

// Access daily forecast
val maxTemp = response.daily.temperature_2m_max[0]
val minTemp = response.daily.temperature_2m_min[0]
val sunrise = response.daily.sunrise[0]
```

## Testing

Unit tests are available in:
`android/app/src/test/java/com/luminlynx/misty/widget/WeatherWidgetRepositoryTest.kt`

Tests cover:
- Temperature conversion
- Wind speed conversion
- Weather code mapping
- Coordinate validation

## Performance

### Caching
- 30-minute cache validity
- File-based cache storage
- Automatic cache invalidation

### Battery Impact
- Minimal network usage (<5 MB/day)
- Smart scheduling via WorkManager
- Background update optimization

## Dependencies

All dependencies are already included in the project:

```gradle
// Networking
implementation "com.squareup.retrofit2:retrofit:2.11.0"
implementation "com.squareup.retrofit2:converter-gson:2.11.0"
implementation "com.squareup.okhttp3:okhttp:4.12.0"
implementation "com.squareup.okhttp3:logging-interceptor:4.12.0"

// JSON parsing
implementation "com.google.code.gson:gson:2.10.1"

// Coroutines for async operations
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1"
```

## Future Enhancements

Potential improvements:
1. Add hourly forecast API integration
2. Add location name geocoding
3. Add air quality data
4. Support multiple locations
5. Add weather alerts

## API Documentation

For more details on the Open-Meteo API:
- [API Documentation](https://open-meteo.com/en/docs)
- [WMO Weather Codes](https://open-meteo.com/en/docs#weathervariables)
- [Terms of Service](https://open-meteo.com/en/terms)

## License

Open-Meteo is free for non-commercial use. Commercial use requires attribution.
See: https://open-meteo.com/en/license
