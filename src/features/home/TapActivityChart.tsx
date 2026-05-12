import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import type { AppThemeColors } from '@/src/features/profile/profileTypes';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type TapActivityRange = 'day' | 'week' | 'month' | 'year';

type Props = {
  colors: AppThemeColors;
  /** Optional bucket counts from analytics API; omit or empty → zero-height bars. */
  tapBuckets?: number[] | null;
};

type RangeConfig = {
  key: TapActivityRange;
  bucketCount: number;
  labels: string[];
};

function dayPartLabels(): string[] {
  return ['12a', '4a', '8a', '12p', '4p', '8p'];
}

function weekdayNarrowLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  const start = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return fmt.format(d);
  });
}

/** Four segments across a month (axis only — not tap data). */
function monthSegmentLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });
  return [0, 3, 6, 9].map((m) => fmt.format(new Date(2024, m, 1)));
}

function yearMonthLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });
  return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(2024, m, 1)));
}

function buildRangeConfig(range: TapActivityRange, locale: string): RangeConfig {
  switch (range) {
    case 'day':
      return { key: 'day', bucketCount: 6, labels: dayPartLabels() };
    case 'week':
      return { key: 'week', bucketCount: 7, labels: weekdayNarrowLabels(locale) };
    case 'month':
      return { key: 'month', bucketCount: 4, labels: monthSegmentLabels(locale) };
    case 'year':
      return { key: 'year', bucketCount: 12, labels: yearMonthLabels(locale) };
  }
}

function normalizeBuckets(raw: number[] | null | undefined, n: number): number[] {
  if (!raw?.length) return Array.from({ length: n }, () => 0);
  if (raw.length === n) return raw.map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  if (raw.length > n) return raw.slice(0, n).map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  const next = [...raw.map((v) => (Number.isFinite(v) && v > 0 ? v : 0))];
  while (next.length < n) next.push(0);
  return next;
}

const CHART_PLOT_H = 120;

export function TapActivityChart({ colors, tapBuckets }: Props) {
  const { u, preferences } = useAppPreferences();
  const h = u.home;
  const [range, setRange] = useState<TapActivityRange>('week');

  const meta = useMemo(
    () => buildRangeConfig(range, preferences.locale),
    [range, preferences.locale],
  );

  const values = useMemo(
    () => normalizeBuckets(tapBuckets ?? null, meta.bucketCount),
    [tapBuckets, meta.bucketCount],
  );

  const total = useMemo(() => values.reduce((a, b) => a + b, 0), [values]);
  const maxVal = useMemo(() => Math.max(1, ...values), [values]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          marginTop: 8,
          marginBottom: 8,
        },
        title: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 4 },
        hint: { fontSize: 13, color: colors.muted, lineHeight: 18, marginBottom: 14 },
        segmentRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16,
        },
        segment: {
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        segmentOn: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        segmentLabel: { fontSize: 13, fontWeight: '600', color: colors.text, textTransform: 'lowercase' },
        segmentLabelOn: { color: colors.onAccent },
        card: {
          backgroundColor: colors.surface,
          borderRadius: 14,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          padding: 16,
        },
        totalRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 12,
        },
        totalLabel: { fontSize: 13, fontWeight: '600', color: colors.muted, textTransform: 'lowercase' },
        totalValue: { fontSize: 22, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
        plotWrap: {
          height: CHART_PLOT_H,
          position: 'relative',
          marginBottom: 4,
        },
        gridLine: {
          position: 'absolute',
          left: 0,
          right: 0,
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
        },
        barsRow: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 4,
        },
        barTrack: {
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        },
        bar: {
          width: '100%',
          maxWidth: 28,
          borderRadius: 6,
        },
        xLabelsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 4,
          paddingTop: 6,
        },
        xLabelCell: { flex: 1, alignItems: 'center' },
        xLabel: {
          fontSize: 10,
          fontWeight: '600',
          color: colors.muted,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  const ranges: { key: TapActivityRange; label: string }[] = [
    { key: 'day', label: h.tapRangeDay },
    { key: 'week', label: h.tapRangeWeek },
    { key: 'month', label: h.tapRangeMonth },
    { key: 'year', label: h.tapRangeYear },
  ];

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{h.tapActivityTitle}</Text>
      <Text style={styles.hint}>{h.tapActivityHint}</Text>

      <View style={styles.segmentRow}>
        {ranges.map((r) => {
          const on = r.key === range;
          return (
            <Pressable
              key={r.key}
              onPress={() => setRange(r.key)}
              style={({ pressed }) => [styles.segment, on && styles.segmentOn, pressed && { opacity: 0.88 }]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.segmentLabel, on && styles.segmentLabelOn]}>{r.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{h.tapTotalTaps}</Text>
          <Text style={styles.totalValue}>{total}</Text>
        </View>

        <View style={styles.plotWrap}>
          {[0.25, 0.5, 0.75].map((t) => (
            <View
              key={t}
              style={[styles.gridLine, { top: CHART_PLOT_H * t }]}
              pointerEvents="none"
            />
          ))}
          <View style={styles.barsRow}>
            {values.map((v, i) => {
              const hPx = (v / maxVal) * CHART_PLOT_H;
              return (
                <View key={`${meta.key}-${String(i)}`} style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(0, hPx),
                        backgroundColor: v > 0 ? colors.accent : `${colors.muted}33`,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.xLabelsRow}>
          {meta.labels.map((label, i) => (
            <View key={`${meta.key}-xl-${String(i)}`} style={styles.xLabelCell}>
              <Text style={styles.xLabel} numberOfLines={1}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
