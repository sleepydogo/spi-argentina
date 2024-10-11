import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ignis.project',
  appName: 'Ignis',
  webDir: 'www',
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '21',
      'android-targetSdkVersion': '33',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      ShowSplashScreenSpinner: 'false',
      FadeSplashScreen: 'false',
      AutoHideSplashScreen: 'false',
      orientation: 'portrait',
      AndroidPersistentFileLocation: 'Compatibility'
    }
  }
};

export default config;
