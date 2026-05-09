import { MOCK_LOGIN_USERNAME, MOCK_USER_DISPLAY_NAME } from '@/src/constants/mockAuth';

export type ColorMode = 'light' | 'dark';

export type AppThemeColors = {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  bottomNavBg: string;
};

const DEFAULT_ACCENT = '#6366f1';

/** Preset accent swatches for theme customization (Profile & Settings). */
export const ACCENT_COLOR_PRESETS = [
  '#6366f1',
  '#22c55e',
  '#f97316',
  '#ec4899',
  '#0ea5e9',
  '#a855f7',
  '#ef4444',
  '#14b8a6',
  '#eab308',
  '#d946ef',
  '#84cc16',
  '#f43f5e',
] as const;

export function deriveTheme(mode: ColorMode, accentHex: string): AppThemeColors {
  const accent = /^#[0-9A-Fa-f]{6}$/.test(accentHex) ? accentHex : DEFAULT_ACCENT;
  if (mode === 'light') {
    return {
      bg: '#f4f4f5',
      surface: '#ffffff',
      surface2: '#e4e4e7',
      border: '#d4d4d8',
      text: '#0a0a0a',
      muted: '#52525b',
      accent,
      onAccent: '#ffffff',
      bottomNavBg: '#ffffff',
    };
  }
  return {
    bg: '#0f0f12',
    surface: '#18181c',
    surface2: '#141418',
    border: '#2a2a30',
    text: '#e4e4e7',
    muted: '#a1a1aa',
    accent,
    onAccent: '#ffffff',
    bottomNavBg: '#141418',
  };
}

/** NFC cards the user has ordered or saved locally (shown on Home and My cards). */
export type UserNfcCard = {
  id: string;
  title: string;
  variant: 'light' | 'dark';
};

export type UserProfileState = {
  displayName: string;
  /** Login identifier — shown read-only; not editable in profile UI */
  loginUsername: string;
  email: string;
  phone: string;
  bio: string;
  profileImageUri: string | null;
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;
  socialLinkedin: string;
  memberSinceIso: string;
  accentHex: string;
  colorMode: ColorMode;
  securityQ1Id: string | null;
  securityQ2Id: string | null;
  securityQ3Id: string | null;
  securityA1: string;
  securityA2: string;
  securityA3: string;
  accountStatus: 'active' | 'disabled';
};

export function defaultUserProfile(): UserProfileState {
  const now = new Date().toISOString();
  return {
    displayName: MOCK_USER_DISPLAY_NAME,
    loginUsername: MOCK_LOGIN_USERNAME,
    email: 'alex@example.com',
    phone: '',
    bio: '',
    profileImageUri: null,
    socialInstagram: '',
    socialTwitter: '',
    socialFacebook: '',
    socialLinkedin: '',
    memberSinceIso: now,
    accentHex: DEFAULT_ACCENT,
    colorMode: 'light',
    securityQ1Id: null,
    securityQ2Id: null,
    securityQ3Id: null,
    securityA1: '',
    securityA2: '',
    securityA3: '',
    accountStatus: 'active',
  };
}

export const PROFILE_STORAGE_KEY = '@tap_it/user_profile_v1';

export const BIO_MAX_WORDS = 200;

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
