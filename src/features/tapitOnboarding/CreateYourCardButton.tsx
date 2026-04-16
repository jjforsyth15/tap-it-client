import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useTapitOnboardingTheme } from './TapitOnboardingThemeContext';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function CreateYourCardButton({ onPress, disabled }: Props) {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        outer: {
          borderRadius: 20,
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: T.createBtnShadow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
            },
            android: { elevation: 6 },
          }),
        },
        outerPressed: {
          opacity: 0.92,
          transform: [{ scale: 0.99 }],
        },
        outerDisabled: {
          opacity: 0.5,
        },
        inner: {
          backgroundColor: T.primaryCtaBg,
          borderRadius: 20,
          paddingVertical: 18,
          paddingHorizontal: 18,
          position: 'relative',
          overflow: 'hidden',
        },
        glow: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(128,128,128,0.08)',
          opacity: 0.5,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        },
        iconCircle: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: T.primaryCtaIconCircleBg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        textCol: {
          flex: 1,
          gap: 2,
        },
        title: {
          fontSize: 17,
          fontWeight: '800',
          color: T.primaryCtaFg,
          letterSpacing: 0.2,
        },
        caption: {
          fontSize: 12,
          fontWeight: '500',
          color: T.primaryCtaCaption,
        },
      }),
    [T],
  );

  const handlePress = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.outer,
        pressed && styles.outerPressed,
        disabled && styles.outerDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={o.createYourCardA11y}
    >
      <View style={styles.inner}>
        <View style={styles.glow} />
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Ionicons name="card" size={22} color={T.primaryCtaIconTint} />
          </View>
          <View style={styles.textCol}>
            <Text style={styles.title}>{o.createYourCardTitle}</Text>
            <Text style={styles.caption}>{o.createYourCardCaption}</Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color={T.primaryCtaIconTint} />
        </View>
      </View>
    </Pressable>
  );
}
