# Weather Widget Integration Guide

## Overview
This guide explains how to integrate the Android 15 Weather Widget with your main weather application.

## Architecture

### Components

1. **WeatherWidget** - Main Glance widget implementation
2. **WeatherWidgetReceiver** - AppWidget broadcast receiver
3. **WeatherWidgetWorker** - WorkManager for background updates
4. **WeatherWidgetRepository** - Data layer for weather information
5. **WeatherWidgetConfigActivity** - Configuration UI
6. **WidgetPreferences** - DataStore preferences management

### Data Flow

```
User Device → Widget Tap → MainActivity (Placeholder)
                ↓
        WeatherWidgetWorker (Periodic)
                ↓
        WeatherWidgetRepository
                ↓
        Weather API / Cache
                ↓
        WeatherWidget (UI Update)
```

## Integration Steps

### 1. Connect to Your Weather App

Replace the placeholder `MainActivity` in `WeatherWidget.kt` with your actual main activity:

```kotlin
// In WeatherWidget.kt, update the clickable action:
.clickable(actionStartActivity<YourMainActivity>())
```

### 2. Implement Weather API

Update `WeatherWidgetRepository.kt` to fetch real weather data:

```kotlin
private suspend fun fetchWeatherDataFromApi(
    latitude: String,
    longitude: String,
    isMetric: Boolean
): WeatherData {
    // Replace with your actual API implementation
    val response = weatherApiService.getCurrentWeather(latitude, longitude)
    
    return WeatherData(
        location = response.locationName,
        temperature = response.temperature,
        // ... map all fields
    )
}
```

### 3. Configure Location Services

Add location permission handling in your main app and share coordinates with the widget:

```kotlin
// In your main app, save location to widget preferences
val preferences = WidgetPreferences(context)
preferences.setLocation(
    location = "City Name",
    latitude = "37.7749",
    longitude = "-122.4194"
)
```

### 4. Set Up Deep Linking

Configure deep links for widget taps to specific screens:

```kotlin
// In WeatherWidget.kt, add action parameters:
.clickable(
    actionStartActivity(
        Intent(context, MainActivity::class.java).apply {
            action = "com.luminlynx.misty.OPEN_WEATHER"
            putExtra("LOCATION_ID", locationId)
        }
    )
)
```

### 5. Customize Widget Appearance

Modify color schemes in `WeatherWidget.kt`:

```kotlin
private fun getBackgroundColor(colorScheme: String, isDarkTheme: Boolean, transparency: Int): Color {
    // Add your custom color schemes here
    val baseColor = when (colorScheme) {
        "CustomScheme" -> if (isDarkTheme) Color(0xFF...) else Color(0xFF...)
        // ... existing schemes
    }
}
```

## Data Requirements

### Weather Data Model

Your API should provide the following data points:

- **Required:**
  - Location name
  - Current temperature
  - Feels-like temperature
  - Weather condition (text)
  - Weather condition code (WMO code)
  - Humidity percentage
  - Wind speed
  - High temperature
  - Low temperature

- **Optional:**
  - UV index
  - Sunrise time (Unix timestamp)
  - Sunset time (Unix timestamp)

### Example API Response Mapping

```kotlin
// Example: Open-Meteo API
fun mapOpenMeteoResponse(response: OpenMeteoResponse): WeatherData {
    return WeatherData(
        location = response.timezone,
        temperature = response.current_weather.temperature,
        feelsLike = calculateFeelsLike(
            response.current_weather.temperature,
            response.current_weather.windspeed,
            response.hourly.relativehumidity_2m[0]
        ),
        condition = getConditionText(response.current_weather.weathercode),
        conditionCode = response.current_weather.weathercode,
        humidity = response.hourly.relativehumidity_2m[0],
        windSpeed = response.current_weather.windspeed,
        highTemp = response.daily.temperature_2m_max[0],
        lowTemp = response.daily.temperature_2m_min[0],
        lastUpdate = System.currentTimeMillis(),
        isMetric = true
    )
}
```

## Configuration

### Widget Preferences

The widget stores preferences using DataStore. Available settings:

- **Theme**: Light, Dark, Auto
- **Color Scheme**: Blue, Purple, Green, Orange, Pink
- **Temperature Unit**: Celsius, Fahrenheit
- **Update Frequency**: 15min, 30min, 1hr, 3hr
- **Transparency**: 0-100%
- **Font Size**: Small, Medium, Large
- **Display Toggles**: Feels like, humidity, wind, UV index, sunrise/sunset
- **Location**: Name, latitude, longitude

### Accessing Preferences from Main App

```kotlin
val preferences = WidgetPreferences(context)

// Read preferences
lifecycleScope.launch {
    preferences.widgetConfig.collect { config ->
        // Use config values
        val theme = config.theme
        val updateFrequency = config.updateFrequency
    }
}

// Update preferences
lifecycleScope.launch {
    preferences.setTheme("Dark")
    preferences.setUpdateFrequency(60)
}
```

## Background Updates

### WorkManager Configuration

The widget uses WorkManager for periodic updates:

```kotlin
// Schedule updates (called automatically when widget is enabled)
WeatherWidgetWorker.schedulePeriodicUpdate(context, intervalMinutes = 30L)

// Cancel updates (called automatically when last widget is removed)
WeatherWidgetWorker.cancelPeriodicUpdate(context)
```

### Battery Optimization

The worker automatically:
- Skips updates when battery is below 15%
- Respects user-configured update frequency
- Uses exponential backoff for failed API calls
- Leverages cached data when offline

## Testing

### Manual Widget Update

Trigger a widget update manually:

```kotlin
val appWidgetManager = AppWidgetManager.getInstance(context)
val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)

WeatherWidgetReceiver.updateAllWidgets(context, appWidgetManager, appWidgetIds)
```

### Mock Data for Testing

The repository includes mock data by default. Replace `fetchWeatherDataFromApi` with your implementation.

### Configuration Testing

1. Add widget to home screen
2. Configuration activity should appear
3. Change settings and save
4. Widget should update immediately
5. Long-press widget → "Reconfigure" should work

## Permissions

### Required Permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### Runtime Permission Handling

Implement in your main app:

```kotlin
// Request location permission
if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
    != PackageManager.PERMISSION_GRANTED) {
    ActivityCompat.requestPermissions(
        activity,
        arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
        LOCATION_PERMISSION_REQUEST_CODE
    )
}

// For Android 10+ background location
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
    ActivityCompat.requestPermissions(
        activity,
        arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
        BACKGROUND_LOCATION_PERMISSION_REQUEST_CODE
    )
}
```

## Troubleshooting

### Widget Not Updating

1. Check WorkManager is scheduled: `WorkManager.getInstance(context).getWorkInfosForUniqueWork("weather_widget_update_work")`
2. Verify location is set in preferences
3. Check network connectivity
4. Review logs for errors: `adb logcat | grep WeatherWidget`

### Configuration Not Saving

1. Ensure DataStore is properly initialized
2. Check coroutine scope is not cancelled prematurely
3. Verify preferences are being read correctly

### Widget Shows Loading State

1. Confirm location coordinates are set
2. Check API implementation returns valid data
3. Verify cache is working (check cache file exists)
4. Review repository logs for API errors

## Performance Tips

1. **Minimize Widget Refreshes**: Use appropriate update frequency
2. **Cache Aggressively**: Default 30-minute cache validity is optimal
3. **Use Vector Drawables**: All weather icons should be vectors
4. **Optimize Layouts**: Keep widget complexity minimal
5. **Batch Updates**: Update multiple widgets together when possible

## Best Practices

1. **Respect User Preferences**: Always honor update frequency settings
2. **Handle Offline Gracefully**: Show cached data with indicator
3. **Provide Clear Errors**: Show meaningful error messages
4. **Support Accessibility**: Ensure proper content descriptions
5. **Test on Multiple Devices**: Verify on various Android versions and launchers
6. **Monitor Battery Usage**: Use Android Battery Historian to analyze impact

## Support

For issues or questions:
- Check logs: `adb logcat -s WeatherWidget*`
- Review WorkManager status: `adb shell dumpsys jobscheduler`
- Inspect widget state: `adb shell dumpsys appwidget`

## License

This widget implementation follows the main application license.
