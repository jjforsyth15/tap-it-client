import type { ColorMode } from '@/src/features/profile/profileTypes';
import React, { createContext, useContext, useMemo } from 'react';
import { tapitPalette, type TapitPalette } from './theme';

const TapitOnboardingThemeContext = createContext<TapitPalette | null>(null);

export function TapitOnboardingThemeProvider({
  colorMode,
  children,
}: {
  colorMode: ColorMode;
  children: React.ReactNode;
}) {
  const palette = useMemo(() => tapitPalette(colorMode), [colorMode]);
  return (
    <TapitOnboardingThemeContext.Provider value={palette}>{children}</TapitOnboardingThemeContext.Provider>
  );
}

export function useTapitOnboardingTheme(): TapitPalette {
  const ctx = useContext(TapitOnboardingThemeContext);
  if (!ctx) {
    throw new Error('useTapitOnboardingTheme must be used within TapitOnboardingThemeProvider');
  }
  return ctx;
}
