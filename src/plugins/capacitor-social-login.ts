import { registerPlugin, WebPlugin } from '@capacitor/core';
import type { PermissionState } from '@capacitor/core';
import { GoogleSocialLogin } from '@capgo/capacitor-social-login/dist/esm/google-provider';

export type SocialProvider = 'google';

export interface GoogleProviderConfig {
  clientId?: string;
  serverClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
  mode?: 'online' | 'offline';
  hostedDomain?: string;
  redirectUrl?: string;
  scopes?: string[];
  forceCodeForRefreshToken?: boolean;
}

export interface SocialLoginInitializeOptions {
  google?: GoogleProviderConfig;
  providers?: {
    google?: GoogleProviderConfig;
  };
}

export interface SocialLoginSignInOptions {
  provider: SocialProvider;
}

export interface SocialLoginSignOutOptions {
  provider: SocialProvider;
}

export interface SocialLoginSignInResult {
  provider: SocialProvider;
  accessToken?: string | null;
  idToken?: string | null;
  refreshToken?: string | null;
  serverAuthCode?: string | null;
  email?: string | null;
  familyName?: string | null;
  givenName?: string | null;
  id?: string | null;
  imageUrl?: string | null;
  name?: string | null;
  authentication?: {
    accessToken?: string | null;
    idToken?: string | null;
    refreshToken?: string | null;
    serverAuthCode?: string | null;
  } | null;
  /**
   * Additional raw data returned by the provider. Kept for compatibility with the
   * Codetrix plugin payload used previously in the application.
   */
  raw?: unknown;
}

export interface SocialLoginPlugin {
  initialize(options: SocialLoginInitializeOptions): Promise<void>;
  signIn(options: SocialLoginSignInOptions): Promise<SocialLoginSignInResult>;
  signOut(options: SocialLoginSignOutOptions): Promise<void>;
  requestPermissions?: () => Promise<PermissionState>;
}

const DEFAULT_SCOPES = ['profile', 'email'];

class CapacitorSocialLoginWeb extends WebPlugin implements SocialLoginPlugin {
  private googleConfig?: GoogleProviderConfig;
  private initialized = false;
  private readonly googleProvider = new GoogleSocialLogin();

  async initialize(options: SocialLoginInitializeOptions): Promise<void> {
    const googleOptions = options.providers?.google ?? options.google;
    if (!googleOptions) {
      this.googleConfig = undefined;
      this.initialized = true;
      return;
    }

    this.googleConfig = googleOptions;
    const {
      clientId,
      serverClientId,
      webClientId,
      scopes,
      forceCodeForRefreshToken,
      mode,
    } = googleOptions;

    const resolvedClientId = webClientId ?? clientId ?? serverClientId ?? null;
    const resolvedMode = mode ?? (forceCodeForRefreshToken ? 'offline' : 'online');

    await this.googleProvider.initialize(
      resolvedClientId,
      resolvedMode,
      googleOptions.hostedDomain,
      googleOptions.redirectUrl,
    );

    if (scopes && scopes.length > 0) {
      // Persist resolved scopes so they can be reused during login.
      this.googleConfig = {
        ...googleOptions,
        scopes,
        webClientId: webClientId ?? resolvedClientId ?? undefined,
        clientId: clientId ?? resolvedClientId ?? undefined,
        serverClientId,
        mode: resolvedMode,
      };
    } else {
      this.googleConfig = {
        ...googleOptions,
        scopes,
        webClientId: webClientId ?? resolvedClientId ?? undefined,
        clientId: clientId ?? resolvedClientId ?? undefined,
        serverClientId,
        mode: resolvedMode,
      };
    }

    this.initialized = true;
  }

  async signIn(options: SocialLoginSignInOptions): Promise<SocialLoginSignInResult> {
    if (options.provider !== 'google') {
      throw this.unimplemented('Only the Google provider is available on web.');
    }

    if (!this.initialized) {
      await this.initialize({ google: this.googleConfig });
    }

    const scopes = this.googleConfig?.scopes?.length
      ? this.googleConfig.scopes
      : DEFAULT_SCOPES;
    const shouldForceConsent =
      this.googleConfig?.mode === 'offline' ||
      this.googleConfig?.forceCodeForRefreshToken;
    const response = await this.googleProvider.login({
      scopes,
      prompt: shouldForceConsent ? 'consent select_account' : undefined,
    });
    const { result } = response;

    if (result.responseType === 'offline') {
      return {
        provider: 'google',
        accessToken: null,
        idToken: null,
        refreshToken: null,
        serverAuthCode: result.serverAuthCode,
        email: null,
        familyName: null,
        givenName: null,
        id: null,
        imageUrl: null,
        name: null,
        authentication: null,
        raw: result,
      };
    }

    const accessToken = result.accessToken?.token ?? null;
    const refreshToken = result.accessToken?.refreshToken ?? null;

    return {
      provider: 'google',
      accessToken,
      idToken: result.idToken ?? null,
      refreshToken: refreshToken ?? null,
      serverAuthCode: null,
      email: result.profile?.email ?? null,
      familyName: result.profile?.familyName ?? null,
      givenName: result.profile?.givenName ?? null,
      id: result.profile?.id ?? null,
      imageUrl: result.profile?.imageUrl ?? null,
      name: result.profile?.name ?? null,
      authentication: result.accessToken
        ? {
            accessToken: accessToken,
            refreshToken: refreshToken,
            idToken: result.idToken ?? null,
            serverAuthCode: null,
          }
        : null,
      raw: result,
    };
  }

  async signOut(options: SocialLoginSignOutOptions): Promise<void> {
    if (options.provider !== 'google') {
      throw this.unimplemented('Only the Google provider is available on web.');
    }

    await this.googleProvider.logout();
  }
}

export const CapacitorSocialLogin = registerPlugin<SocialLoginPlugin>(
  'CapacitorSocialLogin',
  {
    web: () => new CapacitorSocialLoginWeb(),
  },
);

export type {
  SocialLoginInitializeOptions as CapacitorSocialLoginInitializeOptions,
  SocialLoginPlugin as CapacitorSocialLoginPlugin,
  SocialLoginSignInOptions as CapacitorSocialLoginSignInOptions,
  SocialLoginSignInResult as CapacitorSocialLoginSignInResult,
  SocialLoginSignOutOptions as CapacitorSocialLoginSignOutOptions,
};
