import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  APP_PREFERENCES_STORAGE_KEY,
  defaultAppPreferences,
  type AppPreferencesState,
} from '@/src/features/appPreferences/appPreferencesTypes';
import { isAppLocale, type AppLocale } from '@/src/i18n/appLocales';

function mergeStored(parsed: unknown): AppPreferencesState {
  const base = defaultAppPreferences();
  if (!parsed || typeof parsed !== 'object') return base;
  const o = parsed as Record<string, unknown>;
  return {
    ...base,
    notificationsMuted: typeof o.notificationsMuted === 'boolean' ? o.notificationsMuted : base.notificationsMuted,
    useDataToImprove: typeof o.useDataToImprove === 'boolean' ? o.useDataToImprove : base.useDataToImprove,
    reduceMotion: typeof o.reduceMotion === 'boolean' ? o.reduceMotion : base.reduceMotion,
    largerText: typeof o.largerText === 'boolean' ? o.largerText : base.largerText,
    locale: typeof o.locale === 'string' && isAppLocale(o.locale) ? o.locale : base.locale,
  };
}

export async function loadAppPreferences(): Promise<AppPreferencesState> {
  try {
    const raw = await AsyncStorage.getItem(APP_PREFERENCES_STORAGE_KEY);
    if (!raw) return defaultAppPreferences();
    return mergeStored(JSON.parse(raw));
  } catch {
    return defaultAppPreferences();
  }
}

export async function saveAppPreferences(state: AppPreferencesState): Promise<void> {
  await AsyncStorage.setItem(APP_PREFERENCES_STORAGE_KEY, JSON.stringify(state));
}

export type { AppLocale };
