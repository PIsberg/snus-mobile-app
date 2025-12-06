import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.snustrack.app',
  appName: 'SnusTrack AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;