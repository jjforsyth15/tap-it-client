import {
  defaultAppPreferences,
  type AppPreferencesState,
} from '@/src/features/appPreferences/appPreferencesTypes';
import { loadAppPreferences, saveAppPreferences } from '@/src/features/appPreferences/appPreferencesStorage';
import { isRtlLocale, type AppLocale } from '@/src/i18n/appLocales';
import { getUiStrings, type UiStrings } from '@/src/i18n/ui/getUiStrings';
import { getSettingsStrings, type SettingsStrings } from '@/src/i18n/settingsCopy';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';

type AppPreferencesContextValue = {
  hydrated: boolean;
  preferences: AppPreferencesState;
  setPreferences: (patch: Partial<AppPreferencesState>) => void;
  /** Settings-area copy for the active locale */
  s: SettingsStrings;
  /** App-wide UI copy (tabs, dashboards, onboarding, etc.) */
  u: UiStrings;
  setLocale: (locale: AppLocale) => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [preferences, setPreferencesState] = useState<AppPreferencesState>(() => defaultAppPreferences());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const loaded = await loadAppPreferences();
      if (!cancelled) {
        setPreferencesState(loaded);
        setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const rtl = isRtlLocale(preferences.locale);
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(rtl);
    }
  }, [hydrated, preferences.locale]);

  const persist = useCallback(async (next: AppPreferencesState) => {
    await saveAppPreferences(next);
  }, []);

  const setPreferences = useCallback(
    (patch: Partial<AppPreferencesState>) => {
      setPreferencesState((prev) => {
        const next = { ...prev, ...patch };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const setLocale = useCallback(
    (locale: AppLocale) => {
      setPreferences({ locale });
    },
    [setPreferences],
  );

  const s = useMemo(() => getSettingsStrings(preferences.locale), [preferences.locale]);
  const u = useMemo(() => getUiStrings(preferences.locale), [preferences.locale]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      hydrated,
      preferences,
      setPreferences,
      s,
      u,
      setLocale,
    }),
    [hydrated, preferences, setPreferences, s, u, setLocale],
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences(): AppPreferencesContextValue {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }
  return ctx;
}
