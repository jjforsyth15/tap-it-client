import type { ColorMode } from '@/src/features/profile/profileTypes';

/** Onboarding / card-journey palette (dark is the original Tapit look). */
export type TapitPalette = {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderSelected: string;
  text: string;
  muted: string;
  mutedCaps: string;
  green: string;
  greenBg: string;
  blue: string;
  iosYellow: string;
  /** Small UI accents that were hard-coded for dark mode */
  orbitBorder: string;
  orbitFill: string;
  nfcPillBg: string;
  dotInactive: string;
  barBg: string;
  demoArrow: string;
  miniCardBorder: string;
  miniCardFill: string;
  iconBoxMutedFill: string;
  trackDotPending: string;
  transitArrow: string;
  ctaLightGrayBg: string;
  ctaLightGrayText: string;
  createBtnShadow: string;
  primaryCtaIconCircleBg: string;
  /** High-contrast pill (create card, some CTAs): readable in both modes */
  primaryCtaBg: string;
  primaryCtaFg: string;
  primaryCtaCaption: string;
  primaryCtaIconTint: string;
};

const DARK: TapitPalette = {
  bg: '#000000',
  surface: '#1a1a1a',
  surfaceElevated: '#242424',
  border: '#2e2e2e',
  borderSelected: '#ffffff',
  text: '#ffffff',
  muted: '#8e8e93',
  mutedCaps: '#6b6b70',
  green: '#4ade80',
  greenBg: '#14532d',
  blue: '#3b82f6',
  iosYellow: '#f5e6a8',
  orbitBorder: '#3a3a3a',
  orbitFill: '#121212',
  nfcPillBg: '#2a2a2a',
  dotInactive: '#3a3a3a',
  barBg: '#0a0a0a',
  demoArrow: '#4a4a4a',
  miniCardBorder: '#4a4a4a',
  miniCardFill: '#121212',
  iconBoxMutedFill: '#2a2a2a',
  trackDotPending: '#4a4a4a',
  transitArrow: '#3a3a3a',
  ctaLightGrayBg: '#d4d4d4',
  ctaLightGrayText: '#0a0a0a',
  createBtnShadow: '#fff',
  primaryCtaIconCircleBg: 'rgba(10,10,10,0.08)',
  primaryCtaBg: '#ffffff',
  primaryCtaFg: '#0a0a0a',
  primaryCtaCaption: 'rgba(10,10,10,0.55)',
  primaryCtaIconTint: '#0a0a0a',
};

const LIGHT: TapitPalette = {
  bg: '#f4f4f5',
  surface: '#ffffff',
  surfaceElevated: '#e4e4e7',
  border: '#d4d4d8',
  borderSelected: '#0a0a0a',
  text: '#0a0a0a',
  muted: '#52525b',
  mutedCaps: '#71717a',
  green: '#15803d',
  greenBg: '#dcfce7',
  blue: '#2563eb',
  iosYellow: '#a16207',
  orbitBorder: '#d4d4d8',
  orbitFill: '#e4e4e7',
  nfcPillBg: '#e4e4e7',
  dotInactive: '#d4d4d8',
  barBg: '#ffffff',
  demoArrow: '#a1a1aa',
  miniCardBorder: '#d4d4d8',
  miniCardFill: '#e4e4e7',
  iconBoxMutedFill: '#e4e4e7',
  trackDotPending: '#d4d4d8',
  transitArrow: '#a1a1aa',
  ctaLightGrayBg: '#e4e4e7',
  ctaLightGrayText: '#0a0a0a',
  createBtnShadow: '#000',
  primaryCtaIconCircleBg: 'rgba(255,255,255,0.12)',
  primaryCtaBg: '#0a0a0a',
  primaryCtaFg: '#ffffff',
  primaryCtaCaption: 'rgba(255,255,255,0.65)',
  primaryCtaIconTint: '#ffffff',
};

export function tapitPalette(mode: ColorMode): TapitPalette {
  return mode === 'light' ? LIGHT : DARK;
}

/** Default dark tokens (e.g. admin screens). */
export const T: TapitPalette = DARK;

export const RADIUS = {
  card: 18,
  tile: 16,
  pill: 999,
} as const;
