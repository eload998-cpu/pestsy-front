import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export interface GoogleSignInLegacyResult {
  provider: 'google';
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  serverAuthCode: string | null;
  email: string | null;
  familyName: string | null;
  givenName: string | null;
  id: string | null;
  imageUrl: string | null;
  name: string | null;
  authentication: {
    accessToken: string | null;
    idToken: string | null;
    refreshToken: string | null;
    serverAuthCode: string | null;
  } | null;
  raw: unknown;
}

@Injectable({ providedIn: 'root' })
export class SocialLoginService {
  async initialize(): Promise<void> {
    const platform = Capacitor.getPlatform();

    if (platform !== 'web') {
      console.info('Google social login is disabled in this build.');
    }
  }

  async signInWithGoogle(): Promise<GoogleSignInLegacyResult> {
    throw new Error('Google sign-in is not available in this build.');
  }
}
