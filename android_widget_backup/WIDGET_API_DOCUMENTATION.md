# Weather Widget API Documentation

## Overview

This document describes the public API and interfaces for the Misty Weather Widget. Use this guide to integrate the widget with your weather application or extend its functionality.

## Architecture

```
┌─────────────────────────────────────────────┐
│            Main Weather App                  │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│         WeatherWidgetRepository              │
│  (Data Layer - Implement your API here)     │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│           WidgetPreferences                  │
│      (DataStore - Configuration)             │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│            WeatherWidget                     │
│      (Glance - UI Presentation)              │
└─────────────────────────────────────────────┘
```

## Data Models

### WeatherData

The primary data model for weather information.

```kotlin
data class WeatherData(
    val location: String,              // Location name (e.g., "San Francisco")
    val temperature: Double,           // Current temperature
    val feelsLike: Double,            // Apparent temperature
    val condition: String,             // Text description (e.g., "Partly Cloudy")
    val conditionCode: Int,           // WMO weather code (0-99)
    val humidity: Int,                // Humidity percentage (0-100)
    val windSpeed: Double,            // Wind speed in km/h or mph
    val highTemp: Double,             // Today's high temperature
    val lowTemp: Double,              // Today's low temperature
    val uvIndex: Int? = null,         // UV index (optional)
    val sunrise: Long? = null,        // Sunrise time (Unix timestamp, optional)
    val sunset: Long? = null,         // Sunset time (Unix timestamp, optional)
    val lastUpdate: Long,             // Last update time (Unix timestamp)
    val isMetric: Boolean = true      // Temperature unit (true=Celsius, false=Fahrenheit)
)
```

#### Methods

**getFormattedTemperature(): String**
- Returns: Temperature with unit symbol (e.g., "22°C")

**getFormattedFeelsLike(): String**
- Returns: Feels like temperature (e.g., "Feels like 20°C")

**getFormattedHighLow(): String**
- Returns: High/low range (e.g., "H:25°C L:18°C")

**getFormattedHumidity(): String**
- Returns: Formatted humidity (e.g., "Humidity: 65%")

**getFormattedWindSpeed(): String**
- Returns: Formatted wind speed (e.g., "Wind: 15 km/h")

**getWeatherIconName(): String**
- Returns: Resource name for weather icon
- Based on WMO weather codes

### HourlyForecast

Hourly weather forecast data.

```kotlin
data class HourlyForecast(
    val time: Long,                   // Unix timestamp
    val temperature: Double,          // Forecasted temperature
    val condition: String,            // Weather condition text
    val conditionCode: Int           // WMO weather code
)
```

### DailyForecast

Daily weather forecast data.

```kotlin
data class DailyForecast(
    val date: Long,                   // Unix timestamp
    val highTemp: Double,             // High temperature
    val lowTemp: Double,              // Low temperature
    val condition: String,            // Weather condition text
    val conditionCode: Int           // WMO weather code
)
```

## Repository Interface

### WeatherWidgetRepository

The repository class handles data fetching, caching, and offline support.

```kotlin
class WeatherWidgetRepository(private val context: Context)
```

#### Methods

**suspend fun getWeatherData(...): Result<WeatherData>**

Fetch current weather data with caching.

```kotlin
suspend fun getWeatherData(
    latitude: String,           // Latitude coordinate
    longitude: String,          // Longitude coordinate
    isMetric: Boolean,         // Temperature unit
    forceRefresh: Boolean = false  // Skip cache if true
): Result<WeatherData>
```

**Returns**: `Result<WeatherData>` - Success with data or failure with exception

**Behavior**:
- Checks cache if `forceRefresh` is false
- Returns cached data if valid (< 30 minutes old)
- Fetches from API with exponential backoff (3 attempts)
- Caches successful results
- Falls back to expired cache on network failure

**Example**:
```kotlin
val repository = WeatherWidgetRepository(context)
val result = repository.getWeatherData(
    latitude = "37.7749",
    longitude = "-122.4194",
    isMetric = true,
    forceRefresh = false
)

when {
    result.isSuccess -> {
        val weather = result.getOrNull()
        // Use weather data
    }
    result.isFailure -> {
        val error = result.exceptionOrNull()
        // Handle error
    }
}
```

**suspend fun getHourlyForecast(...): Result<List<HourlyForecast>>**

Fetch hourly forecast data.

```kotlin
suspend fun getHourlyForecast(
    latitude: String,
    longitude: String,
    hours: Int = 24            // Number of hours to fetch
): Result<List<HourlyForecast>>
```

**suspend fun getDailyForecast(...): Result<List<DailyForecast>>**

Fetch daily forecast data.

```kotlin
suspend fun getDailyForecast(
    latitude: String,
    longitude: String,
    days: Int = 7              // Number of days to fetch
): Result<List<DailyForecast>>
```

**fun clearCache()**

Clear all cached weather data.

```kotlin
fun clearCache()
```

## Preferences Interface

### WidgetPreferences

Manages widget configuration using DataStore.

```kotlin
class WidgetPreferences(private val context: Context)
```

#### Data Class

**WidgetConfig**

```kotlin
data class WidgetConfig(
    val theme: String,                    // "Light", "Dark", "Auto"
    val colorScheme: String,              // "Blue", "Purple", "Green", "Orange", "Pink"
    val temperatureUnit: String,          // "Celsius", "Fahrenheit"
    val updateFrequency: Int,             // Minutes: 15, 30, 60, 180
    val transparency: Int,                // 0-100
    val fontSize: String,                 // "Small", "Medium", "Large"
    val showFeelsLike: Boolean,
    val showHumidity: Boolean,
    val showWind: Boolean,
    val showUvIndex: Boolean,
    val showSunriseSunset: Boolean,
    val location: String,                 // Location name
    val latitude: String,                 // Latitude coordinate
    val longitude: String                 // Longitude coordinate
)
```

#### Properties (Flows)

All preferences are exposed as Kotlin Flows:

```kotlin
val theme: Flow<String>
val colorScheme: Flow<String>
val temperatureUnit: Flow<String>
val updateFrequency: Flow<Int>
val transparency: Flow<Int>
val fontSize: Flow<String>
val showFeelsLike: Flow<Boolean>
val showHumidity: Flow<Boolean>
val showWind: Flow<Boolean>
val showUvIndex: Flow<Boolean>
val showSunriseSunset: Flow<Boolean>
val location: Flow<String>
val latitude: Flow<String>
val longitude: Flow<String>
val widgetConfig: Flow<WidgetConfig>  // Combined config
```

#### Methods

**suspend fun setTheme(theme: String)**
- Values: "Light", "Dark", "Auto"

**suspend fun setColorScheme(colorScheme: String)**
- Values: "Blue", "Purple", "Green", "Orange", "Pink"

**suspend fun setTemperatureUnit(unit: String)**
- Values: "Celsius", "Fahrenheit"

**suspend fun setUpdateFrequency(minutes: Int)**
- Values: 15, 30, 60, 180

**suspend fun setTransparency(level: Int)**
- Range: 0-100

**suspend fun setFontSize(size: String)**
- Values: "Small", "Medium", "Large"

**suspend fun setShowFeelsLike(show: Boolean)**

**suspend fun setShowHumidity(show: Boolean)**

**suspend fun setShowWind(show: Boolean)**

**suspend fun setShowUvIndex(show: Boolean)**

**suspend fun setShowSunriseSunset(show: Boolean)**

**suspend fun setLocation(location: String, latitude: String, longitude: String)**

#### Example Usage

```kotlin
val preferences = WidgetPreferences(context)

// Read preferences
lifecycleScope.launch {
    preferences.widgetConfig.collect { config ->
        println("Theme: ${config.theme}")
        println("Update frequency: ${config.updateFrequency} minutes")
    }
}

// Update preferences
lifecycleScope.launch {
    preferences.setTheme("Dark")
    preferences.setUpdateFrequency(60)
    preferences.setLocation("San Francisco", "37.7749", "-122.4194")
}
```

## Worker Interface

### WeatherWidgetWorker

WorkManager worker for background updates.

```kotlin
class WeatherWidgetWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params)
```

#### Static Methods

**fun schedulePeriodicUpdate(context: Context, intervalMinutes: Long)**

Schedule periodic widget updates.

```kotlin
WeatherWidgetWorker.schedulePeriodicUpdate(context, intervalMinutes = 30L)
```

**Parameters**:
- `context`: Application context
- `intervalMinutes`: Update interval (minimum 15 minutes)

**Behavior**:
- Uses WorkManager for reliable background execution
- Respects battery saver mode
- Skips updates when battery < 15%
- Replaces existing schedule if called multiple times

**fun cancelPeriodicUpdate(context: Context)**

Cancel scheduled updates.

```kotlin
WeatherWidgetWorker.cancelPeriodicUpdate(context)
```

## Widget Interface

### WeatherWidget

Main Glance widget implementation.

```kotlin
class WeatherWidget : GlanceAppWidget()
```

#### Methods

**override suspend fun provideGlance(context: Context, id: GlanceId)**

Provides widget content using Glance composables.

**Called by**: Android system when widget needs to render

**Behavior**:
- Loads preferences
- Fetches weather data
- Renders appropriate UI based on data availability

### WeatherWidgetReceiver

AppWidget broadcast receiver.

```kotlin
class WeatherWidgetReceiver : GlanceAppWidgetReceiver()
```

#### Static Methods

**fun updateAllWidgets(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray)**

Manually trigger widget updates.

```kotlin
WeatherWidgetReceiver.updateAllWidgets(context, appWidgetManager, appWidgetIds)
```

**Example**:
```kotlin
val appWidgetManager = AppWidgetManager.getInstance(context)
val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)

WeatherWidgetReceiver.updateAllWidgets(context, appWidgetManager, appWidgetIds)
```

## Weather Codes

### WMO Weather Interpretation Codes

The widget uses WMO (World Meteorological Organization) weather codes:

| Code | Description | Icon Resource |
|------|-------------|---------------|
| 0 | Clear sky | `ic_clear_sky` |
| 1, 2, 3 | Mainly clear, partly cloudy, overcast | `ic_partly_cloudy` |
| 45, 48 | Fog and depositing rime fog | `ic_fog` |
| 51, 53, 55 | Drizzle: Light, moderate, dense | `ic_drizzle` |
| 61, 63, 65 | Rain: Slight, moderate, heavy | `ic_rain` |
| 66, 67 | Freezing rain: Light, heavy | `ic_freezing_rain` |
| 71, 73, 75 | Snow fall: Slight, moderate, heavy | `ic_snow` |
| 77 | Snow grains | `ic_snow_grains` |
| 80, 81, 82 | Rain showers: Slight, moderate, violent | `ic_rain_showers` |
| 85, 86 | Snow showers: Slight, heavy | `ic_snow_showers` |
| 95 | Thunderstorm: Slight or moderate | `ic_thunderstorm` |
| 96, 99 | Thunderstorm with hail | `ic_thunderstorm_hail` |

### Icon Resources

All weather icons are vector drawables located in:
```
app/src/main/res/drawable/
```

## Integration Examples

### Setting Up the Widget in Your App

```kotlin
class YourMainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize widget preferences
        val preferences = WidgetPreferences(this)
        lifecycleScope.launch {
            // Set default location from your app's location
            preferences.setLocation(
                location = userLocation.name,
                latitude = userLocation.latitude.toString(),
                longitude = userLocation.longitude.toString()
            )
            
            // Configure widget defaults
            preferences.setTemperatureUnit(if (userPrefersCelsius) "Celsius" else "Fahrenheit")
            preferences.setUpdateFrequency(30)
        }
    }
}
```

### Implementing Custom Weather API

```kotlin
class MyWeatherRepository(context: Context) : WeatherWidgetRepository(context) {
    
    private val apiService: MyWeatherApiService = RetrofitBuilder.build()
    
    override suspend fun fetchWeatherDataFromApi(
        latitude: String,
        longitude: String,
        isMetric: Boolean
    ): WeatherData {
        val response = apiService.getCurrentWeather(
            lat = latitude,
            lon = longitude,
            units = if (isMetric) "metric" else "imperial"
        )
        
        return WeatherData(
            location = response.name,
            temperature = response.main.temp,
            feelsLike = response.main.feels_like,
            condition = response.weather[0].description.capitalize(),
            conditionCode = mapToWmoCode(response.weather[0].id),
            humidity = response.main.humidity,
            windSpeed = response.wind.speed,
            highTemp = response.main.temp_max,
            lowTemp = response.main.temp_min,
            uvIndex = null, // Fetch separately if needed
            lastUpdate = System.currentTimeMillis(),
            isMetric = isMetric
        )
    }
    
    private fun mapToWmoCode(openWeatherMapCode: Int): Int {
        // Map your API's weather codes to WMO codes
        return when (openWeatherMapCode) {
            800 -> 0  // Clear
            801, 802 -> 2  // Partly cloudy
            803, 804 -> 3  // Overcast
            500, 501, 502 -> 61  // Rain
            // ... add more mappings
            else -> 0
        }
    }
}
```

### Triggering Widget Update from App

```kotlin
fun updateWidgetFromApp(context: Context) {
    lifecycleScope.launch {
        // Update data
        val repository = WeatherWidgetRepository(context)
        val preferences = WidgetPreferences(context)
        val config = preferences.widgetConfig.first()
        
        repository.getWeatherData(
            config.latitude,
            config.longitude,
            config.temperatureUnit == "Celsius",
            forceRefresh = true
        )
        
        // Trigger widget refresh
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
        val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
        
        WeatherWidgetReceiver.updateAllWidgets(context, appWidgetManager, appWidgetIds)
    }
}
```

## Error Handling

### Common Errors

**Network Errors**
- Exception: `IOException`, `UnknownHostException`
- Handling: Exponential backoff, fallback to cache

**Location Errors**
- Exception: `SecurityException`
- Handling: Check permissions, provide manual input option

**Data Errors**
- Exception: `JsonSyntaxException`, `NullPointerException`
- Handling: Log error, use default values

### Error Response Example

```kotlin
repository.getWeatherData(lat, lon, true).fold(
    onSuccess = { weatherData ->
        // Update widget with data
    },
    onFailure = { exception ->
        when (exception) {
            is IOException -> {
                // Network error
                showCachedDataWithWarning()
            }
            is SecurityException -> {
                // Permission error
                showPermissionRequiredMessage()
            }
            else -> {
                // Unknown error
                logError(exception)
                showGenericError()
            }
        }
    }
)
```

## Performance Considerations

### Caching Strategy

- **Cache Duration**: 30 minutes default
- **Cache Location**: `context.cacheDir/weather_cache.json`
- **Cache Invalidation**: Automatic on expiry or manual via `clearCache()`

### Network Optimization

- **Retry Logic**: Max 3 attempts with exponential backoff
- **Timeout**: Handled by Retrofit/OkHttp configuration
- **Compression**: Enable gzip in OkHttp

### Battery Optimization

- **Update Frequency**: Minimum 15 minutes (WorkManager constraint)
- **Low Battery**: Skips updates when battery < 15%
- **Doze Mode**: WorkManager handles automatically

## Testing

### Unit Tests

```kotlin
@Test
fun weatherData_formatsTemperature_correctly() {
    val data = WeatherData(
        location = "Test",
        temperature = 22.0,
        // ... other fields
        isMetric = true
    )
    
    assertEquals("22°C", data.getFormattedTemperature())
}
```

### Integration Tests

```kotlin
@Test
fun repository_fetchesAndCachesData() = runBlocking {
    val repository = WeatherWidgetRepository(context)
    
    val result = repository.getWeatherData("37.7749", "-122.4194", true)
    
    assertTrue(result.isSuccess)
    assertNotNull(result.getOrNull())
}
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial release |

## Support

For API questions or integration help:
- GitHub Issues: [Link to repository]
- Documentation: [Link to docs]
- Email: support@luminlynx.com

---

**API Version**: 1.0  
**Last Updated**: 2024-01-01  
**Compatibility**: Android 12+ (API 31+)
