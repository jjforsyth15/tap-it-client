import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

const StoryLinkScrollContext = createContext<SharedValue<number> | null>(null);

export function StoryLinkScrollProvider({
  scrollY,
  children,
}: {
  scrollY: SharedValue<number>;
  children: ReactNode;
}) {
  return <StoryLinkScrollContext.Provider value={scrollY}>{children}</StoryLinkScrollContext.Provider>;
}

export function useStoryLinkScroll(): SharedValue<number> {
  const ctx = useContext(StoryLinkScrollContext);
  if (!ctx) {
    throw new Error('useStoryLinkScroll must be used inside LinkStoryScrollView');
  }
  return ctx;
}
