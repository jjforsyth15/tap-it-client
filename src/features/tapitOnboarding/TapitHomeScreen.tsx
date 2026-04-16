import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useUserProfileOptional } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingPagerProvider } from './OnboardingPagerContext';
import { LinkStoryScrollView } from './story/LinkStoryScrollView';
import {
  StoryPageChooseLink,
  StoryPageEmbed,
  StoryPageServer,
  StoryPageShip,
  StoryPageTry,
} from './story/NfcOnboardingPages';
import { TapitBottomNav, TAPIT_TABS, type TapitTab } from './TapitBottomNav';
import { TapitOnboardingThemeProvider, useTapitOnboardingTheme } from './TapitOnboardingThemeContext';
import type { TapitPalette } from './theme';

function parseParam(v: string | string[] | undefined): string {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return '';
}

type TapitHomeScreenProps = {
  /** When set, shows a bar to return to the main dashboard (e.g. from /card-journey). */
  showExitToDashboard?: boolean;
  onExitToDashboard?: () => void;
};

type PageRow = { key: TapitTab };

function SwipeForNextHint({ visible, T, swipeForNext }: { visible: boolean; T: TapitPalette; swipeForNext: string }) {
  const nudge = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      cancelAnimation(nudge);
      nudge.value = 0;
      return;
    }
    nudge.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 650, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 650, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(nudge);
    };
  }, [visible, nudge]);

  const chevronsStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: nudge.value }],
  }));

  if (!visible) {
    return null;
  }

  return (
    <View style={swipeHintStyles.row} pointerEvents="none">
      <Text style={[swipeHintStyles.label, { color: T.muted }]}>{swipeForNext}</Text>
      <Animated.View style={[swipeHintStyles.chevrons, chevronsStyle]}>
        <Ionicons name="chevron-forward" size={15} color={T.muted} />
        <Ionicons name="chevron-forward" size={15} color={T.muted} style={{ marginLeft: -11 }} />
      </Animated.View>
    </View>
  );
}

const swipeHintStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
    paddingBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'lowercase',
  },
  chevrons: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.9,
  },
});

function PagerPage({
  children,
  index,
  scrollX,
  width,
}: {
  children: React.ReactNode;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const t = (scrollX.value - index * width) / width;
    const scale = interpolate(t, [-1, 0, 1], [0.9, 1, 0.9], Extrapolation.CLAMP);
    const opacity = interpolate(t, [-1, 0, 1], [0.52, 1, 0.52], Extrapolation.CLAMP);
    const translateY = interpolate(t, [-1, 0, 1], [20, 0, 20], Extrapolation.CLAMP);
    const rotateZ = interpolate(t, [-1, 0, 1], [3.2, 0, -3.2], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ scale }, { translateY }, { rotateZ: `${rotateZ}deg` }],
    };
  });

  return (
    <Animated.View style={[{ width }, animatedStyle]} collapsable={false}>
      {children}
    </Animated.View>
  );
}

function TapitHomeScreenInner({ showExitToDashboard = false, onExitToDashboard }: TapitHomeScreenProps) {
  const { u } = useAppPreferences();
  const T = useTapitOnboardingTheme();
  const insets = useSafeAreaInsets();
  const { width: pageWidth } = useWindowDimensions();
  const params = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const [activeTab, setActiveTab] = useState<TapitTab>('link');
  const scrollX = useSharedValue(0);
  const listRef = useRef<FlatList<PageRow> | null>(null);

  const guestRaw = parseParam(params.guest).toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';

  const data = useMemo<PageRow[]>(() => TAPIT_TABS.map((tab) => ({ key: tab })), []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: T.bg,
        },
        guestRibbon: {
          backgroundColor: T.surface,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: T.border,
        },
        guestRibbonText: {
          fontSize: 12,
          fontWeight: '600',
          color: T.muted,
          textAlign: 'center',
        },
        exitBar: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: T.border,
        },
        exitBarText: {
          fontSize: 16,
          fontWeight: '600',
          color: T.text,
        },
        listWrap: {
          flex: 1,
        },
        pageScroll: {
          flex: 1,
        },
        pageScrollContent: {
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 12,
        },
      }),
    [T],
  );

  const lastPagerIndex = useRef(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / pageWidth);
      const tab = TAPIT_TABS[idx];
      if (!tab) return;
      setActiveTab(tab);
      if (idx !== lastPagerIndex.current) {
        lastPagerIndex.current = idx;
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          void Haptics.selectionAsync();
        }
      }
    },
    [pageWidth],
  );

  const onTabFromNav = useCallback((tab: TapitTab) => {
    setActiveTab(tab);
    const idx = TAPIT_TABS.indexOf(tab);
    lastPagerIndex.current = idx;
    listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0 });
  }, []);

  const renderItem = useCallback(
    ({ index }: { index: number }) => {
      const scrollContent = [styles.pageScrollContent, { paddingBottom: 24 + insets.bottom }];
      const page = (
        <PagerPage index={index} scrollX={scrollX} width={pageWidth}>
          {index === 0 ? (
            <LinkStoryScrollView style={styles.pageScroll} contentContainerStyle={scrollContent}>
              <StoryPageChooseLink />
            </LinkStoryScrollView>
          ) : (
            <ScrollView
              style={styles.pageScroll}
              contentContainerStyle={scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {index === 1 ? <StoryPageServer /> : null}
              {index === 2 ? <StoryPageEmbed /> : null}
              {index === 3 ? <StoryPageShip /> : null}
              {index === 4 ? <StoryPageTry onGoToShop={() => router.push('/shop')} /> : null}
            </ScrollView>
          )}
        </PagerPage>
      );
      return page;
    },
    [insets.bottom, pageWidth, scrollX, styles.pageScroll, styles.pageScrollContent],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<PageRow> | null | undefined, index: number) => ({
      length: pageWidth,
      offset: pageWidth * index,
      index,
    }),
    [pageWidth],
  );

  return (
    <SafeAreaView style={[styles.root, { paddingTop: insets.top }]} edges={['top']}>
      {isGuest ? (
        <View style={styles.guestRibbon}>
          <Text style={styles.guestRibbonText}>{u.common.guestRibbon}</Text>
        </View>
      ) : null}
      {showExitToDashboard && onExitToDashboard ? (
        <Pressable
          onPress={onExitToDashboard}
          style={({ pressed }) => [styles.exitBar, pressed && { opacity: 0.75 }]}
          accessibilityRole="button"
          accessibilityLabel={u.onboarding.exitBarA11y}
        >
          <Ionicons name="chevron-back" size={22} color={T.text} />
          <Text style={styles.exitBarText}>{u.onboarding.exitHome}</Text>
        </Pressable>
      ) : null}
      <OnboardingPagerProvider value={{ scrollX, pageWidth }}>
        <View style={styles.listWrap}>
          <Animated.FlatList
            ref={listRef}
            data={data}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={getItemLayout}
            initialNumToRender={5}
            windowSize={5}
            decelerationRate="fast"
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((r) => setTimeout(r, 100));
              void wait.then(() => {
                listRef.current?.scrollToIndex({ index: info.index, animated: false });
              });
            }}
          />
        </View>
      </OnboardingPagerProvider>
      <View style={{ paddingBottom: insets.bottom }}>
        <SwipeForNextHint
          visible={TAPIT_TABS.indexOf(activeTab) < TAPIT_TABS.length - 1}
          T={T}
          swipeForNext={u.onboarding.swipeForNext}
        />
        <TapitBottomNav active={activeTab} onChange={onTabFromNav} />
      </View>
    </SafeAreaView>
  );
}

export function TapitHomeScreen(props: TapitHomeScreenProps) {
  const profile = useUserProfileOptional();
  const colorMode = profile?.profile.colorMode ?? 'dark';
  return (
    <TapitOnboardingThemeProvider colorMode={colorMode}>
      <TapitHomeScreenInner {...props} />
    </TapitOnboardingThemeProvider>
  );
}
