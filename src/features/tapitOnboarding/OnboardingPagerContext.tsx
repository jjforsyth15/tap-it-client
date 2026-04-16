import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { createContext, useContext } from 'react';

export type OnboardingPagerApi = {
  scrollX: SharedValue<number>;
  pageWidth: number;
};

const OnboardingPagerContext = createContext<OnboardingPagerApi | null>(null);

export function OnboardingPagerProvider({
  value,
  children,
}: {
  value: OnboardingPagerApi;
  children: ReactNode;
}) {
  return <OnboardingPagerContext.Provider value={value}>{children}</OnboardingPagerContext.Provider>;
}

export function useOnboardingPager(): OnboardingPagerApi {
  const ctx = useContext(OnboardingPagerContext);
  if (!ctx) {
    throw new Error('useOnboardingPager must be used within OnboardingPagerProvider');
  }
  return ctx;
}
