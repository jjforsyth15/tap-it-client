import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { CreateYourCardButton } from '../CreateYourCardButton';
import { TapitPageHeader } from '../TapitPageHeader';
import { useTapitOnboardingTheme } from '../TapitOnboardingThemeContext';
import { RADIUS } from '../theme';
import { NFC_CARD_IMAGE, NfcCardHero } from './NfcCardHero';
import { StoryBusinessExamples } from './StoryBusinessExamples';
import { StoryCallout } from './StoryCallout';

function BodyLine({ children, delay }: { children: string; delay: number }) {
  const T = useTapitOnboardingTheme();
  return (
    <Animated.Text
      entering={FadeInDown.duration(380).delay(delay).springify()}
      style={[styles.bodyLine, { color: T.muted }]}
    >
      {children}
    </Animated.Text>
  );
}

export function StoryPageChooseLink() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  return (
    <View>
      <NfcCardHero pageIndex={0} />
      <StoryCallout text={o.storyChooseCallout} delay={60} />
      <TapitPageHeader activeStep={0} subtitle={o.storyChooseHeaderSub} />
      <BodyLine delay={120}>{o.storyChooseBody1}</BodyLine>
      <BodyLine delay={200}>{o.storyChooseBody2}</BodyLine>
      <StoryBusinessExamples />
    </View>
  );
}

export function StoryPageServer() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();
  return (
    <View>
      <NfcCardHero pageIndex={1} />
      <StoryCallout text={o.storyServerCallout} delay={60} />
      <TapitPageHeader activeStep={1} subtitle={o.storyServerHeaderSub} />
      <View style={styles.flowRow}>
        <View style={[styles.flowCard, { borderColor: T.border, backgroundColor: T.surface }]}>
          <Ionicons name="card-outline" size={22} color={T.text} />
          <Text style={[styles.flowMini, { color: T.muted }]}>{o.storyServerYourPick}</Text>
        </View>
        <View style={styles.dash} />
        <Ionicons name="arrow-forward" size={18} color={T.muted} />
        <View style={styles.dash} />
        <View style={[styles.flowServer, { borderColor: T.blue, backgroundColor: `${T.blue}18` }]}>
          <Ionicons name="phone-portrait-outline" size={26} color={T.blue} />
          <Text style={[styles.flowMini, { color: T.blue }]}>{o.storyServerCloud}</Text>
        </View>
      </View>
      <BodyLine delay={140}>{o.storyServerBody1}</BodyLine>
      <BodyLine delay={220}>{o.storyServerBody2}</BodyLine>
    </View>
  );
}

function PulseRing({ color }: { color: string }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.55, 0]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.92, 1.35]) }],
  }));

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        { borderColor: color },
        ringStyle,
      ]}
    />
  );
}

export function StoryPageEmbed() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();
  return (
    <View>
      <View style={styles.heroEmbedWrap}>
        <PulseRing color={T.green} />
        <View style={styles.heroEmbedForeground}>
          <NfcCardHero pageIndex={2} />
          <View style={[styles.checkBadge, { backgroundColor: T.greenBg, borderColor: T.green }]}>
            <Ionicons name="people-outline" size={22} color={T.green} />
          </View>
        </View>
      </View>
      <StoryCallout text={o.storyEmbedCallout} delay={60} />
      <TapitPageHeader activeStep={2} subtitle={o.storyEmbedHeaderSub} />
      <BodyLine delay={120}>{o.storyEmbedBody1}</BodyLine>
      <BodyLine delay={200}>{o.storyEmbedBody2}</BodyLine>
    </View>
  );
}

export function StoryPageShip() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();
  const slide = useSharedValue(0);
  useEffect(() => {
    slide.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [slide]);

  const miniCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(slide.value, [0, 1], [0, -10]) }, { scale: interpolate(slide.value, [0, 1], [1, 0.96]) }],
  }));

  return (
    <View>
      <NfcCardHero pageIndex={3} />
      <StoryCallout text={o.storyShipCallout} delay={60} />
      <TapitPageHeader activeStep={3} subtitle={o.storyShipHeaderSub} />
      <View style={styles.shipScene}>
        <Animated.View style={[styles.miniCardWrap, miniCardStyle]}>
          <Image source={NFC_CARD_IMAGE} style={styles.miniCardImg} contentFit="contain" />
        </Animated.View>
        <Ionicons name="arrow-down" size={20} color={T.muted} style={{ marginVertical: 6 }} />
        <View style={[styles.resumePanel, { borderColor: T.border, backgroundColor: T.surface }]}>
          <Ionicons name="document-text-outline" size={34} color={T.blue} />
          <Text style={[styles.envelopeLabel, { color: T.muted, marginTop: 10 }]}>{o.storyShipEnvelope}</Text>
        </View>
      </View>
      <BodyLine delay={160}>{o.storyShipBody1}</BodyLine>
    </View>
  );
}

export function StoryPageTry({ onGoToShop }: { onGoToShop: () => void }) {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();
  const tap = useSharedValue(0);
  const success = useSharedValue(0);
  const [showSuccessCopy, setShowSuccessCopy] = useState(false);

  const runDemo = useCallback(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowSuccessCopy(false);
    success.value = 0;
    tap.value = withSequence(
      withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 380 }),
    );
    success.value = withDelay(
      480,
      withSequence(
        withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 400 }),
      ),
    );
    setTimeout(() => setShowSuccessCopy(true), 520);
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      setTimeout(() => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), 560);
    }
  }, [success, tap]);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tap.value, [0, 1], [0, 36]) },
      { rotateZ: `${interpolate(tap.value, [0, 1], [0, -4])}deg` },
    ],
  }));

  const phoneAnim = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(tap.value, [0, 0.5, 1], [1, 0.97, 1.03]) }],
  }));

  const glowSuccess = useAnimatedStyle(() => ({
    opacity: interpolate(success.value, [0, 1], [0, 1]),
    transform: [{ scale: interpolate(success.value, [0, 1], [0.85, 1.05]) }],
  }));

  return (
    <View>
      <NfcCardHero pageIndex={4} />
      <StoryCallout text={o.storyTryCallout} delay={40} />
      <TapitPageHeader activeStep={4} subtitle={o.storyTryHeaderSub} />
      <View style={styles.tryScene}>
        <Animated.View style={[styles.phone, { borderColor: T.border, backgroundColor: T.surface }, phoneAnim]}>
          <View style={[styles.phoneSpeaker, { backgroundColor: T.muted }]} />
          <View style={[styles.phoneScreen, { backgroundColor: T.bg }]}>
            <Ionicons name="phone-portrait-outline" size={42} color={T.muted} />
            <Text style={[styles.phoneHint, { color: T.muted }]}>{o.storyTryNfcReady}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.tryGlow, { backgroundColor: T.green }, glowSuccess]} />

        <Animated.View style={[styles.tryCardShell, cardAnim]}>
          <Image source={NFC_CARD_IMAGE} style={styles.tryCardImg} contentFit="contain" />
        </Animated.View>
      </View>

      <Text style={[styles.bodyLine, { color: T.muted, textAlign: 'center', marginBottom: 12 }]}>
        {o.storyTryBody}
      </Text>

      <Pressable
        onPress={runDemo}
        style={({ pressed }) => [
          styles.tryBtn,
          { backgroundColor: T.green, shadowColor: T.green },
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel={o.storyTryBtnA11y}
      >
        <Text style={[styles.tryBtnText, { color: '#052e16' }]}>{o.storyTryBtn}</Text>
      </Pressable>

      {showSuccessCopy ? (
        <Animated.View entering={FadeInDown.duration(360).springify()} style={[styles.successCard, { borderColor: T.green, backgroundColor: T.greenBg }]}>
          <Ionicons name="checkmark-done-circle" size={24} color={T.green} />
          <Text style={[styles.successTitle, { color: T.text }]}>{o.storyTrySuccessTitle}</Text>
          <Text style={[styles.successBody, { color: T.muted }]}>{o.storyTrySuccessBody}</Text>
        </Animated.View>
      ) : null}

      <View style={{ marginTop: 22 }}>
        <CreateYourCardButton onPress={onGoToShop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyLine: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 6,
    flexWrap: 'wrap',
  },
  flowCard: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 4,
  },
  flowServer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    gap: 4,
  },
  flowMini: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'lowercase',
  },
  dash: {
    width: 12,
    height: 2,
    backgroundColor: 'rgba(140,140,140,0.5)',
    borderRadius: 1,
  },
  heroEmbedWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
    width: '100%',
  },
  heroEmbedForeground: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 280,
    height: 180,
    borderRadius: 24,
    borderWidth: 2,
    zIndex: 0,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 4,
    right: '8%',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shipScene: {
    alignItems: 'center',
    marginBottom: 16,
  },
  miniCardWrap: {
    width: 120,
    borderRadius: 10,
    overflow: 'hidden',
  },
  miniCardImg: {
    width: '100%',
    aspectRatio: 1.586,
  },
  resumePanel: {
    width: 200,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 4,
  },
  envelopeLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  tryScene: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    minHeight: 200,
    paddingVertical: 8,
  },
  phone: {
    width: 112,
    borderRadius: 18,
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    zIndex: 2,
  },
  phoneSpeaker: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    opacity: 0.5,
  },
  phoneScreen: {
    width: '100%',
    aspectRatio: 0.55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  phoneHint: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tryGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0,
    zIndex: 0,
  },
  tryCardShell: {
    width: 108,
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  tryCardImg: {
    width: '100%',
    aspectRatio: 1.586,
  },
  tryBtn: {
    alignSelf: 'center',
    paddingHorizontal: 44,
    paddingVertical: 14,
    borderRadius: 999,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  tryBtnText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  successCard: {
    padding: 16,
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  successBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
