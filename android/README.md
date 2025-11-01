# Misty Weather Widget for Android 15

This directory contains the Android widget implementation for the Misty weather dashboard application.

## Overview

The Misty Weather Widget is a card-style home screen widget for Android 15 that displays current weather information. It provides users with quick access to weather data directly from their home screen.

## Features

- **Card-Style Design**: Modern, clean card-based UI following Android 15 design guidelines
- **Current Weather Display**: Shows temperature, weather condition, location
- **Additional Metrics**: Displays feels-like temperature, humidity, and wind speed
- **Auto-Refresh**: Updates every 30 minutes automatically
- **Tap to Refresh**: Users can manually trigger updates by tapping the widget
- **Responsive Layout**: Adapts to different widget sizes (minimum 4x2 cells)

## Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/luminlynx/misty/widget/
│   │       │   └── WeatherWidgetProvider.kt    # Main widget provider
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── weather_widget_layout.xml # Widget UI layout
│   │       │   ├── xml/
│   │       │   │   └── weather_widget_info.xml   # Widget metadata
│   │       │   ├── drawable/
│   │       │   │   ├── widget_background.xml     # Card background
│   │       │   │   ├── widget_preview.xml        # Widget preview
│   │       │   │   └── ic_weather_placeholder.xml # Weather icon
│   │       │   └── values/
│   │       │       └── strings.xml               # String resources
│   │       └── AndroidManifest.xml               # App manifest
│   ├── build.gradle.kts                          # App-level Gradle config
│   └── proguard-rules.pro                        # ProGuard rules
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties             # Gradle wrapper config
├── build.gradle.kts                              # Project-level Gradle config
├── settings.gradle.kts                           # Gradle settings
├── gradle.properties                             # Gradle properties
└── .gitignore                                    # Git ignore rules

```

## Requirements

- **Minimum SDK**: Android 8.0 (API 26)
- **Target SDK**: Android 15 (API 35)
- **Compile SDK**: Android 15 (API 35)
- **Kotlin**: 2.0.0
- **Gradle**: 8.7
- **Android Gradle Plugin**: 8.5.0

## Building

To build the Android widget:

```bash
cd android
./gradlew build
```

To create a release APK:

```bash
./gradlew assembleRelease
```

## Installation

1. Build the project using Gradle
2. Install the APK on your Android device (API 26+)
3. Long-press on the home screen
4. Select "Widgets"
5. Find "Misty Weather Widget" and drag it to your home screen

## Widget Configuration

The widget is configured in `weather_widget_info.xml`:

- **Update Period**: 30 minutes (1800000 milliseconds)
- **Minimum Size**: 250dp x 120dp
- **Target Cells**: 4x2
- **Resize Mode**: Horizontal and Vertical
- **Category**: Home Screen

## Permissions

The widget requires the following permissions:

- `INTERNET`: To fetch weather data
- `ACCESS_NETWORK_STATE`: To check network connectivity
- `ACCESS_FINE_LOCATION`: For location-based weather (optional)
- `ACCESS_COARSE_LOCATION`: For approximate location (optional)

## Implementation Details

### WeatherWidgetProvider.kt

The main widget provider class that extends `AppWidgetProvider`. It handles:

- Widget creation and updates
- Click event handling
- Data display management

### Widget Layout

The layout follows Material Design 3 guidelines with:

- Card-based container with rounded corners
- Gradient background
- Clear typography hierarchy
- Responsive spacing and sizing

## Future Enhancements

- Integration with weather API (Open-Meteo)
- Location services integration
- Multiple weather conditions with custom icons
- Configurable widget themes
- Widget configuration activity
- Weather alerts and notifications
- Hourly and daily forecast views

## Notes

- This is the initial widget setup without API integration
- Weather data is currently displayed as placeholders
- API integration will be added in a future update
- The widget follows Android 15 best practices for widgets

## License

MIT License - See the main repository LICENSE file for details
