import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTapitOnboardingTheme } from './TapitOnboardingThemeContext';

type Props = {
  activeStep: number;
  subtitle: string;
};

function StepDot({ active }: { active: boolean }) {
  const T = useTapitOnboardingTheme();
  const scale = useSharedValue(active ? 1.35 : 1);

  useEffect(() => {
    scale.value = withSpring(active ? 1.35 : 1, { damping: 14, stiffness: 220 });
  }, [active, scale]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dotBase,
        {
          backgroundColor: active ? T.text : T.dotInactive,
          opacity: active ? 1 : 0.45,
        },
        animated,
      ]}
    />
  );
}

export function TapitPageHeader({ activeStep, subtitle }: Props) {
  const T = useTapitOnboardingTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          marginBottom: 22,
        },
        dots: {
          flexDirection: 'row',
          gap: 8,
          marginBottom: 18,
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
      <View style={styles.dots}>
        {[0, 1, 2, 3, 4].map((i) => (
          <StepDot key={i} active={i === activeStep} />
        ))}
      </View>
      <Text style={styles.brand}>TAPIT</Text>
      <Animated.Text key={subtitle} entering={FadeInDown.duration(380).springify()} style={styles.subtitle}>
        {subtitle}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dotBase: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
