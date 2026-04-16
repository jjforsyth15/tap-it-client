import { fetchAccountMe, patchAccount } from '@/src/features/account/account.api';
import { mergeAuthUserIntoProfile, mergeServerAccount, profileStateToAccountPatch } from '@/src/features/account/accountProfileMap';
import { fetchMyCardsAsUserNfcCards } from '@/src/features/cards/cards.api';
import type { AuthUser } from '@/src/features/auth/types';
import { getAccessToken } from '@/src/features/auth/session';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  defaultUserProfile,
  deriveTheme,
  type AppThemeColors,
  type ColorMode,
  type UserNfcCard,
  type UserProfileState,
} from '@/src/features/profile/profileTypes';
import { clearUserProfile, loadUserProfile, saveUserProfile } from '@/src/features/profile/profileStorage';

const SYNC_DEBOUNCE_MS = 650;

type UserProfileContextValue = {
  hydrated: boolean;
  profile: UserProfileState;
  myCards: UserNfcCard[];
  cardsLoading: boolean;
  colors: AppThemeColors;
  setProfile: (patch: Partial<UserProfileState>) => void;
  replaceProfile: (next: UserProfileState) => void;
  setColorMode: (mode: ColorMode) => void;
  setAccentHex: (hex: string) => void;
  resetProfileStorage: () => Promise<void>;
  refreshMyCards: () => Promise<void>;
  /** Load account from API when signed in (e.g. after login). */
  refreshFromServer: () => Promise<void>;
  /** After login/register: apply JWT user payload immediately (avoids waiting on GET /account/me). */
  applyAuthUser: (user: AuthUser) => void;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfileState] = useState<UserProfileState>(() => defaultUserProfile());
  const [myCards, setMyCards] = useState<UserNfcCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const latestStateRef = useRef<UserProfileState>(defaultUserProfile());
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(async (next: UserProfileState) => {
    await saveUserProfile(next);
  }, []);

  const scheduleServerSync = useCallback(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      syncTimerRef.current = null;
      void (async () => {
        const token = await getAccessToken();
        if (!token) return;
        const s = latestStateRef.current;
        try {
          await patchAccount(profileStateToAccountPatch(s));
        } catch {
          // offline or validation — local cache still applies
        }
      })();
    }, SYNC_DEBOUNCE_MS);
  }, []);

  const setProfile = useCallback(
    (patch: Partial<UserProfileState>) => {
      setProfileState((prev) => {
        const next = { ...prev, ...patch };
        latestStateRef.current = next;
        void persist(next);
        scheduleServerSync();
        return next;
      });
    },
    [persist, scheduleServerSync],
  );

  const replaceProfile = useCallback(
    (next: UserProfileState) => {
      latestStateRef.current = next;
      setProfileState(next);
      void persist(next);
    },
    [persist],
  );

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      setProfile({ colorMode: mode });
    },
    [setProfile],
  );

  const setAccentHex = useCallback(
    (hex: string) => {
      setProfile({ accentHex: hex });
    },
    [setProfile],
  );

  const resetProfileStorage = useCallback(async () => {
    await clearUserProfile();
    const fresh = await loadUserProfile();
    latestStateRef.current = fresh;
    setProfileState(fresh);
    setMyCards([]);
  }, []);

  const refreshMyCards = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setMyCards([]);
      return;
    }
    setCardsLoading(true);
    try {
      const list = await fetchMyCardsAsUserNfcCards();
      setMyCards(list);
    } catch {
      setMyCards([]);
    } finally {
      setCardsLoading(false);
    }
  }, []);

  const refreshFromServer = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;
    try {
      const me = await fetchAccountMe();
      setProfileState((prev) => {
        const next = mergeServerAccount(prev, me);
        latestStateRef.current = next;
        void saveUserProfile(next);
        return next;
      });
    } catch {
      // keep local profile
    }
    await refreshMyCards();
  }, [refreshMyCards]);

  const applyAuthUser = useCallback((user: AuthUser) => {
    setProfileState((prev) => {
      const next = mergeAuthUserIntoProfile(prev, user);
      latestStateRef.current = next;
      void saveUserProfile(next);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = await loadUserProfile();
      if (!cancelled) {
        latestStateRef.current = local;
        setProfileState(local);
      }
      const token = await getAccessToken();
      if (!token) {
        if (!cancelled) setHydrated(true);
        return;
      }
      try {
        const me = await fetchAccountMe();
        if (cancelled) return;
        setProfileState((prev) => {
          const next = mergeServerAccount(prev, me);
          latestStateRef.current = next;
          void saveUserProfile(next);
          return next;
        });
      } catch {
        // signed in but API unreachable — keep AsyncStorage profile
      }
      if (!cancelled) setCardsLoading(true);
      try {
        const list = await fetchMyCardsAsUserNfcCards();
        if (!cancelled) setMyCards(list);
      } catch {
        if (!cancelled) setMyCards([]);
      } finally {
        if (!cancelled) setCardsLoading(false);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const colors = useMemo(() => deriveTheme(profile.colorMode, profile.accentHex), [profile.accentHex, profile.colorMode]);

  const value = useMemo<UserProfileContextValue>(
    () => ({
      hydrated,
      profile,
      myCards,
      cardsLoading,
      colors,
      setProfile,
      replaceProfile,
      setColorMode,
      setAccentHex,
      resetProfileStorage,
      refreshMyCards,
      refreshFromServer,
      applyAuthUser,
    }),
    [
      cardsLoading,
      colors,
      hydrated,
      myCards,
      profile,
      applyAuthUser,
      refreshFromServer,
      refreshMyCards,
      replaceProfile,
      setAccentHex,
      setColorMode,
      setProfile,
      resetProfileStorage,
    ],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return ctx;
}

export function useUserProfileOptional(): UserProfileContextValue | null {
  return useContext(UserProfileContext);
}
