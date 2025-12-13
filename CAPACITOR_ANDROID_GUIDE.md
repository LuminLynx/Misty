# Capacitor Android 15 Integration Guide

## Overview

This document describes how the Misty weather dashboard web application has been converted to a native Android 15 app using Capacitor 7.x framework.

## Architecture

### Hybrid App Structure

```
Misty (Native Android App)
├── Web Layer (React/Vite)
│   └── Runs in Capacitor WebView
├── Native Layer (Android/Kotlin)
│   ├── MainActivity.java (Capacitor Bridge)
│   └── Weather Widget (Jetpack Glance)
└── Capacitor Bridge
    └── Provides native APIs to web layer
```

### Key Components

1. **Web Application**: React-based weather dashboard (unchanged functionality)
2. **Capacitor Bridge**: Translates web APIs to native Android APIs
3. **MainActivity**: Entry point that loads the web app in a WebView
4. **Weather Widget**: Native Android home screen widget (standalone)

## Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Android Studio (for building/testing)
- Java 11 or later
- Android SDK API 35 (Android 15)

### Installation

```bash
# Install Capacitor dependencies
npm install @capacitor/core@7.4.4 @capacitor/cli@7.4.4 @capacitor/android@7.4.4

# Initialize Capacitor (already done)
npx cap init "Misty" "com.luminlynx.misty" --web-dir=dist

# Add Android platform (already done)
npx cap add android
```

## Build Process

### Web App Build

```bash
# Build for Capacitor (uses base path '/')
CAPACITOR=true npm run build

# Or use the convenience script
npm run build:capacitor
```

### Sync to Android

```bash
# Copy web assets and sync plugins
npx cap sync android

# Or just copy assets
npx cap copy android
```

### Android Build

```bash
# Open in Android Studio
npm run android:open

# Or build from command line
cd android
./gradlew assembleDebug
```

The APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Configuration

### Capacitor Config (`capacitor.config.ts`)

```typescript
const config: CapacitorConfig = {
  appId: 'com.luminlynx.misty',
  appName: 'Misty',
  webDir: 'dist',
  server: {
    androidScheme: 'https'  // Use HTTPS scheme for better compatibility
  }
};
```

### Build Configuration

#### Target SDK Versions

- **minSdkVersion**: 23 (Android 6.0) - Capacitor requirement
- **compileSdkVersion**: 35 (Android 15)
- **targetSdkVersion**: 35 (Android 15)

Note: The weather widget requires minSdk 31 (Android 12) for Jetpack Glance support.

#### Key Files

- `android/variables.gradle` - SDK versions and dependencies
- `android/build.gradle` - Root project configuration
- `android/app/build.gradle` - App module configuration

### Conditional Base Path

The web app uses different base paths depending on the deployment target:

```typescript
// vite.config.ts
const base = process.env.CAPACITOR ? '/' : '/Misty/';
```

- **Capacitor**: `/` (served from app assets)
- **GitHub Pages**: `/Misty/` (deployed to subdirectory)

## Permissions

### AndroidManifest.xml

```xml
<!-- Internet for weather API -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Location for weather data -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

<!-- Widget background updates -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### Runtime Permissions

The app needs to request location permissions at runtime (Android 6+):

```javascript
// In web layer, use Capacitor Geolocation plugin
import { Geolocation } from '@capacitor/geolocation';

const position = await Geolocation.getCurrentPosition();
```

## Features

### What Works in Native App

✅ **Full web app functionality**
- Real-time weather data
- Location search and geolocation
- 5-day forecast
- Favorites and recent locations
- AI insights and chat
- Temperature unit switching
- Theme switching (dark/light)
- Multi-language support

✅ **Native enhancements**
- Installed as native app (no browser chrome)
- App icon on home screen
- Splash screen
- Better performance (no service worker overhead)
- Native share integration
- Native back button support

✅ **Weather widget**
- Standalone home screen widget
- Independent from main app
- Background updates via WorkManager
- Customizable appearance

### Differences from Web App

#### Service Worker

Service workers are **disabled** in Capacitor (native app doesn't need them):

```typescript
// src/main.tsx
if ('serviceWorker' in navigator && !(window as any).Capacitor) {
  // Only register in web context
}
```

#### PWA Install Prompts

PWA installation UI is hidden in native app (already installed).

#### URL Routing

The app uses file:// or https:// (capacitor) scheme instead of HTTP(S):

```
Web: https://luminlynx.github.io/Misty/
Capacitor: capacitor://localhost/ or https://localhost/
```

## Development Workflow

### 1. Make Web Changes

```bash
# Start dev server
npm run dev

# Test in browser at http://localhost:5173
```

### 2. Build for Capacitor

```bash
# Build with Capacitor flag
npm run build:capacitor
```

### 3. Sync to Android

```bash
# Copy assets and sync plugins
npm run android:sync
```

### 4. Test in Android

```bash
# Open Android Studio
npm run android:open

# Or run directly
cd android && ./gradlew installDebug
```

### Live Reload (Optional)

You can configure Capacitor to load from dev server:

```typescript
// capacitor.config.ts (dev only)
const config: CapacitorConfig = {
  // ...
  server: {
    url: 'http://192.168.1.100:5173',  // Your dev machine IP
    cleartext: true
  }
};
```

Then run `npx cap sync android` and launch the app.

## Troubleshooting

### Build Issues

**Problem**: `Plugin not found` errors
```bash
# Solution: Sync Capacitor
npx cap sync android
```

**Problem**: Gradle build fails
```bash
# Solution: Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
```

**Problem**: Web assets not updating
```bash
# Solution: Force copy
npm run build:capacitor
npx cap copy android --inline
```

### Runtime Issues

**Problem**: White screen on launch
- Check browser console in Chrome DevTools (inspect WebView)
- Verify web assets copied: `android/app/src/main/assets/public/`
- Check for JavaScript errors in capacitor logs

**Problem**: API calls failing
- Ensure INTERNET permission in manifest
- Check CORS headers (Capacitor uses HTTPS scheme)
- Verify network security config allows cleartext (if needed)

**Problem**: Location not working
- Request runtime permissions
- Check location services enabled
- Verify FINE_LOCATION permission granted

### Debug Tools

```bash
# View app logs
adb logcat | grep Capacitor

# View all logs
adb logcat -s chromium:I *:E

# Inspect WebView
chrome://inspect in Chrome browser
```

## Integration with Weather Widget

The weather widget is **independent** from the main Capacitor app:

- Widget uses native Kotlin/Jetpack Compose
- Main app uses web tech (React) in WebView
- Both can coexist on same device
- Widget doesn't depend on main app running

### Future Integration Ideas

1. **Deep linking**: Widget could open specific views in main app
2. **Shared preferences**: Sync settings between widget and app
3. **Shared location**: Main app provides location to widget
4. **Widget from app**: Add widget from app settings

## Performance

### App Size

- Web bundle: ~600KB (gzipped)
- Native code: ~2MB
- Total APK: ~5-8MB (debug), ~3-5MB (release)

### Startup Time

- Cold start: ~1-2 seconds
- Warm start: ~500ms
- WebView init: ~300ms

### Memory Usage

- Base app: ~50MB
- With web content loaded: ~100-150MB
- Widget (separate process): ~30MB

## Testing

### Manual Testing

1. **Install APK**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Test features**
   - Location search
   - Geolocation
   - Weather data loading
   - Theme switching
   - Navigation

3. **Test widget separately**
   - Long-press home screen
   - Add Misty Weather Widget
   - Configure settings
   - Verify updates

### Automated Testing

```bash
# Unit tests
cd android && ./gradlew test

# Instrumented tests (requires emulator/device)
cd android && ./gradlew connectedAndroidTest
```

## Deployment

### Debug Build

```bash
cd android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Release Build

1. **Create keystore**
   ```bash
   keytool -genkey -v -keystore misty-release.keystore \
     -alias misty -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing in `app/build.gradle`**
   ```groovy
   android {
       signingConfigs {
           release {
               storeFile file('misty-release.keystore')
               storePassword 'your-password'
               keyAlias 'misty'
               keyPassword 'your-password'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               // ...
           }
       }
   }
   ```

3. **Build release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Build AAB (for Play Store)**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

### Play Store Submission

1. Generate signed AAB
2. Create store listing in Google Play Console
3. Upload AAB
4. Complete content rating questionnaire
5. Set pricing and distribution
6. Submit for review

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android 15 Features](https://developer.android.com/about/versions/15)
- [Jetpack Glance](https://developer.android.com/jetpack/compose/glance)
- [Capacitor Android Configuration](https://capacitorjs.com/docs/android/configuration)

## License

This project is licensed under the MIT License.
