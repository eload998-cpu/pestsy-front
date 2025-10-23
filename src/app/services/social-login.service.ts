import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
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

interface SocialLoginPlugin {
  login(options: SocialLoginLoginOptions): Promise<SocialLoginLoginResult>;
}

interface SocialLoginLoginOptions {
  provider: string;
  options?: Record<string, unknown>;
}

interface SocialLoginLoginResult {
  provider: string;
  result: unknown;
}

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
  private socialLoginPlugin: SocialLoginPlugin | null = null;
  private socialLoginPluginConfigured = false;

  private get isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    if (!this.isWeb && !this.isSocialLoginPluginAvailable()) {
      console.info(
        'Capacitor Social Login plugin is not available. Falling back to the legacy GoogleAuth plugin when possible.',
      );
    }
  }

  async signInWithGoogle(): Promise<GoogleSignInLegacyResult> {
    const socialLoginPlugin = this.resolveSocialLoginPlugin();

    if (socialLoginPlugin) {
      try {
        await this.initialize();
        return await this.signInWithCapacitorSocialLogin(socialLoginPlugin);
      } catch (error) {
        if (!this.shouldFallbackToLegacyPlugin(error)) {
          throw error;
        }
      }
    }

    if (this.shouldUseLegacyPlugin()) {
      return this.signInWithLegacyGoogleAuth();
    }

    await this.initialize();

    throw new Error('Google sign-in is not available in this build.');
  }

  private shouldUseLegacyPlugin(): boolean {
    return !this.isSocialLoginPluginAvailable() && this.hasLegacyGoogleAuthPlugin();
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
      message.includes('CapacitorSocialLogin') ||
      message.includes('Cannot find provider') ||
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

  /*
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
  }*/

  private resolveSocialLoginPlugin(): SocialLoginPlugin | null {
    const plugin = this.socialLoginPlugin ?? this.findSocialLoginPlugin();

    if (plugin && this.socialLoginPlugin !== plugin) {
      this.socialLoginPlugin = plugin;
    }

    return plugin ?? null;
  }

  private isSocialLoginPluginAvailable(): boolean {
    return this.resolveSocialLoginPlugin() !== null;
  }

  private findSocialLoginPlugin(): SocialLoginPlugin | null {
    const capacitorAny = Capacitor as unknown as { Plugins?: Record<string, unknown> };
    const plugins = capacitorAny?.Plugins ?? {};
    const candidates = [
      plugins['CapgoCapacitorSocialLogin'],
      plugins['CapacitorSocialLogin'],
      plugins['SocialLogin'],
    ];

    for (const candidate of candidates) {
      if (candidate && typeof (candidate as SocialLoginPlugin).login === 'function') {
        return candidate as SocialLoginPlugin;
      }
    }

    return null;
  }

  private async signInWithCapacitorSocialLogin(plugin: SocialLoginPlugin): Promise<GoogleSignInLegacyResult> {
    await this.ensureSocialLoginPluginConfigured(plugin);

    const result = await plugin.login({
      provider: 'google',
      options: {
        scopes: GOOGLE_LOGIN_SCOPES,
        forceRefreshToken: true,
        forceCodeForRefreshToken: true,
        grantOfflineAccess: true,
        iosClientId: environment.googleClientId,
        androidClientId: environment.googleClientId,
        webClientId: environment.googleClientId,
        serverClientId: environment.googleClientId,
      },
    });

    return this.toLegacyGoogleResult(result);
  }

  private async ensureSocialLoginPluginConfigured(plugin: SocialLoginPlugin): Promise<void> {
    if (this.socialLoginPluginConfigured) {
      return;
    }

    const googleOptions = {
      scopes: GOOGLE_LOGIN_SCOPES,
      iosClientId: environment.googleClientId,
      androidClientId: environment.googleClientId,
      webClientId: environment.googleClientId,
      serverClientId: environment.googleClientId,
      forceCodeForRefreshToken: true,
      grantOfflineAccess: true,
    } as const;

    const pluginAny = plugin as unknown as {
      initialize?: (config: Record<string, unknown>) => Promise<void> | void;
      configure?: (config: Record<string, unknown>) => Promise<void> | void;
      addProvider?: (provider: string, options: Record<string, unknown>) => Promise<void> | void;
      registerProvider?: (provider: string, options: Record<string, unknown>) => Promise<void> | void;
      setProviderOptions?: (provider: string, options: Record<string, unknown>) => Promise<void> | void;
    };

    const initializationConfig = { providers: { google: googleOptions } } satisfies Record<string, unknown>;

    const initializationMethods: (keyof typeof pluginAny)[] = ['initialize', 'configure'];

    for (const method of initializationMethods) {
      const fn = pluginAny[method];
      if (typeof fn !== 'function') {
        continue;
      }

      try {
        await fn.call(pluginAny, initializationConfig);
      } catch (error) {
        const message = this.extractErrorMessage(error);
        if (!message || !message.includes('already')) {
          throw error;
        }
      }
    }

    const providerRegistrationMethods: (keyof typeof pluginAny)[] = [
      'addProvider',
      'registerProvider',
      'setProviderOptions',
    ];

    for (const method of providerRegistrationMethods) {
      const fn = pluginAny[method];
      if (typeof fn !== 'function') {
        continue;
      }

      try {
        await fn.call(pluginAny, 'google', googleOptions);
      } catch (error) {
        const message = this.extractErrorMessage(error);
        if (!message || !message.includes('already')) {
          throw error;
        }
      }
    }

    this.socialLoginPluginConfigured = true;
  }

  private toLegacyGoogleResult(result: SocialLoginLoginResult): GoogleSignInLegacyResult {
    if (result.provider !== 'google') {
      throw new Error(`Unexpected social login provider: ${result.provider}`);
    }

    const googleResult: any = result.result ?? {};
    const responseType = typeof googleResult.responseType === 'string' ? googleResult.responseType : null;

    if (responseType === 'offline') {
      const serverAuthCode = googleResult.serverAuthCode ?? null;

      return {
        provider: 'google',
        accessToken: null,
        idToken: null,
        refreshToken: null,
        serverAuthCode,
        email: this.extractFirstDefined([
          googleResult.email,
          googleResult.profile?.email,
          googleResult.user?.email,
        ]),
        familyName: this.extractFirstDefined([
          googleResult.familyName,
          googleResult.profile?.familyName,
          googleResult.user?.familyName,
        ]),
        givenName: this.extractFirstDefined([
          googleResult.givenName,
          googleResult.profile?.givenName,
          googleResult.user?.givenName,
        ]),
        id: this.extractFirstDefined([
          googleResult.id,
          googleResult.profile?.id,
          googleResult.user?.id,
        ]),
        imageUrl: this.extractFirstDefined([
          googleResult.imageUrl,
          googleResult.profile?.imageUrl,
          googleResult.user?.imageUrl,
        ]),
        name: this.extractFirstDefined([
          googleResult.name,
          googleResult.profile?.name,
          googleResult.user?.name,
        ]),
        authentication: null,
        raw: googleResult,
      };
    }

    const accessToken = this.extractFirstDefined([
      googleResult.accessToken?.token,
      googleResult.authentication?.accessToken,
      googleResult.accessToken,
    ]) ?? null;

    const refreshToken = this.extractFirstDefined([
      googleResult.accessToken?.refreshToken,
      googleResult.authentication?.refreshToken,
    ]) ?? null;

    const idToken = this.extractFirstDefined([
      googleResult.idToken,
      googleResult.authentication?.idToken,
      googleResult.token?.idToken,
    ]) ?? null;

    const serverAuthCode = this.extractFirstDefined([
      googleResult.serverAuthCode,
      googleResult.authentication?.serverAuthCode,
    ]) ?? null;

    const email = this.extractFirstDefined([
      googleResult.email,
      googleResult.profile?.email,
      googleResult.user?.email,
    ]);

    const familyName = this.extractFirstDefined([
      googleResult.familyName,
      googleResult.profile?.familyName,
      googleResult.user?.familyName,
    ]);

    const givenName = this.extractFirstDefined([
      googleResult.givenName,
      googleResult.profile?.givenName,
      googleResult.user?.givenName,
    ]);

    const id = this.extractFirstDefined([
      googleResult.id,
      googleResult.profile?.id,
      googleResult.user?.id,
    ]);

    const imageUrl = this.extractFirstDefined([
      googleResult.imageUrl,
      googleResult.profile?.imageUrl,
      googleResult.user?.imageUrl,
    ]);

    const name = this.extractFirstDefined([
      googleResult.name,
      googleResult.profile?.name,
      googleResult.user?.name,
    ]);

    const authentication =
      accessToken !== null || idToken !== null || refreshToken !== null || serverAuthCode !== null
        ? {
            accessToken,
            idToken,
            refreshToken,
            serverAuthCode,
          }
        : null;

    return {
      provider: 'google',
      accessToken,
      idToken,
      refreshToken,
      serverAuthCode,
      email: email ?? null,
      familyName: familyName ?? null,
      givenName: givenName ?? null,
      id: id ?? null,
      imageUrl: imageUrl ?? null,
      name: name ?? null,
      authentication,
      raw: googleResult,
    };
  }

  private extractFirstDefined<T>(values: T[]): T | undefined {
    return values.find((value) => value !== undefined && value !== null);
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
