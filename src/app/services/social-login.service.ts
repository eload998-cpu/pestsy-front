import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSocialLogin,
  SocialLoginSignInResult,
} from '@capgo/capacitor-social-login';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocialLoginService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await CapacitorSocialLogin.initialize({
        google: {
          clientId: environment.googleClientId,
          serverClientId: environment.googleClientId,
          webClientId: environment.googleClientId,
          scopes: ['profile', 'email'],
          forceCodeForRefreshToken: true,
        },
      });

      this.initialized = true;
    } catch (error) {
      // When the plugin is not available on the current platform we simply mark
      // the service as initialized so web usage can keep working with the
      // registered web implementation.
      console.warn('Capacitor social login initialization warning', error);
      this.initialized = Capacitor.getPlatform() === 'web';
      if (!this.initialized) {
        throw error;
      }
    }
  }

  async signInWithGoogle(): Promise<SocialLoginSignInResult> {
    await this.initialize();
    return CapacitorSocialLogin.signIn({ provider: 'google' });
  }
}
