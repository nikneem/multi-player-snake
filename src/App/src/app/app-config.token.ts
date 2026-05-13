import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

declare global {
  interface Window {
    __env?: Partial<AppConfig>;
  }
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    apiUrl: window.__env?.apiUrl ?? '',
  }),
});
