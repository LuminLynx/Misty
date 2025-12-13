# Android CI/CD Setup Guide

## Overview

This document describes the CI/CD pipeline for building and testing the Misty Android app across multiple devices and API levels.

## CI/CD Pipeline

The Android CI/CD pipeline is defined in `.github/workflows/android-ci.yml` and includes:

### Build Jobs

1. **Build Debug APK** (`build`)
   - Runs on all pushes and pull requests
   - Builds debug APK without signing
   - Uploads APK as artifact (retained for 30 days)

2. **Build Release APK** (`build-release`)
   - Runs only on pushes to `main` branch
   - Builds signed release APK (if keystore configured)
   - Uploads APK as artifact (retained for 90 days)

### Test Jobs

3. **Unit Tests** (`test`)
   - Runs Kotlin/Java unit tests
   - Uploads test results

4. **Instrumented Tests** (`instrumented-test`)
   - Tests on Android emulators
   - Test matrix: API 23, 31, 35
   - Tests core functionality, widgets, and UI

## Test Coverage

### API Level Testing

The pipeline tests on three key API levels:

- **API 35 (Android 15)** - Latest Android version with all features
- **API 31 (Android 12)** - Widget minimum, tests Glance widgets
- **API 23 (Android 6.0)** - App minimum, ensures backward compatibility

### Test Suites

#### 1. Core Functionality Tests (`MainActivityTest.kt`)
- App launches correctly
- Required permissions are granted
- App label and icon exist
- Package name verification

#### 2. Widget Tests (`WeatherWidgetTest.kt`)
- Widget provider exists
- Widget works on API 31+
- Configuration activity setup
- Update period and resize modes
- Backward compatibility (API 23+)

#### 3. Screen Compatibility Tests (`ScreenCompatibilityTest.kt`)
- Display metrics validation
- Screen density support (ldpi to xxxhdpi)
- Portrait and landscape orientation
- Phone and tablet form factors
- Small to xlarge screen sizes
- Configuration change handling

#### 4. Performance Tests (`PerformanceTest.kt`)
- Activity launch time
- Memory usage monitoring
- Multiple launch stability
- Configuration recreation
- Low memory scenarios
- Cold start performance

## Setting Up Release Builds

To enable signed release builds, configure the following GitHub Secrets:

### Required Secrets

1. **ANDROID_KEYSTORE_BASE64**
   - Base64-encoded keystore file
   - Generate with: `base64 -i your-keystore.jks | pbcopy`

2. **ANDROID_KEYSTORE_PASSWORD**
   - Password for the keystore file

3. **ANDROID_KEY_ALIAS**
   - Alias name for the signing key

4. **ANDROID_KEY_PASSWORD**
   - Password for the signing key

### Creating a Keystore

```bash
# Generate a new keystore
keytool -genkey -v -keystore release.keystore -alias misty-key -keyalg RSA -keysize 2048 -validity 10000

# Convert to base64 for GitHub Secret
base64 -i release.keystore > release.keystore.base64
```

### Adding Secrets to GitHub

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with its respective value

## Local Testing

### Build Debug APK

```bash
# Build web assets
npm run build:capacitor

# Build Android APK
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Run Unit Tests

```bash
cd android
./gradlew testDebugUnitTest
```

### Run Instrumented Tests

Requires an Android emulator or connected device:

```bash
cd android
./gradlew connectedDebugAndroidTest
```

## Emulator Configuration

The CI uses the following emulator configuration:

- **Profile**: Pixel 6
- **Target**: google_apis (includes Play Services)
- **Options**: No animations, no audio, software GPU

### Testing on Different Devices

To test locally on different configurations:

```bash
# List available system images
sdkmanager --list | grep system-images

# Create emulator for API 23 (Android 6.0)
avdmanager create avd -n test-api23 -k "system-images;android-23;google_apis;x86_64"

# Start emulator
emulator -avd test-api23 -no-snapshot-save -no-audio

# Run tests
cd android
./gradlew connectedDebugAndroidTest
```

## Artifacts

### Debug APK
- **Retention**: 30 days
- **Name**: `app-debug`
- **Path**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK
- **Retention**: 90 days
- **Name**: `app-release`
- **Path**: `android/app/build/outputs/apk/release/*.apk`

### Test Results
- **Retention**: 30 days
- **Unit tests**: `test-results`
- **Instrumented tests**: `instrumented-test-results-api-{level}`

## Troubleshooting

### Build Fails on Dependencies

Ensure Google Maven is accessible:
```gradle
repositories {
    google()
    mavenCentral()
}
```

### Tests Fail on Specific API Level

Check the test logs for the specific API level:
1. Go to Actions tab in GitHub
2. Click on the workflow run
3. View logs for `instrumented-test` job
4. Download test results artifact

### Emulator Timeout

If emulator tests timeout:
- Increase timeout in workflow (default: 30 min)
- Check emulator logs in GitHub Actions
- Verify test doesn't require user interaction

### Signing Issues

If release build fails with signing errors:
1. Verify all secrets are set correctly
2. Check keystore password is correct
3. Ensure base64 encoding is valid
4. Test keystore locally first

## CI Environment Details

### Android SDK Components

The CI automatically installs:
- Android SDK Platform Tools
- Build Tools
- Platform SDK for compileSdkVersion (35)
- Platform SDKs for test matrix (23, 31, 35)
- System images for emulators

### Java Version

- **JDK**: Temurin 11
- **Reason**: Required for Android Gradle Plugin 8.5.0

### Node.js Version

- **Version**: 20
- **Reason**: Required for Vite and modern npm packages

## Performance Considerations

### Build Time

Typical build times:
- Debug APK: 5-10 minutes
- Release APK: 5-10 minutes
- Unit tests: 2-5 minutes
- Instrumented tests per API: 10-15 minutes

### Optimization Tips

1. Use Gradle caching (`cache: 'gradle'`)
2. Use npm caching (`cache: 'npm'`)
3. Disable Gradle daemon in CI (`--no-daemon`)
4. Run test matrix in parallel (`fail-fast: false`)

## Security

### Keystore Protection

- **Never commit keystore files** to repository
- Store keystore as base64 in GitHub Secrets
- Use strong passwords (16+ characters)
- Rotate keys periodically

### API Keys

If app uses API keys:
- Store in GitHub Secrets
- Inject via environment variables
- Use different keys for debug/release

## Workflow Triggers

The pipeline runs on:

1. **Push to main/develop**
   - Builds debug and release APKs
   - Runs all tests

2. **Pull requests to main/develop**
   - Builds debug APK only
   - Runs all tests

3. **Manual trigger**
   - Use "Run workflow" in Actions tab
   - Useful for testing changes

## Next Steps

1. **Configure Signing**: Add keystore secrets for release builds
2. **Monitor Tests**: Review test results in Actions tab
3. **Download APKs**: Get artifacts from successful builds
4. **Expand Tests**: Add more test cases as needed
5. **Performance Monitoring**: Track build times and optimize

## Related Documentation

- [Capacitor Android Guide](CAPACITOR_ANDROID_GUIDE.md)
- [Android Widget Implementation](ANDROID_WIDGET_IMPLEMENTATION.md)
- [Android Conversion Summary](ANDROID_CONVERSION_SUMMARY.md)
