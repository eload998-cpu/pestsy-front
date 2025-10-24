import { CapacitorConfig } from '@capacitor/cli';

const GOOGLE_CLIENT_ID =
  process.env['GOOGLE_CLIENT_ID'] ??
  process.env['GOOGLE_SIGNIN_CLIENT_ID'] ??
  '547267894981-b130sbc443qmrj9murll50kq3i13ep3c.apps.googleusercontent.com';

const CAPGO_APP_ID = process.env['CAPGO_APP_ID'] ?? 'pestsy';
const CAPGO_CHANNEL = process.env['CAPGO_CHANNEL'] ?? 'production';
const CAPGO_AUTO_UPDATE =
  (process.env['CAPGO_AUTO_UPDATE'] ?? '').toLowerCase() !== 'false';

const config: CapacitorConfig = {
  appId: 'com.castilloapp.pestsy',
  appName: 'Pestsy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorSocialLogin: {
      google: {
        scopes: ['profile', 'email'],
        iosClientId: GOOGLE_CLIENT_ID,
        androidClientId: GOOGLE_CLIENT_ID,
        webClientId: GOOGLE_CLIENT_ID,
        serverClientId: GOOGLE_CLIENT_ID,
        forceCodeForRefreshToken: true,
        grantOfflineAccess: true,
      },
    },
    CapacitorUpdater: {
      appId: CAPGO_APP_ID,
      channel: CAPGO_CHANNEL,
      autoUpdate: CAPGO_AUTO_UPDATE,
    },
  },
};


export default config;
