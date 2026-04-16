import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useOnboardingPager } from '../OnboardingPagerContext';
import { useTapitOnboardingTheme } from '../TapitOnboardingThemeContext';

/** Bundled asset: `tap-it-client/photos/001NFC.png` (four levels up from `story/` → project root, then `photos/`) */
export const NFC_CARD_IMAGE = require('../../../../photos/001NFC.png');

/** ISO-style card ratio; image uses `contain` so the full card stays visible without cropping. */
const CARD_ASPECT = 1.586;

type Props = {
  pageIndex: number;
};

export function NfcCardHero({ pageIndex }: Props) {
  const T = useTapitOnboardingTheme();
  const { width: screenW } = useWindowDimensions();
  const { scrollX, pageWidth } = useOnboardingPager();
  const float = useSharedValue(0);

  const cardMaxW = Math.min(screenW - 40, 340);

  useEffect(() => {
    const dur = 2800 + pageIndex * 120;
    float.value = withRepeat(
      withTiming(1, { duration: dur, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [float, pageIndex]);

  const pagePresenceStyle = useAnimatedStyle(() => {
    const t = (scrollX.value - pageIndex * pageWidth) / pageWidth;
    const scale = interpolate(t, [-1, 0, 1], [0.9, 1, 0.9], Extrapolation.CLAMP);
    const opacity = interpolate(t, [-1, 0, 1], [0.5, 1, 0.5], Extrapolation.CLAMP);
    const rotateZ = interpolate(t, [-1, 0, 1], [4, 0, -4], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ scale }, { rotateZ: `${rotateZ}deg` }],
    };
  });

  const floatStyle = useAnimatedStyle(() => {
    const t = (scrollX.value - pageIndex * pageWidth) / pageWidth;
    const focus = interpolate(t, [-1, 0, 1], [0.35, 1, 0.35], Extrapolation.CLAMP);
    const bob = interpolate(float.value, [0, 1], [0, -6]) * focus;
    const tilt = interpolate(float.value, [0, 1], [-1.2, 1.2]) * focus;
    const pageTilt = [0, -0.8, 0.6, -0.5, 0.4][pageIndex] ?? 0;
    return {
      transform: [{ translateY: bob }, { rotateZ: `${tilt + pageTilt}deg` }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const t = (scrollX.value - pageIndex * pageWidth) / pageWidth;
    const o = interpolate(t, [-1, 0, 1], [0.12, 0.38, 0.12], Extrapolation.CLAMP);
    return { opacity: o };
  });

  return (
    <View style={[styles.wrap, { maxWidth: cardMaxW + 24, alignSelf: 'center' }]}>
      <Animated.View style={[styles.glow, { backgroundColor: T.blue }, glowStyle]} />
      <Animated.View style={[styles.cardShadow, pagePresenceStyle]}>
        <Animated.View style={[styles.cardFrame, { borderColor: T.border, maxWidth: cardMaxW }, floatStyle]}>
          <Image
            source={NFC_CARD_IMAGE}
            style={[styles.cardImage, { aspectRatio: CARD_ASPECT }]}
            contentFit="contain"
            transition={220}
            accessibilityLabel="Tapit NFC card"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: 16,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: '92%',
    height: 120,
    borderRadius: 48,
    top: 24,
  },
  cardShadow: {
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 18,
  },
  cardFrame: {
    width: '100%',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,120,120,0.08)',
  },
  cardImage: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
