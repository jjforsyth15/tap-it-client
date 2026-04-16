import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTapitOnboardingTheme } from '../TapitOnboardingThemeContext';
import { RADIUS } from '../theme';

type Props = {
  text: string;
  delay?: number;
};

/** Soft note-style callout; pairs with the NFC card hero. */
export function StoryCallout({ text, delay = 80 }: Props) {
  const T = useTapitOnboardingTheme();
  return (
    <Animated.View
      entering={FadeInDown.duration(420).delay(delay).springify()}
      style={[
        styles.cloud,
        {
          backgroundColor: T.surfaceElevated,
          borderColor: T.border,
          shadowColor: '#000',
        },
      ]}
    >
      <Text style={[styles.cloudText, { color: T.text }]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cloud: {
    maxWidth: 300,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: RADIUS.tile,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },
  cloudText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'center',
  },
});
