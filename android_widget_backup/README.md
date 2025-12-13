# Misty Weather Widget for Android 15

A fully customizable weather widget for Android 15 using Jetpack Glance, featuring Material Design 3, comprehensive configuration options, and intelligent background updates.

## Overview

The Misty Weather Widget is a modern home screen widget that displays current weather information with extensive customization options. Built with Jetpack Glance, it provides a native Android experience with smooth performance and battery optimization.

## ✨ Features

### Core Functionality
- **Jetpack Glance UI**: Modern widget framework for Android 12+
- **Current Weather Display**: Temperature, condition icon, location, feels-like temperature
- **Extended Metrics**: Humidity, wind speed, UV index, high/low temperatures
- **12+ Weather Icons**: Vector drawables for all weather conditions (WMO codes)
- **Smart Caching**: 30-minute cache validity with offline support
- **Battery Optimization**: Intelligent updates with low-battery detection

### Customization Options
- **Theme Selection**: Light, Dark, or Auto (system-following)
- **5 Color Schemes**: Blue, Purple, Green, Orange, Pink
- **Temperature Units**: Celsius or Fahrenheit
- **Update Frequency**: 15min, 30min, 1hr, or 3hr intervals
- **Adjustable Transparency**: 0-100% background opacity
- **Font Sizes**: Small, Medium, or Large
- **Metric Toggles**: Show/hide individual weather metrics

### Advanced Features
- **WorkManager Integration**: Reliable background updates
- **DataStore Preferences**: Modern configuration storage
- **Exponential Backoff**: Smart retry logic for network failures
- **Material Design 3**: Follows latest Android design guidelines
- **Jetpack Compose Configuration**: Modern configuration UI

## 📁 Project Structure

```
android/
├── app/
│   ├── src/main/java/com/luminlynx/misty/widget/
│   │   ├── WeatherWidget.kt                  # Main Glance widget
│   │   ├── WeatherWidgetReceiver.kt          # AppWidget receiver
│   │   ├── WeatherWidgetWorker.kt            # WorkManager background updates
│   │   ├── WeatherWidgetProvider.kt          # Legacy provider (deprecated)
│   │   ├── config/
│   │   │   ├── WidgetPreferences.kt          # DataStore preferences
│   │   │   └── WeatherWidgetConfigActivity.kt # Configuration UI
│   │   ├── data/
│   │   │   └── WeatherWidgetRepository.kt    # Data layer
│   │   ├── model/
│   │   │   └── WeatherData.kt                # Data models
│   │   └── ui/
│   │       └── (Glance composables)
│   ├── src/main/res/
│   │   ├── drawable/                         # 12+ weather icons (vectors)
│   │   ├── layout/
│   │   │   └── weather_widget_layout.xml     # Legacy layout
│   │   ├── xml/
│   │   │   └── weather_widget_info.xml       # Widget metadata
│   │   └── values/
│   │       └── strings.xml                   # String resources
│   ├── build.gradle.kts                      # App dependencies
│   └── AndroidManifest.xml                   # App manifest
├── build.gradle.kts                          # Project config
├── settings.gradle.kts                       # Gradle settings
├── WIDGET_INTEGRATION_GUIDE.md               # Integration docs
├── WIDGET_USER_GUIDE.md                      # User documentation
├── WIDGET_API_DOCUMENTATION.md               # API reference
└── WIDGET_TESTING_GUIDE.md                   # Testing guidelines
```

## 🔧 Requirements

### Platform
- **Minimum SDK**: Android 12 (API 31) - Required for modern widget features
- **Target SDK**: Android 15 (API 35)
- **Compile SDK**: Android 15 (API 35)

### Development Tools
- **Kotlin**: 2.0.0
- **Gradle**: 8.7+ (via wrapper)
- **Android Gradle Plugin**: 8.5.0
- **Android Studio**: Latest stable version

### Key Dependencies
- Jetpack Glance: 1.1.0
- Jetpack Compose: BOM 2024.06.00
- WorkManager: 2.9.0
- DataStore Preferences: 1.1.1
- Coroutines: 1.8.1
- Retrofit: 2.11.0 (for API integration)

## 🚀 Quick Start

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/LuminLynx/Misty.git
cd Misty/android

# Build the project
./gradlew build

# Run on connected device or emulator
./gradlew installDebug
```

### 2. Add Widget to Home Screen

1. Long-press on your Android home screen
2. Tap "Widgets" from the menu
3. Find "Misty Weather Widget"
4. Drag it to your desired location
5. Configuration screen appears automatically
6. Customize settings and tap "Save"

### 3. Configure Widget Settings

From the configuration screen, you can:
- Choose theme (Light/Dark/Auto)
- Select color scheme
- Set temperature unit (°C/°F)
- Adjust update frequency
- Toggle individual metrics
- Set transparency level
- Change font size

## 📱 Installation

### Development Build

```bash
cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Release Build

```bash
./gradlew assembleRelease
# APK will be in app/build/outputs/apk/release/
```

### From Android Studio

1. Open the `android` directory in Android Studio
2. Select "Run" → "Run 'app'"
3. Choose your device/emulator

## ⚙️ Configuration

### Widget Sizes

The widget supports multiple sizes:

- **Small (2×2)**: Basic info only
- **Medium (4×2)**: Default, full current conditions
- **Large (4×4)**: Extended metrics (planned)
- **Extra Large (6×4)**: Weekly forecast (planned)

### Update Intervals

Choose from:
- **15 minutes**: Most frequent (higher battery use)
- **30 minutes**: Recommended balance
- **1 hour**: Good for battery life
- **3 hours**: Minimal battery impact

### Battery Optimization

The widget automatically:
- Pauses updates when battery < 15%
- Uses WorkManager for efficient scheduling
- Leverages cached data (30-minute validity)
- Implements exponential backoff for failures

## 🔒 Permissions

Required permissions in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### Runtime Permissions

Location permissions must be requested at runtime (Android 6+):
- Fine location for precise weather data
- Background location for automatic updates

See [WIDGET_INTEGRATION_GUIDE.md](WIDGET_INTEGRATION_GUIDE.md) for implementation details.

## 🏗️ Architecture

### Components

1. **WeatherWidget** (Glance)
   - Main UI implementation using Jetpack Glance
   - Composable-based widget content
   - Theme and color scheme support

2. **WeatherWidgetReceiver** (AppWidget)
   - Handles widget lifecycle events
   - Manages widget updates
   - Schedules/cancels background work

3. **WeatherWidgetWorker** (WorkManager)
   - Periodic background updates
   - Battery-aware scheduling
   - Exponential backoff on failures

4. **WeatherWidgetRepository** (Data)
   - Weather data fetching
   - Caching mechanism
   - Offline support

5. **WidgetPreferences** (DataStore)
   - Configuration storage
   - Reactive preferences with Flow
   - Type-safe settings

6. **WeatherWidgetConfigActivity** (Compose)
   - Configuration UI
   - Real-time preview
   - Material 3 design

### Data Flow

```
User → Widget Tap → MainActivity
         ↓
    WorkManager (scheduled)
         ↓
    Repository → API/Cache
         ↓
    WeatherData Model
         ↓
    Widget Update (Glance)
         ↓
    Home Screen Display
```

## 🎨 Customization

### Adding Custom Color Schemes

In `WeatherWidget.kt`:

```kotlin
private fun getBackgroundColor(...): Color {
    val baseColor = when (colorScheme) {
        "YourScheme" -> if (isDarkTheme) Color(0xFF...) else Color(0xFF...)
        // ...
    }
}
```

### Adding Weather Icons

1. Create vector drawable in `res/drawable/`
2. Update `WeatherData.getWeatherIconName()` to map WMO codes
3. Icons automatically display in widget

### Custom Update Intervals

Modify available frequencies in `WeatherWidgetConfigActivity.kt`:

```kotlin
listOf(15 to "15min", 30 to "30min", 60 to "1hr", 180 to "3hr")
```

## 🧪 Testing

### Unit Tests

```bash
./gradlew test
```

### Instrumented Tests

```bash
./gradlew connectedAndroidTest
```

### Manual Testing

See [WIDGET_TESTING_GUIDE.md](WIDGET_TESTING_GUIDE.md) for comprehensive testing procedures.

## 📚 Documentation

Comprehensive documentation is available:

- **[Integration Guide](WIDGET_INTEGRATION_GUIDE.md)**: Connect widget to your app
- **[User Guide](WIDGET_USER_GUIDE.md)**: End-user documentation
- **[API Documentation](WIDGET_API_DOCUMENTATION.md)**: Developer reference
- **[Testing Guide](WIDGET_TESTING_GUIDE.md)**: Testing procedures

## 🔧 Development

### Implementing Weather API

The repository includes mock data by default. To integrate a real API:

1. Update `WeatherWidgetRepository.fetchWeatherDataFromApi()`
2. Add Retrofit service interface
3. Map API response to `WeatherData` model
4. Handle API-specific error codes

Example integration with Open-Meteo API is provided in the documentation.

### Debugging

Enable detailed logging:

```bash
adb logcat -s WeatherWidget:* WeatherWidgetWorker:* WeatherWidgetRepository:*
```

Check WorkManager status:

```bash
adb shell dumpsys jobscheduler | grep weather_widget
```

Inspect widget state:

```bash
adb shell dumpsys appwidget | grep Misty
```

## 🐛 Known Issues

1. **Mock Data**: Currently uses placeholder weather data
   - **Fix**: Implement actual API in repository

2. **Location Services**: Manual location setting required
   - **Fix**: Add location detection in main app

3. **Single Size**: Only medium (4×2) widget implemented
   - **Fix**: Add size-specific layouts (planned)

## 🚧 Planned Features

### Short Term
- [ ] Runtime permission handling in config
- [ ] Refresh button for manual updates
- [ ] Location selection in config
- [ ] Real weather API integration

### Medium Term
- [ ] Multiple widget sizes (2×2, 4×4, 6×4)
- [ ] Hourly forecast in large widget
- [ ] Weekly forecast in XL widget
- [ ] Animated weather icons

### Long Term
- [ ] Weather alerts with notifications
- [ ] Multiple location support
- [ ] Widget pinning suggestions
- [ ] AI-powered insights

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the main repository LICENSE file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check the guides in this directory
- **Issues**: Report bugs on GitHub
- **Questions**: Open a discussion on GitHub

### Common Issues

**Widget not updating?**
- Check background restrictions in Settings → Apps → Misty
- Verify WorkManager is scheduled
- Check logs for errors

**Configuration not saving?**
- Ensure DataStore has write permissions
- Check for coroutine cancellation
- Restart device if needed

**Weather data not loading?**
- Verify internet connection
- Check location is set in preferences
- Review API implementation in repository

## 📞 Contact

- **GitHub**: [@LuminLynx](https://github.com/LuminLynx)
- **Repository**: [Misty](https://github.com/LuminLynx/Misty)

---

Built with ❤️ using Jetpack Glance and Material Design 3
