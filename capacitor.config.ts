import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.luminlynx.misty',
  appName: 'Misty',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
  // Android build options should be configured in android/app/build.gradle
  // Keystore configuration for release builds should use environment variables
};

export default config;
