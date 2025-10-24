import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

type CapgoUpdaterPlugin = {
  notifyAppReady?: (...args: unknown[]) => Promise<unknown>;
  checkForUpdate?: (...args: unknown[]) => Promise<unknown>;
  checkForUpdates?: (...args: unknown[]) => Promise<unknown>;
  checkUpdate?: (...args: unknown[]) => Promise<unknown>;
  download?: (...args: unknown[]) => Promise<unknown>;
  downloadUpdate?: (...args: unknown[]) => Promise<unknown>;
  set?: (...args: unknown[]) => Promise<unknown>;
  setUpdate?: (...args: unknown[]) => Promise<unknown>;
  apply?: (...args: unknown[]) => Promise<unknown>;
  reload?: (...args: unknown[]) => Promise<unknown>;
};

@Injectable({ providedIn: 'root' })
export class CapgoUpdaterService {
  private initialised = false;

  async initialize(): Promise<void> {
    if (this.initialised) {
      return;
    }

    this.initialised = true;

    if (!environment.capgo?.enabled) {
      return;
    }

    const platform = typeof Capacitor.getPlatform === 'function' ? Capacitor.getPlatform() : 'web';
    if (platform === 'web') {
      return;
    }

    const plugin = this.resolvePlugin();
    if (!plugin) {
      console.warn('[Capgo] Capacitor updater plugin is not available.');
      return;
    }

    await this.tryInvoke(plugin, ['notifyAppReady']);

    const updateResult = await this.tryInvoke(plugin, ['checkForUpdate', 'checkForUpdates', 'checkUpdate']);
    if (!this.isUpdateAvailable(updateResult)) {
      return;
    }

    const downloadPayload = this.buildDownloadPayload(updateResult);
    const downloadResult = await this.tryInvoke(plugin, ['downloadUpdate', 'download'], downloadPayload ? [downloadPayload] : []);
    const setPayload = downloadResult ?? downloadPayload ?? undefined;
    if (!setPayload) {
      return;
    }

    await this.tryInvoke(plugin, ['set', 'setUpdate', 'apply', 'reload'], [setPayload]);
  }

  private resolvePlugin(): CapgoUpdaterPlugin | null {
    const candidates = ['CapacitorUpdater', 'CapgoCapacitorUpdater', 'CapgoUpdater'];
    const capacitorAny = Capacitor as unknown as { Plugins?: Record<string, unknown> };

    for (const key of candidates) {
      const plugin = capacitorAny?.Plugins?.[key] as CapgoUpdaterPlugin | undefined;
      if (plugin) {
        return plugin;
      }
    }

    const globalAny = globalThis as Record<string, unknown>;
    for (const key of candidates) {
      const plugin = globalAny?.[key] as CapgoUpdaterPlugin | undefined;
      if (plugin) {
        return plugin;
      }
    }

    return null;
  }

  private async tryInvoke(
    plugin: CapgoUpdaterPlugin,
    methodNames: string[],
    args: unknown[] = [],
  ): Promise<unknown> {
    for (const methodName of methodNames) {
      const method = (plugin as Record<string, unknown>)[methodName];
      if (typeof method === 'function') {
        try {
          return await (method as (...innerArgs: unknown[]) => Promise<unknown>).apply(plugin, args);
        } catch (error) {
          console.warn(`[Capgo] Calling \"${methodName}\" failed`, error);
          return null;
        }
      }
    }

    return null;
  }

  private isUpdateAvailable(result: unknown): boolean {
    if (!result || typeof result !== 'object') {
      return false;
    }

    const record = result as Record<string, unknown>;

    const booleanKeys = ['available', 'value', 'shouldUpdate', 'updateAvailable'];
    for (const key of booleanKeys) {
      if (typeof record[key] === 'boolean') {
        return record[key] as boolean;
      }
    }

    return false;
  }

  private buildDownloadPayload(result: unknown): Record<string, unknown> | undefined {
    if (!result || typeof result !== 'object') {
      return undefined;
    }

    const record = result as Record<string, unknown>;
    const versionKeys = ['version', 'name', 'appId', 'hash'];
    for (const key of versionKeys) {
      const value = record[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return { version: value };
      }
    }

    if (environment.capgo?.channel) {
      return { channel: environment.capgo.channel };
    }

    return undefined;
  }
}
