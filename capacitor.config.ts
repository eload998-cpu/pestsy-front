import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.castilloapp.pestsy',
  appName: 'Pestsy',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSocialLogin: {
      google: {
        scopes: ['profile', 'email'],
        webClientId:
          '547267894981-b130sbc443qmrj9murll50kq3i13ep3c.apps.googleusercontent.com',
        androidClientId:
          '547267894981-b130sbc443qmrj9murll50kq3i13ep3c.apps.googleusercontent.com',
        iosClientId:
          '547267894981-b130sbc443qmrj9murll50kq3i13ep3c.apps.googleusercontent.com',
        serverClientId:
          '547267894981-b130sbc443qmrj9murll50kq3i13ep3c.apps.googleusercontent.com',
        clientId:
          '547267894981-b130sbc443qmrj9murll50kq3i13ep3c.apps.googleusercontent.com',
        forceCodeForRefreshToken: true,
      },
    },
  },
};


export default config;
