import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.730c2dde1a57402782355b15e82f0bbe',
  appName: 'prompt-photo-vault',
  webDir: 'dist',
  server: {
    url: 'https://730c2dde-1a57-4027-8235-5b15e82f0bbe.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;