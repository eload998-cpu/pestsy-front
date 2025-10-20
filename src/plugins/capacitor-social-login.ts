import { registerPlugin, WebPlugin } from '@capacitor/core';
import type { PermissionState } from '@capacitor/core';
import { GoogleAuth } from '@capacitor/google';

export type SocialProvider = 'google';

export interface GoogleProviderConfig {
  clientId?: string;
  serverClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
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

class CapacitorSocialLoginWeb
  extends WebPlugin<SocialLoginInitializeOptions>
  implements SocialLoginPlugin
{
  private googleConfig?: GoogleProviderConfig;
  private initialized = false;

  async initialize(options: SocialLoginInitializeOptions): Promise<void> {
    const googleOptions = options.providers?.google ?? options.google;
    if (!googleOptions) {
      this.googleConfig = undefined;
      this.initialized = true;
      return;
    }

    this.googleConfig = googleOptions;

    const { clientId, serverClientId, scopes, forceCodeForRefreshToken } =
      googleOptions;

    await GoogleAuth.initialize({
      clientId: clientId ?? serverClientId ?? '',
      scopes: scopes ?? DEFAULT_SCOPES,
      grantOfflineAccess: forceCodeForRefreshToken ?? false,
    });

    this.initialized = true;
  }

  async signIn(options: SocialLoginSignInOptions): Promise<SocialLoginSignInResult> {
    if (options.provider !== 'google') {
      throw this.unimplemented('Only the Google provider is available on web.');
    }

    if (!this.initialized) {
      await this.initialize({ google: this.googleConfig });
    }

    const googleUser = await GoogleAuth.signIn();

    return {
      provider: 'google',
      accessToken: googleUser?.authentication?.accessToken ?? null,
      idToken: googleUser?.authentication?.idToken ?? null,
      refreshToken: googleUser?.authentication?.refreshToken ?? null,
      serverAuthCode: (googleUser as any)?.serverAuthCode ?? null,
      email: googleUser?.email ?? null,
      familyName: googleUser?.familyName ?? null,
      givenName: googleUser?.givenName ?? null,
      id: googleUser?.id ?? null,
      imageUrl: googleUser?.imageUrl ?? null,
      name: googleUser?.name ?? null,
      authentication: googleUser?.authentication ?? null,
      raw: googleUser,
    };
  }

  async signOut(options: SocialLoginSignOutOptions): Promise<void> {
    if (options.provider !== 'google') {
      throw this.unimplemented('Only the Google provider is available on web.');
    }

    await GoogleAuth.signOut();
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
  SocialLoginSignInOptions,
  SocialLoginSignInResult,
  SocialLoginSignOutOptions,
};
