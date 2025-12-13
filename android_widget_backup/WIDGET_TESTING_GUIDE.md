# Weather Widget Testing Guidelines

## Overview

This document provides comprehensive testing procedures for the Android 15 Weather Widget to ensure quality, performance, and reliability across different devices and scenarios.

## Testing Environment Setup

### Required Tools

- **Android Studio**: Latest stable version
- **Android SDK**: API levels 31-35
- **Test Devices/Emulators**: 
  - Android 12 (API 31)
  - Android 13 (API 33)
  - Android 14 (API 34)
  - Android 15 (API 35)
- **ADB**: For debugging and log inspection
- **Battery Historian**: For battery impact analysis

### Test Devices

Recommended physical devices:
- Pixel 6/7/8 (stock Android)
- Samsung Galaxy S21+ (One UI)
- OnePlus 9/10 (OxygenOS)
- Any device with Android 12+

### Emulator Configuration

```bash
# Create test emulators
avdmanager create avd -n "Android12_Widget_Test" -k "system-images;android-31;google_apis;x86_64"
avdmanager create avd -n "Android15_Widget_Test" -k "system-images;android-35;google_apis;x86_64"
```

## Functional Testing

### 1. Widget Installation

#### Test Case: Add Widget to Home Screen

**Steps:**
1. Long-press home screen
2. Tap "Widgets"
3. Find "Misty Weather Widget"
4. Drag to home screen

**Expected Result:**
- Widget appears in widget list
- Dragging is smooth
- Configuration screen appears automatically
- Widget icon is clear and recognizable

**Pass Criteria:**
- ✓ Widget installs without errors
- ✓ Configuration UI appears
- ✓ Default settings are populated

#### Test Case: Widget Without Configuration

**Steps:**
1. Add widget but click "Cancel" in configuration

**Expected Result:**
- Widget should not be added to home screen
- No error messages or crashes

**Pass Criteria:**
- ✓ Widget gracefully handles cancellation
- ✓ No orphaned widget instances

### 2. Widget Configuration

#### Test Case: Theme Selection

**Steps:**
1. Configure widget
2. Select each theme option (Light, Dark, Auto)
3. Save configuration

**Expected Result:**
- Theme changes preview (if available)
- Widget reflects selected theme after save

**Pass Criteria:**
- ✓ All theme options work
- ✓ Auto theme follows system setting
- ✓ Theme persists after device restart

#### Test Case: Color Scheme Selection

**Steps:**
1. Test each color scheme (Blue, Purple, Green, Orange, Pink)
2. Save and verify widget appearance

**Expected Result:**
- Widget background matches selected color
- Text remains readable on all colors

**Pass Criteria:**
- ✓ All color schemes display correctly
- ✓ Adequate color contrast maintained
- ✓ Transparency works with all schemes

#### Test Case: Temperature Unit Toggle

**Steps:**
1. Set to Celsius
2. Verify temperature display
3. Change to Fahrenheit
4. Verify conversion

**Expected Result:**
- Temperature values convert correctly
- Unit symbol updates (°C / °F)

**Pass Criteria:**
- ✓ Accurate conversion
- ✓ All temperature fields update
- ✓ Setting persists

#### Test Case: Update Frequency

**Steps:**
1. Set update frequency to each option
2. Monitor actual update intervals
3. Verify with WorkManager

**Expected Result:**
- Updates occur at configured intervals
- No more frequent than setting allows

**Pass Criteria:**
- ✓ 15min, 30min, 1hr, 3hr all work
- ✓ WorkManager respects settings
- ✓ Battery-saving works when low

#### Test Case: Display Options Toggle

**Steps:**
1. Toggle each display option on/off
2. Save and verify widget display

**Expected Result:**
- Disabled metrics don't appear
- Layout adjusts gracefully

**Pass Criteria:**
- ✓ All toggles function correctly
- ✓ Layout remains balanced
- ✓ No empty spaces for hidden items

### 3. Widget Updates

#### Test Case: Automatic Updates

**Steps:**
1. Install widget with 15-minute updates
2. Monitor for automatic refreshes
3. Check logs for update events

**Expected Result:**
- Widget updates at specified interval
- Data refreshes correctly

**Pass Criteria:**
- ✓ Updates occur on schedule
- ✓ No failed update attempts
- ✓ Data is current

#### Test Case: Manual Refresh

**Steps:**
1. Tap widget to trigger refresh (if implemented)
2. Verify data updates

**Expected Result:**
- Widget shows loading indicator
- Data refreshes immediately
- Loading indicator disappears

**Pass Criteria:**
- ✓ Manual refresh works
- ✓ No crashes during refresh
- ✓ UI feedback is clear

### 4. Widget Interactions

#### Test Case: Widget Click

**Steps:**
1. Tap widget
2. Verify main app opens

**Expected Result:**
- App launches immediately
- No errors or crashes

**Pass Criteria:**
- ✓ App opens on tap
- ✓ Correct activity launches
- ✓ Intent data is passed (if any)

#### Test Case: Widget Reconfiguration

**Steps:**
1. Long-press widget
2. Tap "Reconfigure"
3. Change settings
4. Save

**Expected Result:**
- Configuration screen appears
- Previous settings are shown
- Changes apply immediately

**Pass Criteria:**
- ✓ Reconfiguration works
- ✓ Settings persist
- ✓ Widget updates after save

### 5. Widget Removal

#### Test Case: Remove Widget

**Steps:**
1. Long-press widget
2. Drag to "Remove" or tap remove icon

**Expected Result:**
- Widget removed cleanly
- No background processes continue
- Preferences are retained (for next install)

**Pass Criteria:**
- ✓ Widget removes successfully
- ✓ WorkManager jobs cancelled (if last widget)
- ✓ No memory leaks

## Size Variant Testing

### Test Each Size

For each widget size (2×2, 4×2, 4×4, 6×4):

**Test Cases:**
1. Add widget at specific size
2. Verify all content fits
3. Check text readability
4. Verify icon sizes
5. Test resize handles

**Pass Criteria:**
- ✓ Content scales appropriately
- ✓ No text cutoff
- ✓ Icons are clear
- ✓ Layout is balanced

### Resize Testing

**Steps:**
1. Add medium widget
2. Long-press and resize to smallest
3. Resize to largest
4. Verify content adapts

**Expected Result:**
- Widget content adjusts to size
- No layout breaks
- Text remains readable

## Performance Testing

### 1. Render Performance

#### Test Case: Widget Load Time

**Measurement:**
- Time from widget placement to full display

**Pass Criteria:**
- ✓ <2 seconds on average
- ✓ <3 seconds on slow devices
- ✓ Loading state visible

#### Test Case: Update Performance

**Measurement:**
- Time to refresh widget data

**Pass Criteria:**
- ✓ <1 second for cached data
- ✓ <3 seconds for network fetch
- ✓ Smooth transition

### 2. Memory Usage

#### Test Case: Memory Footprint

**Measurement:**
```bash
adb shell dumpsys meminfo com.luminlynx.misty
```

**Pass Criteria:**
- ✓ <50MB total memory
- ✓ No memory leaks over time
- ✓ Stable memory usage

#### Test Case: Memory Leaks

**Steps:**
1. Add/remove widget 10 times
2. Monitor memory usage
3. Force GC and check for retained objects

**Pass Criteria:**
- ✓ Memory returns to baseline
- ✓ No retained widget instances

### 3. Battery Impact

#### Test Case: Battery Consumption

**Measurement:**
- Use Battery Historian
- Monitor over 24 hours

**Pass Criteria:**
- ✓ <5% battery drain per day
- ✓ Minimal wake locks
- ✓ Respects battery saver

#### Test Case: Network Usage

**Measurement:**
```bash
adb shell dumpsys netstats detail
```

**Pass Criteria:**
- ✓ <10MB per day data usage
- ✓ Uses caching effectively
- ✓ No unnecessary requests

## Edge Case Testing

### 1. Network Conditions

#### Test Case: No Internet Connection

**Steps:**
1. Enable airplane mode
2. Observe widget behavior

**Expected Result:**
- Shows cached data
- Displays "offline" indicator
- No errors or crashes

**Pass Criteria:**
- ✓ Graceful offline handling
- ✓ Cached data displayed
- ✓ Clear offline status

#### Test Case: Slow Network

**Steps:**
1. Use network throttling (slow 3G)
2. Trigger widget update

**Expected Result:**
- Loading indicator shows
- Update completes eventually
- Timeout after reasonable period

**Pass Criteria:**
- ✓ Handles slow network
- ✓ Timeout prevents hang
- ✓ Falls back to cache

#### Test Case: API Failure

**Steps:**
1. Mock API returning errors
2. Observe widget behavior

**Expected Result:**
- Error message displayed
- Falls back to cached data
- Retry with backoff

**Pass Criteria:**
- ✓ Error handling works
- ✓ Exponential backoff applied
- ✓ No infinite retries

### 2. Location Scenarios

#### Test Case: No Location Permission

**Steps:**
1. Deny location permission
2. Try to add widget

**Expected Result:**
- Clear message about location needed
- Option to set location manually
- No crashes

**Pass Criteria:**
- ✓ Handles denied permission
- ✓ Provides fallback option
- ✓ Clear user messaging

#### Test Case: Location Not Available

**Steps:**
1. Disable GPS and network location
2. Try to get weather

**Expected Result:**
- Error message displayed
- Option to enter location manually

**Pass Criteria:**
- ✓ Graceful error handling
- ✓ Fallback options provided

### 3. System Scenarios

#### Test Case: Low Battery Mode

**Steps:**
1. Enable battery saver
2. Monitor widget updates

**Expected Result:**
- Update frequency reduced
- Widget remains functional
- Updates resume when charging

**Pass Criteria:**
- ✓ Respects battery saver
- ✓ Skips updates appropriately
- ✓ Resumes normal operation

#### Test Case: System Restart

**Steps:**
1. Configure widget
2. Restart device
3. Verify widget state

**Expected Result:**
- Widget appears after restart
- Configuration persisted
- Updates resume

**Pass Criteria:**
- ✓ Survives reboot
- ✓ Settings intact
- ✓ WorkManager reinitialized

#### Test Case: App Update

**Steps:**
1. Install new app version
2. Verify existing widgets

**Expected Result:**
- Widgets continue functioning
- Settings migrated if schema changed
- No data loss

**Pass Criteria:**
- ✓ Backward compatibility
- ✓ Smooth migration
- ✓ No user impact

## Device-Specific Testing

### Test Matrix

| Device/Emulator | Android Version | Launcher | Test Result |
|----------------|-----------------|----------|-------------|
| Pixel 6        | Android 12      | Pixel    | ✓ Pass      |
| Pixel 7        | Android 13      | Pixel    | ✓ Pass      |
| Pixel 8        | Android 14      | Pixel    | ✓ Pass      |
| Pixel 9        | Android 15      | Pixel    | ✓ Pass      |
| Samsung S21    | Android 12      | One UI   | ⧗ Testing   |
| OnePlus 9      | Android 12      | OxygenOS | ⧗ Testing   |

### Launcher Compatibility

Test with popular launchers:
- **Stock Android Launcher**: Pixel devices
- **Samsung One UI Home**: Galaxy devices
- **OnePlus Shelf**: OnePlus devices
- **Nova Launcher**: Third-party
- **Microsoft Launcher**: Third-party

**Pass Criteria:**
- ✓ Widget works on all launchers
- ✓ Resize works correctly
- ✓ Configuration accessible

## Accessibility Testing

### Screen Reader (TalkBack)

**Test Cases:**
1. Enable TalkBack
2. Navigate to widget
3. Tap widget elements

**Pass Criteria:**
- ✓ All elements have descriptions
- ✓ Navigation is logical
- ✓ Actions are announced

### High Contrast Mode

**Test Cases:**
1. Enable high contrast
2. Verify text readability

**Pass Criteria:**
- ✓ Adequate contrast ratios
- ✓ Text remains readable
- ✓ Icons are distinguishable

### Large Text

**Test Cases:**
1. Enable system large text
2. Verify widget layout

**Pass Criteria:**
- ✓ Text scales appropriately
- ✓ No text cutoff
- ✓ Layout remains balanced

## Regression Testing

### Critical Paths

Run these tests before each release:

1. ✓ Widget installation
2. ✓ Configuration save
3. ✓ Data refresh
4. ✓ Theme changes
5. ✓ Temperature unit toggle
6. ✓ Update frequency
7. ✓ Widget removal

### Automated Tests

```kotlin
// Example instrumentation test
@Test
fun widgetInstallation_showsConfiguration() {
    // Add widget
    // Verify configuration activity launches
    // Assert success
}

@Test
fun widgetUpdate_refreshesData() {
    // Trigger update
    // Verify new data displayed
    // Assert success
}
```

## Bug Reporting Template

```
**Title**: Brief description

**Severity**: Critical / High / Medium / Low

**Environment**:
- Device: [e.g., Pixel 7]
- Android Version: [e.g., 13]
- App Version: [e.g., 1.0.0]
- Widget Size: [e.g., 4×2]

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**:
What should happen

**Actual Result**:
What actually happens

**Logs**:
```
adb logcat -s WeatherWidget*
```

**Screenshots**:
[Attach screenshots]

**Frequency**: Always / Sometimes / Rare
```

## Test Sign-Off

### Pre-Release Checklist

- [ ] All functional tests pass
- [ ] Performance benchmarks met
- [ ] Battery impact acceptable
- [ ] No memory leaks detected
- [ ] Accessibility requirements met
- [ ] Works on all target devices
- [ ] Compatible with major launchers
- [ ] Documentation updated
- [ ] Known issues documented
- [ ] Release notes prepared

### Test Lead Approval

- **Tester Name**: _______________
- **Test Date**: _______________
- **Result**: Pass / Fail / Conditional
- **Notes**: _______________

---

**Last Updated**: 2024-01-01  
**Version**: 1.0  
**Next Review**: Before each major release
