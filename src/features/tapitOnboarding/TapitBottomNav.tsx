import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTapitOnboardingTheme } from './TapitOnboardingThemeContext';

export const TAPIT_TABS = ['home', 'profile'] as const;
export type TapitTab = (typeof TAPIT_TABS)[number];

type Props = {
  active: TapitTab;
  onChange: (tab: TapitTab) => void;
};

export function TapitBottomNav({ active, onChange }: Props) {
  const { u } = useAppPreferences();
  const tabLabel: Record<TapitTab, string> = useMemo(
    () => ({
      home: u.onboarding.navTabHome,
      profile: u.onboarding.navTabProfile,
    }),
    [u],
  );
  const T = useTapitOnboardingTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        segmentRow: {
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingTop: 8,
          gap: 4,
          backgroundColor: T.barBg,
        },
        segment: {
          flex: 1,
          height: 3,
          borderRadius: 2,
          backgroundColor: T.dotInactive,
        },
        segmentOn: {
          backgroundColor: T.text,
          shadowColor: T.text,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.45,
          shadowRadius: 6,
        },
        bar: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 6,
          paddingTop: 10,
          paddingBottom: 8,
          backgroundColor: T.barBg,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: T.border,
        },
        item: {
          flex: 1,
          alignItems: 'center',
          minWidth: 0,
        },
        activeDot: {
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: T.text,
          marginBottom: 4,
        },
        dotSpacer: {
          height: 9,
          marginBottom: 0,
        },
        labelBox: {
          paddingHorizontal: 2,
          paddingVertical: 2,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: 'transparent',
        },
        labelBoxActive: {
          borderColor: T.iosYellow,
        },
        label: {
          fontSize: 10,
          fontWeight: '500',
          color: T.muted,
          textTransform: 'lowercase',
        },
        labelActive: {
          color: T.text,
          fontWeight: '700',
        },
      }),
    [T],
  );

  const activeIndex = TAPIT_TABS.indexOf(active);

  return (
    <View>
      <View style={styles.segmentRow}>
        {TAPIT_TABS.map((tab, i) => (
          <View key={tab} style={[styles.segment, i === activeIndex && styles.segmentOn]} />
        ))}
      </View>
      <View style={styles.bar}>
        {TAPIT_TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <Pressable
              key={tab}
              onPress={() => onChange(tab)}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              {isActive ? <View style={styles.activeDot} /> : <View style={styles.dotSpacer} />}
              <View style={[styles.labelBox, isActive && styles.labelBoxActive]}>
                <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
                  {tabLabel[tab]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
