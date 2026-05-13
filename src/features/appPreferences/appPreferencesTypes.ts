import type { AppLocale } from '@/src/i18n/appLocales';

export type AppPreferencesState = {
  notificationsMuted: boolean;
  /** Product analytics / personalization (demo toggle). */
  useDataToImprove: boolean;
  reduceMotion: boolean;
  largerText: boolean;
  locale: AppLocale;
};

export const APP_PREFERENCES_STORAGE_KEY = '@tap_it/app_preferences_v1';

export function defaultAppPreferences(): AppPreferencesState {
  return {
    notificationsMuted: false,
    useDataToImprove: true,
    reduceMotion: false,
    largerText: false,
    locale: 'en',
  };
}
