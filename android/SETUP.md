# Android Widget Setup Instructions

## Overview

This document provides instructions for building and testing the Misty Weather Widget for Android 15.

## Prerequisites

Before building the widget, ensure you have:

1. **Android Studio** (2023.1.1 or later recommended)
2. **Android SDK** with API 35 (Android 15)
3. **Java Development Kit (JDK)** 11 or later
4. **Gradle** 8.7 (will be installed automatically via wrapper)

## Project Setup

### 1. Open in Android Studio

1. Launch Android Studio
2. Click "Open" and navigate to the `android/` folder
3. Android Studio will automatically detect the Gradle project
4. Wait for Gradle sync to complete

### 2. Configure SDK Location

If not automatically detected, create `local.properties`:

```properties
sdk.dir=/path/to/your/android/sdk
```

Example paths:
- **macOS/Linux**: `/Users/username/Library/Android/sdk`
- **Windows**: `C:\\Users\\username\\AppData\\Local\\Android\\sdk`

## Building the Widget

### Using Android Studio

1. **Build the project**:
   - Menu: Build → Make Project
   - Shortcut: `Ctrl+F9` (Windows/Linux) or `Cmd+F9` (macOS)

2. **Run on device/emulator**:
   - Connect an Android device or start an emulator
   - Click the "Run" button or press `Shift+F10`
   - The app will install on the device

### Using Command Line

```bash
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug
```

The APK will be located at:
- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release.apk`

## Adding the Widget to Home Screen

After installing the app:

1. **Long-press** on your home screen
2. Tap **"Widgets"** from the menu
3. Scroll to find **"Misty Weather Widget"**
4. **Drag and drop** the widget to your desired location
5. The widget will appear with placeholder data

## Widget Features

### Current Implementation

✅ **Card-style design** with gradient background
✅ **Placeholder data display** including:
   - Location name
   - Temperature
   - Weather condition
   - Feels-like temperature
   - Humidity percentage
   - Wind speed
✅ **Auto-refresh** every 30 minutes
✅ **Tap to refresh** functionality

### Future Enhancements

⏳ Weather API integration (Open-Meteo)
⏳ Real location services
⏳ Dynamic weather icons
⏳ User configuration options
⏳ Multiple widget sizes

## File Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/luminlynx/misty/widget/
│   │   │   └── WeatherWidgetProvider.kt    ← Main widget logic
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   └── weather_widget_layout.xml ← Widget UI
│   │   │   ├── xml/
│   │   │   │   └── weather_widget_info.xml   ← Widget metadata
│   │   │   ├── drawable/                      ← Icons & backgrounds
│   │   │   └── values/                        ← Strings & styles
│   │   └── AndroidManifest.xml               ← App configuration
│   └── build.gradle.kts                       ← App dependencies
├── build.gradle.kts                           ← Project config
└── settings.gradle.kts                        ← Gradle settings
```

## Customization

### Changing Widget Size

Edit `res/xml/weather_widget_info.xml`:

```xml
<appwidget-provider
    android:minWidth="250dp"
    android:minHeight="120dp"
    android:targetCellWidth="4"
    android:targetCellHeight="2"
    ...>
</appwidget-provider>
```

### Modifying Widget Appearance

Edit `res/layout/weather_widget_layout.xml` to:
- Change text sizes
- Adjust spacing and padding
- Modify layout structure

Edit `res/drawable/widget_background.xml` to:
- Change gradient colors
- Adjust corner radius
- Modify border styling

### Update Frequency

Edit `res/xml/weather_widget_info.xml`:

```xml
<!-- Update every 30 minutes (1800000 ms) -->
<appwidget-provider
    android:updatePeriodMillis="1800000"
    ...>
</appwidget-provider>
```

Note: Minimum update period is 30 minutes (Android limitation)

## Troubleshooting

### Gradle Sync Failed

1. Check internet connection (Gradle downloads dependencies)
2. Verify `local.properties` has correct SDK path
3. Try: File → Invalidate Caches and Restart

### Widget Not Appearing

1. Ensure app is installed successfully
2. Check that the device runs Android 8.0+ (API 26)
3. Try rebooting the device
4. Check Logcat for error messages

### Build Errors

1. Ensure Android SDK Platform 35 is installed
2. Verify Kotlin plugin is up to date
3. Clean and rebuild: Build → Clean Project → Rebuild Project

## Testing

### On Emulator

1. Create an AVD (Android Virtual Device) with API 35
2. Launch the emulator
3. Install and test the widget

### On Physical Device

1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect device via USB
4. Install and test the widget

## Next Steps

After the basic widget is working:

1. **Integrate Weather API**: Connect to Open-Meteo API
2. **Add Location Services**: Request and use device location
3. **Implement Data Refresh**: Periodic weather data updates
4. **Add Weather Icons**: Dynamic icons based on conditions
5. **Configuration Activity**: Allow users to customize widget

## Resources

- [Android Widget Documentation](https://developer.android.com/develop/ui/views/appwidgets)
- [Material Design 3](https://m3.material.io/)
- [Kotlin for Android](https://developer.android.com/kotlin)
- [Open-Meteo API](https://open-meteo.com/en/docs)

## Support

For issues or questions:
- Open an issue on the GitHub repository
- Check the main README.md for project information
- Review Android Studio's Logcat for error messages
