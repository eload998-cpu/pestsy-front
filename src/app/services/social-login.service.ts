import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LoginResult, SocialLogin } from '@capgo/capacitor-social-login';
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

interface LegacyGoogleAuthPlugin {
  initialize(options: LegacyGoogleAuthInitializeOptions): Promise<void>;
  signIn(): Promise<LegacyGoogleAuthSignInResult>;
}

interface LegacyGoogleAuthInitializeOptions {
  clientId?: string;
  serverClientId?: string;
  scopes?: string[];
  grantOfflineAccess?: boolean;
  forceCodeForRefreshToken?: boolean;
}

interface LegacyGoogleAuthSignInResult {
  authentication?: {
    accessToken?: string | null;
    idToken?: string | null;
    refreshToken?: string | null;
  } | null;
  email?: string | null;
  familyName?: string | null;
  givenName?: string | null;
  id?: string | null;
  imageUrl?: string | null;
  name?: string | null;
  serverAuthCode?: string | null;
}

@Injectable({ providedIn: 'root' })
export class SocialLoginService {
  private initialized = false;
  private legacyInitialized = false;

  private get isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

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
    if (this.shouldUseLegacyPlugin()) {
      return this.signInWithLegacyGoogleAuth();
    }

    try {
      await this.initialize();
    } catch (error) {
      if (this.shouldFallbackToLegacyPlugin(error)) {
        return this.signInWithLegacyGoogleAuth();
      }
      throw error;
    }

    try {
      const result = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: GOOGLE_LOGIN_SCOPES,
          forceRefreshToken: true,
        },
      });

      return this.toLegacyGoogleResult(result);
    } catch (error) {
      if (this.shouldFallbackToLegacyPlugin(error)) {
        return this.signInWithLegacyGoogleAuth();
      }
      throw error;
    }
  }

  private shouldUseLegacyPlugin(): boolean {
    return !Capacitor.isPluginAvailable('SocialLogin') && this.hasLegacyGoogleAuthPlugin();
  }

  private shouldFallbackToLegacyPlugin(error: unknown): boolean {
    if (!this.hasLegacyGoogleAuthPlugin()) {
      return false;
    }

    if (!error) {
      return true;
    }

    const message = this.extractErrorMessage(error);

    if (!message) {
      return false;
    }

    return (
      message.includes('SocialLogin plugin not implemented') ||
      message.includes('Capacitor plugin not implemented') ||
      message.includes('SocialLogin plugin is not implemented') ||
      message.includes('GoogleSignInClient.getSignInIntent')
    );
  }

  private extractErrorMessage(error: unknown): string | null {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
      return (error as any).message;
    }

    return null;
  }

  private hasLegacyGoogleAuthPlugin(): boolean {
    const capacitorAny = Capacitor as unknown as { Plugins?: Record<string, unknown> };
    const plugin = capacitorAny?.Plugins?.['GoogleAuth'];
    return typeof plugin === 'object' && plugin !== null;
  }

  private async signInWithLegacyGoogleAuth(): Promise<GoogleSignInLegacyResult> {
    const plugin = this.getLegacyGoogleAuthPlugin();

    if (!plugin) {
      throw new Error('GoogleAuth plugin is not available on this platform');
    }

    if (!this.legacyInitialized) {
      try {
        await plugin.initialize({
          clientId: environment.googleClientId,
          serverClientId: environment.googleClientId,
          scopes: GOOGLE_LOGIN_SCOPES,
          grantOfflineAccess: true,
          forceCodeForRefreshToken: true,
        });
      } catch (error) {
        const message = this.extractErrorMessage(error);
        if (message && message.includes('already initialized')) {
          // Ignore initialization errors when the plugin was already initialized.
        } else {
          throw error;
        }
      }

      this.legacyInitialized = true;
    }

    const result = await plugin.signIn();

    return this.toLegacyGoogleAuthResult(result);
  }

  private getLegacyGoogleAuthPlugin(): LegacyGoogleAuthPlugin | null {
    const capacitorAny = Capacitor as unknown as { Plugins?: Record<string, unknown> };
    const plugin = capacitorAny?.Plugins?.['GoogleAuth'] as LegacyGoogleAuthPlugin | undefined;
    if (!plugin || typeof plugin.signIn !== 'function') {
      return null;
    }

    return plugin;
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

    throw new Error('Google sign-in is not available in this build.');
  }

  private toLegacyGoogleAuthResult(result: LegacyGoogleAuthSignInResult): GoogleSignInLegacyResult {
    const accessToken = result.authentication?.accessToken ?? null;
    const refreshToken = result.authentication?.refreshToken ?? null;

    return {
      provider: 'google',
      accessToken,
      idToken: result.authentication?.idToken ?? null,
      refreshToken,
      serverAuthCode: result.serverAuthCode ?? null,
      email: result.email ?? null,
      familyName: result.familyName ?? null,
      givenName: result.givenName ?? null,
      id: result.id ?? null,
      imageUrl: result.imageUrl ?? null,
      name: result.name ?? null,
      authentication: result.authentication
        ? {
            accessToken,
            idToken: result.authentication?.idToken ?? null,
            refreshToken,
            serverAuthCode: result.serverAuthCode ?? null,
          }
        : null,
      raw: result,
    };
  }
}
