
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2d0f76e4d41344eebe16f81e4da68467',
  appName: 'pi-eats-crypto-now-34',
  webDir: 'dist',
  server: {
    url: 'https://2d0f76e4-d413-44ee-be16-f81e4da68467.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#9333ea",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#f97316",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  // Add custom URL scheme for deep linking
  ios: {
    scheme: 'eatmepi'
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
