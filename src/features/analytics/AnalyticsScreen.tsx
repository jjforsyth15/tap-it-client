import {
  MOCK_ANALYTICS_BY_PERIOD,
  type AnalyticsPeriod,
  type TapPoint,
} from '@/src/constants/mockAnalyticsPageData';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import type { AppThemeColors, ColorMode } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import type { MainTabKey } from '@/src/i18n/ui/types';
import { mainTabIsActive } from '@/src/navigation/mainTabNav';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function paramToString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return undefined;
}

function TapBarChart({
  points,
  maxHeight,
  barColor,
  mutedColor,
  scroll,
  barWidth = 10,
  emptyRangeLabel,
}: {
  points: TapPoint[];
  maxHeight: number;
  barColor: string;
  mutedColor: string;
  scroll?: boolean;
  barWidth?: number;
  emptyRangeLabel: string;
}) {
  if (!points.length) {
    return (
      <Text style={{ color: mutedColor, fontSize: 13, paddingVertical: 12 }}>{emptyRangeLabel}</Text>
    );
  }
  const max = Math.max(...points.map((p) => p.value), 1);
  const innerHeight = maxHeight - 4;

  const bars = (
    <View style={[stylesChart.barRow, scroll && { width: points.length * (barWidth + 4) + 8 }]}>
      {points.map((p, i) => {
        const h = (p.value / max) * innerHeight;
        return (
          <View
            key={`bar-${p.label}-${i}`}
            style={[stylesChart.barCell, scroll ? { width: barWidth } : { flex: 1 }]}
          >
            <View
              style={[
                stylesChart.barFill,
                {
                  width: scroll ? barWidth : '75%',
                  height: Math.max(p.value > 0 ? h : 0, p.value > 0 ? 3 : 0),
                  backgroundColor: barColor,
                  opacity: p.value === 0 ? 0.2 : 1,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );

  const labelEvery = scroll ? 5 : points.length > 20 ? 4 : points.length > 10 ? 2 : 1;

  const labels = (
    <View style={[stylesChart.labelRow, scroll && { width: points.length * (barWidth + 4) + 8 }]}>
      {points.map((p, i) => {
        const show = i % labelEvery === 0 || i === points.length - 1;
        return (
          <View
            key={`lab-${p.label}-${i}`}
            style={[stylesChart.labelCell, scroll ? { width: barWidth } : { flex: 1 }]}
          >
            <Text style={[stylesChart.labelText, { color: mutedColor }]} numberOfLines={1}>
              {show ? p.label : ' '}
            </Text>
          </View>
        );
      })}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={stylesChart.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <View style={{ height: maxHeight }}>{bars}</View>
          {labels}
        </View>
      </ScrollView>
    );
  }

  return (
    <View>
      <View style={{ height: maxHeight }}>{bars}</View>
      {labels}
    </View>
  );
}

const stylesChart = StyleSheet.create({
  scrollContent: { paddingRight: 8 },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    gap: 4,
    paddingHorizontal: 2,
  },
  barCell: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barFill: {
    borderRadius: 4,
    minHeight: 0,
  },
  labelRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 4,
    paddingHorizontal: 2,
  },
  labelCell: {
    alignItems: 'center',
  },
  labelText: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
});

function createStyles(c: AppThemeColors, colorMode: ColorMode) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg, position: 'relative' as const },
    guestRibbon: {
      backgroundColor: c.surface,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    guestRibbonText: { fontSize: 12, fontWeight: '600', color: c.muted, textAlign: 'center' },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 8,
      marginBottom: 4,
    },
    backText: { fontSize: 16, fontWeight: '600', color: c.text },
    title: { fontSize: 26, fontWeight: '800', color: c.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: c.muted, lineHeight: 20, marginBottom: 18 },
    periodRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 20,
    },
    periodPill: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    periodPillOn: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    periodPillText: { fontSize: 14, fontWeight: '600', color: c.text },
    periodPillTextOn: { color: c.onAccent },
    heroCard: {
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 20,
      marginBottom: 20,
    },
    heroLabel: { fontSize: 12, fontWeight: '700', color: c.muted, textTransform: 'uppercase', marginBottom: 8 },
    heroValue: { fontSize: 42, fontWeight: '800', color: c.text, letterSpacing: -1 },
    heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' },
    heroRange: { fontSize: 14, color: c.muted },
    changePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    changeUp: { backgroundColor: colorMode === 'light' ? '#dcfce7' : 'rgba(74, 222, 128, 0.15)' },
    changeDown: { backgroundColor: colorMode === 'light' ? '#fee2e2' : 'rgba(248, 113, 113, 0.15)' },
    changeText: { fontSize: 13, fontWeight: '700' },
    changeUpText: { color: colorMode === 'light' ? '#15803d' : '#4ade80' },
    changeDownText: { color: colorMode === 'light' ? '#b91c1c' : '#f87171' },
    chartCard: {
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 16,
    },
    chartTitle: { fontSize: 16, fontWeight: '700', color: c.text, marginBottom: 4 },
    chartHint: { fontSize: 12, color: c.muted, marginBottom: 16, lineHeight: 17 },
    statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
    statMini: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colorMode === 'light' ? c.bg : c.surface2,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: c.border,
    },
    statMiniLabel: { fontSize: 11, fontWeight: '600', color: c.muted, marginBottom: 6, textTransform: 'uppercase' },
    statMiniValue: { fontSize: 20, fontWeight: '800', color: c.text },
    statMiniSub: { fontSize: 12, color: c.muted, marginTop: 4 },
    bottomNav: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      paddingTop: 10,
      backgroundColor: c.bottomNavBg,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    tabItem: { alignItems: 'center', gap: 4, minWidth: 56 },
    tabLabel: { fontSize: 10, color: c.muted, fontWeight: '500' },
    tabLabelActive: { color: c.text, fontWeight: '700' },
  });
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const raw = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const guestRaw = (paramToString(raw.guest) || '').toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';

  const { u } = useAppPreferences();
  const { profile, colors } = useUserProfile();
  const [period, setPeriod] = useState<AnalyticsPeriod>('week');

  const periods = useMemo(
    () =>
      [
        { id: 'day' as const, label: u.analytics.periodDay },
        { id: 'week' as const, label: u.analytics.periodWeek },
        { id: 'month' as const, label: u.analytics.periodMonth },
      ] as const,
    [u],
  );

  const journeyParams = useMemo(() => {
    const p: Record<string, string> = {};
    const g = paramToString(raw.guest);
    const d = isGuest ? paramToString(raw.displayName) : profile.displayName;
    if (g) p.guest = g;
    if (d) p.displayName = d;
    return p;
  }, [raw.guest, raw.displayName, isGuest, profile.displayName]);

  const bundle = MOCK_ANALYTICS_BY_PERIOD[period];
  const styles = useMemo(() => createStyles(colors, profile.colorMode), [colors, profile.colorMode]);

  const goHome = () => {
    router.replace({ pathname: '/home', params: journeyParams });
  };

  const onTabPress = (key: MainTabKey) => {
    if (key === 'home') {
      router.replace({ pathname: '/home', params: journeyParams });
      return;
    }
    if (key === 'cards') {
      router.push({ pathname: '/my-cards', params: journeyParams });
      return;
    }
    if (key === 'analytics') {
      router.replace({ pathname: '/analytics', params: journeyParams });
      return;
    }
    if (key === 'shop') {
      router.replace({ pathname: '/shop', params: journeyParams });
      return;
    }
    if (key === 'profile') {
      router.replace({ pathname: '/profile', params: journeyParams });
      return;
    }
  };

  const tabActive = (key: MainTabKey) => mainTabIsActive(pathname, segments, key);

  const primaryScroll = period === 'month';
  const primaryTitle =
    period === 'day'
      ? u.analytics.chartPrimaryDay
      : period === 'week'
        ? u.analytics.chartPrimaryWeek
        : u.analytics.chartPrimaryMonth;

  const rangeLabel =
    period === 'day'
      ? u.analytics.rangeLast24h
      : period === 'week'
        ? u.analytics.rangeLast7d
        : u.analytics.rangeLast30d;

  const peakLabelUi =
    period === 'day'
      ? u.analytics.peakBusiestHour
      : period === 'week'
        ? u.analytics.peakBusiestDay
        : u.analytics.peakBestDay;

  const avgLabelUi =
    period === 'day' ? u.analytics.avgPerActiveHour : u.analytics.avgDaily;

  const secondaryTitleUi =
    period === 'day'
      ? u.analytics.secondaryDay
      : period === 'week'
        ? u.analytics.secondaryWeek
        : u.analytics.secondaryMonth;

  const priorWord =
    period === 'day' ? u.analytics.priorDay : period === 'week' ? u.analytics.priorWeek : u.analytics.priorMonth;

  return (
    <SafeAreaView style={[styles.root, { paddingTop: insets.top }]} edges={['top', 'left', 'right']}>
      {isGuest ? (
        <View style={styles.guestRibbon}>
          <Text style={styles.guestRibbonText}>{u.common.guestRibbon}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={goHome}
        style={({ pressed }) => [styles.topBar, pressed && { opacity: 0.75 }]}
        accessibilityRole="button"
        accessibilityLabel={u.analytics.backA11y}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={styles.backText}>{u.analytics.backLabel}</Text>
      </Pressable>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 110 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <Text style={styles.title}>{u.analytics.title}</Text>
        <Text style={styles.subtitle}>{u.analytics.subtitle}</Text>

        <View style={styles.periodRow}>
          {periods.map((p) => {
            const on = period === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPeriod(p.id)}
                style={[styles.periodPill, on && styles.periodPillOn]}
              >
                <Text style={[styles.periodPillText, on && styles.periodPillTextOn]}>{p.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>{u.analytics.totalTaps}</Text>
          <Text style={styles.heroValue}>{bundle.totalTaps.toLocaleString()}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroRange}>{rangeLabel}</Text>
            <View
              style={[
                styles.changePill,
                bundle.changeDirection === 'up' ? styles.changeUp : styles.changeDown,
              ]}
            >
              <Ionicons
                name={bundle.changeDirection === 'up' ? 'trending-up' : 'trending-down'}
                size={16}
                color={bundle.changeDirection === 'up' ? colors.accent : '#f87171'}
              />
              <Text
                style={[
                  styles.changeText,
                  bundle.changeDirection === 'up' ? styles.changeUpText : styles.changeDownText,
                ]}
              >
                {bundle.changeDirection === 'up' ? '+' : '-'}
                {Math.abs(bundle.changePct)}
                {u.analytics.changeVsPrior} {priorWord}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statMini}>
            <Text style={styles.statMiniLabel}>{peakLabelUi}</Text>
            <Text style={styles.statMiniValue}>{bundle.peakValue.toLocaleString()}</Text>
            <Text style={styles.statMiniSub}>{u.analytics.tapsSuffix}</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statMiniLabel}>{avgLabelUi}</Text>
            <Text style={styles.statMiniValue} numberOfLines={2}>
              {bundle.avgValue}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{primaryTitle}</Text>
          <Text style={styles.chartHint}>{u.analytics.chartHintPrimary}</Text>
          <TapBarChart
            points={bundle.primarySeries}
            maxHeight={168}
            barColor={colors.accent}
            mutedColor={colors.muted}
            scroll={primaryScroll}
            barWidth={9}
            emptyRangeLabel={u.analytics.emptyRange}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{secondaryTitleUi}</Text>
          <Text style={styles.chartHint}>{u.analytics.chartHintSecondary}</Text>
          <TapBarChart
            points={bundle.secondarySeries}
            maxHeight={120}
            barColor={profile.colorMode === 'light' ? '#6366f1' : '#818cf8'}
            mutedColor={colors.muted}
            scroll={bundle.secondarySeries.length > 8}
            barWidth={12}
            emptyRangeLabel={u.analytics.emptyRange}
          />
        </View>
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {(
          [
            { icon: 'home-outline' as const, key: 'home' as const },
            { icon: 'card-outline' as const, key: 'cards' as const },
            { icon: 'stats-chart-outline' as const, key: 'analytics' as const },
            { icon: 'bag-outline' as const, key: 'shop' as const },
            { icon: 'person-outline' as const, key: 'profile' as const },
          ] as const
        ).map((tab) => {
          const active = tabActive(tab.key);
          return (
            <Pressable key={tab.key} style={styles.tabItem} onPress={() => onTabPress(tab.key)}>
              <Ionicons name={tab.icon} size={22} color={active ? colors.text : colors.muted} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{u.nav[tab.key]}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
