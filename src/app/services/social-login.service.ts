import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  InitializeOptions,
  LoginResult,
  SocialLogin,
} from '@capgo/capacitor-social-login';
import { environment } from 'src/environments/environment';

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

const GOOGLE_LOGIN_SCOPES = ['profile', 'email'];

@Injectable({ providedIn: 'root' })
export class SocialLoginService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const options: InitializeOptions = {
        google: {
          webClientId: environment.googleClientId,
          iOSClientId: environment.googleClientId,
          iOSServerClientId: environment.googleClientId,
          mode: 'offline',
        },
      };

      await SocialLogin.initialize(options);

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

  async signInWithGoogle(): Promise<GoogleSignInLegacyResult> {
    await this.initialize();
    const result = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: GOOGLE_LOGIN_SCOPES,
        forceRefreshToken: true,
      },
    });

    return this.toLegacyGoogleResult(result);
  }

  private toLegacyGoogleResult(result: LoginResult): GoogleSignInLegacyResult {
    if (result.provider !== 'google') {
      throw new Error(`Unexpected social login provider: ${result.provider}`);
    }

    const googleResult = result.result;

    if (googleResult.responseType === 'offline') {
      return {
        provider: 'google',
        accessToken: null,
        idToken: null,
        refreshToken: null,
        serverAuthCode: googleResult.serverAuthCode,
        email: null,
        familyName: null,
        givenName: null,
        id: null,
        imageUrl: null,
        name: null,
        authentication: null,
        raw: googleResult,
      };
    }

    const accessToken = googleResult.accessToken?.token ?? null;
    const refreshToken = googleResult.accessToken?.refreshToken ?? null;

    return {
      provider: 'google',
      accessToken,
      idToken: googleResult.idToken ?? null,
      refreshToken,
      serverAuthCode: null,
      email: googleResult.profile.email ?? null,
      familyName: googleResult.profile.familyName ?? null,
      givenName: googleResult.profile.givenName ?? null,
      id: googleResult.profile.id ?? null,
      imageUrl: googleResult.profile.imageUrl ?? null,
      name: googleResult.profile.name ?? null,
      authentication: googleResult.accessToken
        ? {
            accessToken,
            refreshToken,
            idToken: googleResult.idToken ?? null,
            serverAuthCode: null,
          }
        : null,
      raw: googleResult,
    };
  }
}
