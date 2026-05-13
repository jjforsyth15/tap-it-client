import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTapitOnboardingTheme } from './TapitOnboardingThemeContext';

type Props = {
  subtitle: string;
};

export function TapitPageHeader({ subtitle }: Props) {
  const T = useTapitOnboardingTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          marginBottom: 22,
        },
        brand: {
          fontSize: 28,
          fontWeight: '800',
          letterSpacing: 2,
          color: T.text,
        },
        subtitle: {
          marginTop: 6,
          fontSize: 15,
          fontWeight: '400',
          color: T.muted,
          textTransform: 'lowercase',
        },
      }),
    [T],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>TAPIT</Text>
      <Animated.Text key={subtitle} entering={FadeInDown.duration(380).springify()} style={styles.subtitle}>
        {subtitle}
      </Animated.Text>
    </View>
  );
}
