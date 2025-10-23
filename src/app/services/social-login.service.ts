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
  private initialized = false;
  private readonly isWeb = Capacitor.getPlatform() === 'web';

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    if (!this.isWeb) {
      console.info('Google social login has been disabled for native builds in this configuration.');
    }
  }

  async signInWithGoogle(): Promise<GoogleSignInLegacyResult> {
    await this.initialize();

    throw new Error('Google sign-in is not available in this build.');
  }
}
