# PWA Installation & Troubleshooting Guide

## Accessing the Weather Dashboard PWA

### Correct URL
**Important:** The URL is case-sensitive!

✅ **Correct:** `https://luminlynx.github.io/Misty/`  
❌ **Incorrect:** `https://luminlynx.github.io/misty/` (will return 404 error)

Always use the capital 'M' in 'Misty' when accessing the application.

## Installation Instructions

### On Desktop (Chrome/Edge)

1. Open `https://luminlynx.github.io/Misty/` in Chrome or Edge
2. Look for the install icon in the address bar (⊕ or install icon)
3. Click the icon and select "Install"
4. The app will be installed and can be launched from your applications menu

**Alternative method:**
1. Click the three-dot menu (⋮) in the browser
2. Select "Install Misty" or "Install app"
3. Confirm the installation

### On Android

1. Open `https://luminlynx.github.io/Misty/` in Chrome
2. Tap the three-dot menu (⋮)
3. Select "Install app" or "Add to Home screen"
4. Follow the prompts to install
5. The app icon will appear on your home screen

### On iOS (Safari)

1. Open `https://luminlynx.github.io/Misty/` in Safari
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Enter a name (default: "Misty") and tap "Add"
5. The app icon will appear on your home screen

**Note:** iOS PWAs have some limitations compared to Android and desktop. The install prompt UI component may not appear, but you can manually add to home screen using the method above.

## Updating the App

### When an Update is Available

When a new version of the app is available, you'll see an update notification at the bottom of the screen:

1. The notification will say "Update Available"
2. Click the "Update Now" button
3. The app will reload with the new version

### Manual Update Check

The app automatically checks for updates every 60 seconds when open. You can also:

1. Close and reopen the app
2. Refresh the page (this may clear your cached data)
3. The service worker will detect and install updates automatically

### If Update Button Doesn't Work

If you click "Update Now" but nothing happens:

1. Close the app completely
2. Reopen the app
3. The new version should load automatically

**Force update (last resort):**
1. Open browser settings
2. Clear site data for `luminlynx.github.io`
3. Revisit the app URL
4. The latest version will be downloaded

## Troubleshooting Common Issues

### Issue: 404 Error When Accessing the App

**Cause:** Using incorrect URL or case-sensitive path

**Solutions:**
1. Check that you're using the correct URL: `https://luminlynx.github.io/Misty/` (capital M)
2. Clear your browser cache
3. Try accessing the URL in an incognito/private window
4. Ensure you have an internet connection

### Issue: Install Button Not Showing

**Possible Causes:**
- App is already installed
- Browser doesn't support PWA installation
- Accessing from iOS Safari (use manual "Add to Home Screen" instead)
- Installation criteria not met (must be HTTPS, have manifest, have service worker)

**Solutions:**
1. Check if the app is already installed on your device
2. If on iOS, use the Share → "Add to Home Screen" method
3. Try a different browser (Chrome or Edge recommended)
4. Check that you're accessing via HTTPS (not HTTP)

### Issue: Update Notification Appears but App Doesn't Update

**Cause:** Service worker update flow interruption

**Solutions:**
1. Click "Update Now" and wait a few seconds
2. If nothing happens, close all tabs with the app open
3. Reopen the app in a new tab
4. Clear browser cache if the issue persists

### Issue: App Works When Logged into GitHub but Not When Logged Out

**Cause:** Repository might be set to private

**Solutions:**
1. Check with the repository owner if it's set to public
2. The repository settings should have GitHub Pages enabled and set to public
3. Repository owner needs to go to Settings → Pages and ensure the site is published

### Issue: Offline Functionality Not Working

**Cause:** Service worker not registered or cache not populated

**Solutions:**
1. Ensure you've loaded the app at least once while online
2. Check browser console for service worker registration errors
3. Check that service workers are enabled in your browser
4. Try uninstalling and reinstalling the app

## Technical Details

### Service Worker
- The app uses a service worker for offline functionality and caching
- Service worker URL: `https://luminlynx.github.io/Misty/sw.js`
- Cache name: `weather-dashboard-v2`
- Runtime cache: `weather-runtime-v2`

### Caching Strategy
- Static assets: Cache-first (icons, screenshots, manifest)
- API calls: Network-first with fallback to cache
- Weather data: Cached for offline use

### Browser Requirements
- Modern browser with service worker support
- JavaScript enabled
- HTTPS connection
- Minimum 10MB storage space

## Support

If you continue to experience issues after trying these solutions:

1. Check the browser console (F12) for error messages
2. Take a screenshot of any error messages
3. Report the issue on the GitHub repository
4. Include details about:
   - Browser name and version
   - Operating system
   - Device type (desktop/mobile)
   - Exact steps to reproduce the issue
   - Any error messages

## Privacy & Permissions

The app may request the following permissions:

- **Location:** To provide weather data for your current location (optional)
- **Storage:** To save your preferences and favorite locations
- **Notifications:** Future feature for weather alerts (not yet implemented)

All data is stored locally on your device. No personal information is transmitted to external servers except for weather API requests to Open-Meteo.
