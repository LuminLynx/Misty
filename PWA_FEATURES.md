# PWA Features Enhancement

This document outlines the Progressive Web App (PWA) enhancements added to the Weather Dashboard.

## Features Implemented

### 1. Custom Install Button in UI
- The app already had an `InstallPrompt` component that displays when the app is installable
- Shows a beautiful card with install button at the bottom of the screen
- Supports multiple languages (English and Portuguese)
- Auto-dismissible and respects user choice

### 2. App Screenshots in Manifest
- Added three screenshots to showcase the app in app stores:
  - Two narrow screenshots (540x720) for mobile view
  - One wide screenshot (1280x720) for desktop view
- Screenshots are properly labeled and categorized by form factor

### 3. Update Notifications
- New `UpdateNotification` component that detects when a new version is available
- Service worker sends a message when an update is ready
- User can click "Update Now" to reload and activate the new version
- Polls for updates every 60 seconds
- Shows a toast notification when update is detected

### 4. More Icon Sizes for iOS
Added the following iOS-specific icon sizes:
- 120x120 (iPhone)
- 152x152 (iPad)
- 167x167 (iPad Pro)
- 180x180 (iPhone Plus/Pro Max)

These icons are:
- Generated from the source 512x512 icon
- Referenced in index.html with proper apple-touch-icon links
- Included in the manifest.json

### 5. Enhanced Offline Support
The service worker now features:
- **Runtime caching**: API responses are cached for offline use
- **Network-first strategy**: Always tries to get fresh data when online
- **Fallback to cache**: Returns cached data when offline
- **Proper error handling**: Returns meaningful errors when data is unavailable
- **Two-tier caching**: Static assets cache and runtime API cache
- **Cache versioning**: Automatic cleanup of old caches on update

### 6. App Shortcuts
Added four app shortcuts accessible from the home screen icon:
1. **Current Weather** - Opens to current weather view
2. **5-Day Forecast** - Opens to forecast view
3. **Compare Locations** - Opens to comparison view
4. **AI Insights** - Opens to AI insights view

Shortcuts include:
- Descriptive names and icons
- URL parameters for direct navigation
- Proper icon references

### 7. Share Target API
The app can now receive shared content from other apps:
- Accepts title, text, and URL parameters
- Shows a toast notification when content is shared
- Can extract location information from shared text
- Accessible via the system share menu

## Technical Implementation

### Service Worker Updates
- Cache version: `weather-dashboard-v2`
- Runtime cache: `weather-runtime-v2`
- Enhanced fetch event handling with proper offline support
- Message-based communication for updates

### URL Parameter Handling
The app handles the following URL parameters:
- `?view=current` - Show current weather
- `?view=forecast` - Show forecast
- `?view=compare` - Show comparison view
- `?view=ai` - Show AI insights
- `?title=...&text=...&url=...` - Shared content

### Component Architecture
- `UpdateNotification.tsx` - Handles update detection and UI
- `InstallPrompt.tsx` - Handles PWA installation (existing)
- Enhanced `App.tsx` with URL parameter handling

## Testing

To test these features:

1. **Install the app**:
   - Open in Chrome/Edge on mobile or desktop
   - Click the install button when prompted
   - App should install with proper icon

2. **Test shortcuts**:
   - Long-press the home screen icon
   - Verify all four shortcuts appear
   - Click each to verify navigation

3. **Test offline mode**:
   - Install the app
   - Turn off network
   - Verify app still loads with cached data
   - Verify API responses use cached data

4. **Test updates**:
   - Make a change to the service worker version
   - Reload the app
   - Verify update notification appears
   - Click "Update Now" to activate

5. **Test share target**:
   - Open another app with share functionality
   - Share content to Weather Dashboard
   - Verify app opens with shared content toast

## Browser Support

These features are supported in:
- Chrome/Edge 89+
- Safari 15.4+ (iOS and macOS)
- Firefox 97+ (partial support)
- Opera 75+

## Scripts

Two utility scripts are included:
- `scripts/generate-icons.mjs` - Generates iOS icons from source
- `scripts/create-screenshots.mjs` - Creates placeholder screenshots

To regenerate assets:
```bash
node scripts/generate-icons.mjs
node scripts/create-screenshots.mjs
```
