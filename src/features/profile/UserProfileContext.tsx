import { mergeAuthUserIntoProfile } from '@/src/features/account/accountProfileMap';
import type { AuthUser } from '@/src/features/auth/types';
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
  type CardProfile,
  type ColorMode,
  type UserNfcCard,
  type UserProfileState,
} from '@/src/features/profile/profileTypes';
import { clearUserProfile, loadUserProfile, saveUserProfile, loadCardProfiles, saveCardProfiles } from '@/src/features/profile/profileStorage';

type UserProfileContextValue = {
  hydrated: boolean;
  profile: UserProfileState;
  myCards: UserNfcCard[];
  cardProfiles: CardProfile[];
  cardsLoading: boolean;
  colors: AppThemeColors;
  setProfile: (patch: Partial<UserProfileState>) => void;
  replaceProfile: (next: UserProfileState) => void;
  setColorMode: (mode: ColorMode) => void;
  setAccentHex: (hex: string) => void;
  resetProfileStorage: () => Promise<void>;
  refreshMyCards: () => Promise<void>;
  refreshFromServer: () => Promise<void>;
  applyAuthUser: (user: AuthUser) => void;
  addCardProfile: (cp: CardProfile) => void;
  updateCardProfile: (id: string, patch: Partial<CardProfile>) => void;
  deleteCardProfile: (id: string) => void;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfileState] = useState<UserProfileState>(() => defaultUserProfile());
  const [myCards, setMyCards] = useState<UserNfcCard[]>([]);
  const [cardProfiles, setCardProfiles] = useState<CardProfile[]>([]);
  const cardsLoading = false;
  const latestStateRef = useRef<UserProfileState>(defaultUserProfile());

  const persist = useCallback(async (next: UserProfileState) => {
    await saveUserProfile(next);
  }, []);

  const setProfile = useCallback(
    (patch: Partial<UserProfileState>) => {
      setProfileState((prev) => {
        const next = { ...prev, ...patch };
        latestStateRef.current = next;
        void persist(next);
        return next;
      });
    },
    [persist],
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

  const addCardProfile = useCallback((cp: CardProfile) => {
    setCardProfiles((prev) => {
      const next = [...prev, cp];
      void saveCardProfiles(next);
      return next;
    });
  }, []);

  const updateCardProfile = useCallback((id: string, patch: Partial<CardProfile>) => {
    setCardProfiles((prev) => {
      const next = prev.map((cp) => (cp.id === id ? { ...cp, ...patch } : cp));
      void saveCardProfiles(next);
      return next;
    });
  }, []);

  const deleteCardProfile = useCallback((id: string) => {
    setCardProfiles((prev) => {
      const next = prev.filter((cp) => cp.id !== id);
      void saveCardProfiles(next);
      return next;
    });
  }, []);

  const resetProfileStorage = useCallback(async () => {
    await clearUserProfile();
    const fresh = await loadUserProfile();
    latestStateRef.current = fresh;
    setProfileState(fresh);
    setMyCards([]);
    setCardProfiles([]);
  }, []);

  const refreshMyCards = useCallback(async () => {
    setMyCards([]);
  }, []);

  const refreshFromServer = useCallback(async () => {
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
    void (async () => {
      const [local, savedCards] = await Promise.all([loadUserProfile(), loadCardProfiles()]);
      if (!cancelled) {
        latestStateRef.current = local;
        setProfileState(local);
        setCardProfiles(savedCards);
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
      cardProfiles,
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
      addCardProfile,
      updateCardProfile,
      deleteCardProfile,
    }),
    [
      cardProfiles,
      cardsLoading,
      colors,
      hydrated,
      myCards,
      profile,
      addCardProfile,
      updateCardProfile,
      deleteCardProfile,
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
