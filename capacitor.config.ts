import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.castilloapp.pestsy',
  appName: 'Pestsy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};


export default config;
