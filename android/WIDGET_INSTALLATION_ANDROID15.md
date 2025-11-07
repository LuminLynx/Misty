# Android 15 Widget Installation Guide

## Complete Guide to Installing Misty Weather Widget on Android 15

This guide provides detailed, step-by-step instructions for installing and using the Misty Weather Widget on Android 15 devices.

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Android Device** running Android 8.0 (API 26) or higher (tested on Android 14 and 15)
- ✅ **Android Studio** (2023.1.1 or later) OR ability to install APK files
- ✅ **USB Cable** for device connection (if installing from computer)
- ✅ **Developer Options** enabled on your Android device

---

## Part 1: Building the Widget APK

### Option A: Using Android Studio (Recommended)

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK Platform 35 (Android 15)

2. **Open the Project**
   ```
   - Launch Android Studio
   - Click "Open" 
   - Navigate to and select the `android/` folder
   - Wait for Gradle sync to complete
   ```

3. **Configure SDK Location** (if needed)
   - Create `android/local.properties` file with:
   ```properties
   sdk.dir=/path/to/your/android/sdk
   ```
   - Common SDK locations:
     - **macOS**: `/Users/[username]/Library/Android/sdk`
     - **Linux**: `/home/[username]/Android/sdk`
     - **Windows**: `C:\Users\[username]\AppData\Local\Android\sdk`

4. **Build the APK**
   - In Android Studio: **Build → Make Project** (Ctrl+F9)
   - Or from Terminal in Android Studio:
   ```bash
   ./gradlew assembleDebug
   ```

5. **Locate the APK**
   - Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `android/app/build/outputs/apk/release/app-release.apk`

### Option B: Using Command Line

1. **Navigate to android directory**
   ```bash
   cd android
   ```

2. **Make gradlew executable** (Linux/macOS only)
   ```bash
   chmod +x gradlew
   ```

3. **Build the APK**
   ```bash
   # For debug build
   ./gradlew assembleDebug
   
   # For release build
   ./gradlew assembleRelease
   ```

4. **Find the APK**
   - Located in: `app/build/outputs/apk/debug/app-debug.apk`

---

## Part 2: Installing the Widget on Android 15

### Method 1: Direct Installation via USB (Recommended)

1. **Enable Developer Options**
   - Go to **Settings → About phone**
   - Tap **Build number** 7 times
   - Enter your PIN/password if prompted
   - You'll see "You are now a developer!"

2. **Enable USB Debugging**
   - Go to **Settings → System → Developer options**
   - Enable **USB debugging**
   - Enable **Install via USB** (if available)

3. **Connect Your Device**
   - Connect Android device to computer via USB
   - On device, tap **Allow** when asked to allow USB debugging
   - Check **Always allow from this computer** (optional)

4. **Install the APK**
   
   **From Android Studio:**
   - Click the "Run" button (green play icon)
   - Select your connected device
   - The app will install automatically
   
   **From Command Line:**
   ```bash
   # Using gradlew
   ./gradlew installDebug
   
   # Or using adb directly
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

5. **Verify Installation**
   - Check your app drawer for "Misty Weather Widget" icon
   - If installed successfully, proceed to Part 3

### Method 2: Manual APK Installation

1. **Transfer APK to Device**
   - Copy `app-debug.apk` to your device via:
     - USB file transfer
     - Cloud storage (Google Drive, Dropbox)
     - Email attachment
     - Direct download

2. **Enable Unknown Sources**
   - Go to **Settings → Security**
   - Enable **Install unknown apps**
   - Select the app you'll use to install (Files, Chrome, etc.)
   - Enable **Allow from this source**

3. **Install the APK**
   - Open Files app or download location
   - Tap on `app-debug.apk`
   - Tap **Install**
   - Tap **Open** when installation completes

---

## Part 3: Adding the Widget to Your Home Screen

### Step-by-Step Widget Installation

1. **Open Widget Picker**
   - **Long-press** on an empty area of your home screen
   - Tap **Widgets** from the bottom menu
   
   *Alternative methods:*
   - Pinch inward on home screen, then tap **Widgets**
   - Open app drawer, tap **Widgets** tab

2. **Find Misty Weather Widget**
   - Scroll through the widget list
   - Look for **"Misty Weather Widget"** with a blue cloud icon
   - You should see the widget preview with weather information

3. **Add Widget to Home Screen**
   - **Tap and hold** the Misty Weather Widget
   - **Drag** it to your desired location on the home screen
   - **Release** to place the widget
   - The widget will appear with placeholder data

4. **Resize the Widget** (Optional)
   - **Long-press** the widget
   - **Drag** the resize handles to adjust size
   - Minimum size: 4x2 cells (250dp x 120dp)
   - Maximum size: Configurable up to full screen

5. **Position the Widget**
   - **Drag** the widget to move it
   - **Place** it where you want on any home screen page

---

## Part 4: Using the Widget

### Widget Features

- **Live Weather Display**: Shows current temperature, condition, and location
- **Additional Metrics**: Humidity, wind speed, "feels like" temperature
- **Auto-Refresh**: Updates every 30 minutes automatically
- **Manual Refresh**: Tap anywhere on the widget to force refresh
- **Last Update Time**: Shows when data was last refreshed

### Current Behavior (Initial Version)

⚠️ **Note**: This is the initial widget implementation with placeholder data:
- Widget shows default/placeholder values
- Weather API integration is planned for future updates
- Location services will be added in next version

---

## Troubleshooting

### Widget Not Appearing in Widget Picker

**Problem**: Misty Weather Widget doesn't show in the widgets list.

**Solutions**:

1. **Verify App Installation**
   ```bash
   adb shell pm list packages | grep misty
   ```
   - Should show: `package:com.luminlynx.misty`
   - If not listed, reinstall the app

2. **Check Android Version**
   - Widget requires Android 8.0 (API 26) or higher
   - Verify: Settings → About phone → Android version
   - If lower than 8.0, widget won't work

3. **Clear Launcher Cache**
   - Go to **Settings → Apps → Default apps → Home app**
   - Tap your launcher (e.g., Pixel Launcher)
   - Tap **Storage & cache → Clear cache**
   - Restart device

4. **Force Restart**
   - **Hold Power button** → **Restart**
   - Wait for device to reboot
   - Check widget picker again

5. **Reinstall the App**
   - Uninstall: Settings → Apps → Misty Weather Widget → Uninstall
   - Reinstall using steps from Part 2
   - Check widget picker

### Widget Shows But Won't Add to Home Screen

**Problem**: Widget appears in picker but won't place on home screen.

**Solutions**:

1. **Free Up Home Screen Space**
   - Ensure you have at least 4x2 cells of empty space
   - Remove or move other widgets/icons if needed

2. **Check Home Screen Settings**
   - Some launchers limit widget placement
   - Check launcher settings for widget restrictions

3. **Try Different Launcher**
   - Install a different launcher (Nova, Lawnchair, etc.)
   - Set as default launcher
   - Try adding widget again

### Widget Not Updating

**Problem**: Widget shows old data or "Tap to refresh".

**Solutions**:

1. **Manual Refresh**
   - Tap anywhere on the widget
   - Wait a few seconds for update

2. **Check Permissions**
   - Settings → Apps → Misty Weather Widget → Permissions
   - Enable: Location, Network (if listed)

3. **Battery Optimization**
   - Settings → Apps → Misty Weather Widget → Battery
   - Select **Unrestricted** or **Optimized**
   - Disable "Pause app activity if unused"

4. **Re-add Widget**
   - Remove widget from home screen
   - Add it again from widget picker

### Build Errors

**Problem**: Gradle build fails or shows errors.

**Solutions**:

1. **Sync Gradle**
   - In Android Studio: **File → Sync Project with Gradle Files**

2. **Clean and Rebuild**
   ```bash
   ./gradlew clean
   ./gradlew build
   ```

3. **Check SDK Installation**
   - In Android Studio: **Tools → SDK Manager**
   - Ensure Android SDK Platform 35 is installed
   - Install if missing

4. **Invalidate Caches**
   - **File → Invalidate Caches → Invalidate and Restart**

---

## Device-Specific Notes

### Android 15 (Tested)

- ✅ Fully compatible
- ✅ Widget appears in picker
- ✅ All features working
- ✅ Resizing and placement work correctly

### Android 14 (Tested)

- ✅ Fully compatible
- ✅ Widget appears in picker
- ✅ All features working

### Android 5 and Earlier

- ❌ **Not supported**
- Minimum required version: Android 8.0 (API 26)

---

## Debugging

### Enable Verbose Logging

1. **Connect device via USB**
2. **Run logcat**:
   ```bash
   adb logcat | grep WeatherWidget
   ```
3. **Add widget** and check for errors in logs

### Check Widget Status

```bash
# List all widgets
adb shell dumpsys activity widgets

# Check specific package
adb shell dumpsys activity widgets | grep misty
```

### Verify APK Signature

```bash
# Check APK info
aapt dump badging app/build/outputs/apk/debug/app-debug.apk | grep package

# Should show:
# package: name='com.luminlynx.misty'
```

---

## Advanced Configuration

### Change Update Frequency

Edit `android/app/src/main/res/xml/weather_widget_info.xml`:

```xml
<!-- Update every 30 minutes (minimum allowed) -->
<appwidget-provider
    android:updatePeriodMillis="1800000"
    ...>
```

Note: Android enforces minimum 30-minute update intervals for battery optimization.

### Customize Widget Appearance

Edit `android/app/src/main/res/layout/weather_widget_layout.xml` to modify:
- Text sizes
- Colors
- Layout structure
- Spacing and padding

Edit `android/app/src/main/res/drawable/widget_background.xml` to change:
- Background gradient colors
- Corner radius
- Border styling

---

## FAQ

**Q: Why isn't real weather data showing?**
A: This is the initial widget version with placeholder data. Weather API integration is coming in the next update.

**Q: Can I add multiple widgets?**
A: Yes! Add as many instances as you want, each updates independently.

**Q: Does the widget drain battery?**
A: Minimal impact. Updates only every 30 minutes (Android's minimum for widgets).

**Q: Can I use the widget on older Android versions?**
A: No, minimum requirement is Android 8.0 (API 26).

**Q: Why does it need location permission?**
A: For future weather API integration to show weather for your current location.

---

## Next Steps

After successfully installing the widget:

1. ✅ Widget is displaying on home screen
2. ⏳ Weather API integration (planned)
3. ⏳ Real location services (planned)
4. ⏳ Dynamic weather icons (planned)
5. ⏳ Widget configuration options (planned)

---

## Support

If you encounter issues not covered in this guide:

1. **Check Logcat Output**: Look for error messages
2. **Review Android Studio Build Output**: Check for build errors
3. **Try on Different Device**: Test if it's device-specific
4. **Verify SDK Version**: Ensure Android 15 SDK is installed
5. **Open GitHub Issue**: Report the problem with logs and device info

---

## Technical Specifications

- **Package Name**: `com.luminlynx.misty`
- **Minimum SDK**: 26 (Android 8.0)
- **Target SDK**: 35 (Android 15)
- **Widget Class**: `WeatherWidgetProvider`
- **Update Interval**: 1800000ms (30 minutes)
- **Minimum Size**: 250dp × 120dp (4×2 cells)
- **Supported Categories**: Home screen widgets

---

**Last Updated**: November 2024  
**Version**: 1.0  
**Status**: Initial Release with Placeholder Data
