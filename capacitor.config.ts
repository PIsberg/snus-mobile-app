import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.snustrack.app',
  appName: 'Snustrack App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appdata'],
      serverClientId: '111269543550-6ggs0lqbv5n4u1f813nct90arjsgg8p5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;