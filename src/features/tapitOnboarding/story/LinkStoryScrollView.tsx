import type { ReactNode } from 'react';
import { StyleSheet, type ScrollViewProps } from 'react-native';
import Animated, { useAnimatedRef, useScrollOffset } from 'react-native-reanimated';
import { StoryLinkScrollProvider } from './StoryLinkScrollContext';

type Props = Omit<ScrollViewProps, 'children'> & {
  children: ReactNode;
};

export function LinkStoryScrollView({ children, style, contentContainerStyle, ...rest }: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useScrollOffset(scrollRef);

  return (
    <StoryLinkScrollProvider scrollY={scrollY}>
      <Animated.ScrollView
        ref={scrollRef}
        style={[styles.flex, style]}
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        {...rest}
      >
        {children}
      </Animated.ScrollView>
    </StoryLinkScrollProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
