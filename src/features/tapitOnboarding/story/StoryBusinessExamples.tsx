import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useTapitOnboardingTheme } from '../TapitOnboardingThemeContext';
import { RADIUS } from '../theme';
import { useStoryLinkScroll } from './StoryLinkScrollContext';

/** Bundled assets — project root `tap-it-client/photos/` */
const IMG_MAPS = require('../../../../photos/002NFC.png');
const IMG_RESTAURANT = require('../../../../photos/003NFC.png');
const IMG_BOOKING = require('../../../../photos/004NFC.png');
const IMG_SOCIAL_PROMO = require('../../../../photos/005NFC.png');

/** Approximate vertical scroll ranges (px) for parallax within the link page. */
const Y_MAPS: [number, number] = [340, 620];
const Y_SOCIAL: [number, number] = [720, 1020];
const Y_REST: [number, number] = [1120, 1420];
const Y_BOOK: [number, number] = [1520, 1860];

function useScrollParallax(scrollRange: [number, number], scrollY: SharedValue<number>) {
  const [a, b] = scrollRange;
  return useAnimatedStyle(() => {
    const y = scrollY.value;
    return {
      opacity: interpolate(y, [a - 140, a + 40, b + 120], [0.82, 1, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(y, [a - 200, b + 100], [22, -12], Extrapolation.CLAMP),
        },
        {
          scale: interpolate(y, [a - 120, a + 60], [0.97, 1], Extrapolation.CLAMP),
        },
        {
          rotateZ: `${interpolate(y, [a - 100, b], [-0.8, 0.6], Extrapolation.CLAMP)}deg`,
        },
      ],
    };
  });
}

function Chip({ label, accent }: { label: string; accent: string }) {
  const T = useTapitOnboardingTheme();
  return (
    <View style={[chipStyles.wrap, { borderColor: accent, backgroundColor: `${accent}14` }]}>
      <Text style={[chipStyles.txt, { color: T.text }]}>{label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  txt: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
});

function SectionLabel({ title, kicker }: { title: string; kicker: string }) {
  const T = useTapitOnboardingTheme();
  return (
    <View style={{ marginBottom: 12, gap: 4 }}>
      <Text style={[sectionLabel.kicker, { color: T.muted }]}>{kicker}</Text>
      <Text style={[sectionLabel.title, { color: T.text }]}>{title}</Text>
    </View>
  );
}

const sectionLabel = StyleSheet.create({
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: 0.2 },
});

export function StoryBusinessExamples() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();
  const scrollY = useStoryLinkScroll();

  const mapsShell = useScrollParallax(Y_MAPS, scrollY);
  const socialShell = useScrollParallax(Y_SOCIAL, scrollY);
  const restShell = useScrollParallax(Y_REST, scrollY);
  const bookShell = useScrollParallax(Y_BOOK, scrollY);

  const mapsPin = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [Y_MAPS[0], Y_MAPS[1]], [6, -10], Extrapolation.CLAMP),
      },
    ],
  }));

  const mapsStars = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollY.value, [Y_MAPS[0] - 80, Y_MAPS[1]], [0.92, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <View style={styles.wrap}>
      <Text style={[styles.sectionHead, { color: T.muted }]}>{o.examplesSectionHead}</Text>

      {/* 1 — Maps / reviews */}
      <Animated.View style={[styles.card, { borderColor: T.border, backgroundColor: T.surface }, mapsShell]}>
        <SectionLabel kicker={o.exMapsKicker} title={o.exMapsTitle} />
        <View style={styles.mapsVisual}>
          <Animated.View style={[styles.pinFloat, mapsPin]}>
            <Ionicons name="location" size={26} color="#ef4444" />
          </Animated.View>
          <View style={[styles.mapsImgFrame, { borderColor: T.border }]}>
            <Image source={IMG_MAPS} style={styles.mapsImg} contentFit="contain" transition={200} />
          </View>
          <Animated.View style={[styles.starRow, mapsStars]}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name="star" size={16} color="#fbbf24" />
            ))}
          </Animated.View>
          <View style={[styles.routeLine, { backgroundColor: T.border }]} />
          <View style={[styles.locBadge, { backgroundColor: `${T.green}22`, borderColor: T.green }]}>
            <Ionicons name="navigate-outline" size={14} color={T.green} />
            <Text style={[styles.locBadgeText, { color: T.green }]}>{o.exMapsLoc}</Text>
          </View>
        </View>

        <Text style={[styles.lead, { color: T.text }]}>{o.exMapsLead}</Text>
        <Text style={[styles.body, { color: T.muted }]}>{o.exMapsBody}</Text>
        <View style={styles.chipRow}>
          <Chip label={o.exMapsChip1} accent="#22c55e" />
          <Chip label={o.exMapsChip2} accent="#3b82f6" />
          <Chip label={o.exMapsChip3} accent="#a855f7" />
        </View>
        <Text style={[styles.caption, { color: T.muted }]}>{o.exMapsCaption}</Text>
      </Animated.View>

      {/* 2 — Social + contact */}
      <Animated.View style={[styles.card, { borderColor: T.border, backgroundColor: T.surface }, socialShell]}>
        <SectionLabel kicker={o.exSocialKicker} title={o.exSocialTitle} />
        <View style={[styles.socialImgFrame, { borderColor: T.border }]}>
          <Image
            source={IMG_SOCIAL_PROMO}
            style={styles.socialImg}
            contentFit="contain"
            transition={220}
            accessibilityLabel="Promote your business with NFC"
          />
        </View>
        <SocialOrbit />
        <Text style={[styles.lead, { color: T.text }]}>{o.exSocialLead}</Text>
        <Text style={[styles.body, { color: T.muted }]}>{o.exSocialBody}</Text>
        <View style={styles.bulletBlock}>
          {[o.exSocialBullet1, o.exSocialBullet2, o.exSocialBullet3].map((line) => (
            <View key={line} style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={18} color={T.green} />
              <Text style={[styles.bulletTxt, { color: T.text }]}>{line}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* 3 — Restaurant */}
      <Animated.View style={[styles.card, { borderColor: T.border, backgroundColor: T.surface }, restShell]}>
        <SectionLabel kicker={o.exRestKicker} title={o.exRestTitle} />
        <View style={styles.restVisual}>
          <View style={[styles.restImgFrame, { borderColor: T.border }]}>
            <Image source={IMG_RESTAURANT} style={styles.restImg} contentFit="contain" transition={200} />
          </View>
          <RestaurantChips />
        </View>
        <Text style={[styles.lead, { color: T.text }]}>{o.exRestLead}</Text>
        <Text style={[styles.body, { color: T.muted }]}>{o.exRestBody}</Text>
      </Animated.View>

      {/* 4 — Booking */}
      <Animated.View style={[styles.card, { borderColor: T.border, backgroundColor: T.surface }, bookShell]}>
        <SectionLabel kicker={o.exBookKicker} title={o.exBookTitle} />
        <View style={[styles.bookImgFrame, { borderColor: T.border }]}>
          <Image
            source={IMG_BOOKING}
            style={styles.bookImg}
            contentFit="contain"
            transition={220}
            accessibilityLabel="Book appointments with NFC"
          />
        </View>
        <BookingVisuals />
        <Text style={[styles.lead, { color: T.text }]}>{o.exBookLead}</Text>
        <Text style={[styles.body, { color: T.muted }]}>{o.exBookBody}</Text>
        <View style={styles.chipRow}>
          <Chip label={o.exBookChip1} accent="#a855f7" />
          <Chip label={o.exBookChip2} accent="#22c55e" />
          <Chip label={o.exBookChip3} accent="#3b82f6" />
        </View>
      </Animated.View>
    </View>
  );
}

function SocialOrbit() {
  const T = useTapitOnboardingTheme();
  const scrollY = useStoryLinkScroll();
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [drift]);

  const ringStyle = useAnimatedStyle(() => {
    const scrollTwist = interpolate(scrollY.value, [Y_SOCIAL[0] - 100, Y_SOCIAL[1]], [-4, 4], Extrapolation.CLAMP);
    const driftTwist = interpolate(drift.value, [0, 1], [-3, 3]);
    return {
      transform: [{ rotate: `${scrollTwist + driftTwist}deg` }],
    };
  });

  const items = [
    { Icon: MaterialCommunityIcons, name: 'instagram' as const, c: '#e11d48' },
    { Icon: MaterialCommunityIcons, name: 'tiktok' as const, c: '#0ea5e9' },
    { Icon: MaterialCommunityIcons, name: 'snapchat' as const, c: '#eab308' },
    { Icon: Ionicons, name: 'call-outline' as const, c: T.green },
    { Icon: Ionicons, name: 'globe-outline' as const, c: T.blue },
  ] as const;

  const angles = [0, 72, 144, 216, 288].map((d) => (d * Math.PI) / 180);
  const r = 56;

  return (
    <Animated.View style={[styles.orbitWrap, ringStyle]}>
      <View style={[styles.orbitCore, { borderColor: T.border, backgroundColor: T.surfaceElevated }]}>
        <Ionicons name="share-social-outline" size={28} color={T.text} />
      </View>
      {items.map((it, i) => {
        const x = Math.round(Math.cos(angles[i] - Math.PI / 2) * r);
        const y = Math.round(Math.sin(angles[i] - Math.PI / 2) * r);
        return (
          <Animated.View
            key={i}
            entering={FadeInDown.duration(380).delay(120 + i * 55).springify()}
            style={[styles.orbitSat, { transform: [{ translateX: x }, { translateY: y }] }]}
          >
            <View style={[styles.satBubble, { borderColor: `${it.c}55`, backgroundColor: `${it.c}18` }]}>
              <it.Icon name={it.name as never} size={22} color={it.c} />
            </View>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

function RestaurantChips() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const scrollY = useStoryLinkScroll();
  const chips = [o.restChipMenu, o.restChipReview, o.restChipOrder, o.restChipReserve] as const;
  return (
    <View style={styles.restChips}>
      {chips.map((label, i) => (
        <RestaurantChip key={label} label={label} index={i} scrollY={scrollY} />
      ))}
    </View>
  );
}

function RestaurantChip({
  label,
  index,
  scrollY,
}: {
  label: string;
  index: number;
  scrollY: SharedValue<number>;
}) {
  const T = useTapitOnboardingTheme();
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 2600 + index * 100, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [float, index]);

  const chipStyle = useAnimatedStyle(() => {
    const py = interpolate(
      scrollY.value,
      [Y_REST[0] - 80, Y_REST[1]],
      [4 + index * 2, -6 - index],
      Extrapolation.CLAMP,
    );
    const bob = interpolate(float.value, [0, 1], [0, index % 2 === 0 ? -3 : 3]);
    return { transform: [{ translateY: py + bob }] };
  });

  return (
    <Animated.View style={chipStyle}>
      <View style={[styles.menuChip, { borderColor: T.border, backgroundColor: T.surfaceElevated }]}>
        <Text style={[styles.menuChipTxt, { color: T.text }]}>{label}</Text>
      </View>
    </Animated.View>
  );
}

function BookingVisuals() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();
  const scrollY = useStoryLinkScroll();
  const rowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(scrollY.value, [Y_BOOK[0] - 120, Y_BOOK[1]], [10, -6], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.bookRow, rowStyle]}>
      {[o.bookTime1, o.bookTime2, o.bookTime3].map((t, i) => (
        <View key={t} style={[styles.timePill, { borderColor: T.border, backgroundColor: T.surfaceElevated }]}>
          <Ionicons name="time-outline" size={16} color={T.muted} />
          <Text style={[styles.timeTxt, { color: T.text }]}>{t}</Text>
          {i === 1 ? <Ionicons name="checkmark-circle" size={18} color={T.green} /> : null}
        </View>
      ))}
      <View style={[styles.calCard, { borderColor: T.border, backgroundColor: `${T.blue}12` }]}>
        <Ionicons name="calendar-outline" size={22} color={T.blue} />
        <Text style={[styles.calTxt, { color: T.text }]}>{o.bookSlot}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, gap: 18 },
  sectionHead: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  card: {
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 10,
  },
  mapsVisual: {
    alignItems: 'center',
    minHeight: 200,
    marginBottom: 4,
  },
  pinFloat: {
    position: 'absolute',
    top: 4,
    right: 24,
    zIndex: 3,
  },
  mapsImgFrame: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,120,120,0.06)',
  },
  mapsImg: {
    width: '100%',
    aspectRatio: 1.65,
  },
  starRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 10,
  },
  routeLine: {
    width: '72%',
    height: 2,
    marginTop: 12,
    borderRadius: 1,
    opacity: 0.6,
  },
  locBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  locBadgeText: { fontSize: 12, fontWeight: '700' },
  lead: { fontSize: 15, fontWeight: '700', lineHeight: 22, marginTop: 4 },
  body: { fontSize: 14, lineHeight: 21 },
  caption: { fontSize: 12, lineHeight: 17, fontStyle: 'italic', marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  bulletBlock: { gap: 8, marginTop: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletTxt: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  socialImgFrame: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,120,120,0.06)',
    marginBottom: 4,
  },
  socialImg: {
    width: '100%',
    aspectRatio: 1.55,
    maxHeight: 200,
  },
  bookImgFrame: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,120,120,0.06)',
    marginBottom: 4,
  },
  bookImg: {
    width: '100%',
    aspectRatio: 1.55,
    maxHeight: 200,
  },
  orbitWrap: {
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  orbitCore: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  orbitSat: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  satBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restVisual: { gap: 12, marginTop: 4 },
  restImgFrame: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,120,120,0.06)',
  },
  restImg: {
    width: '100%',
    aspectRatio: 1.55,
    maxHeight: 200,
  },
  restChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  menuChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  menuChipTxt: { fontSize: 12, fontWeight: '800' },
  bookRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  timeTxt: { fontSize: 12, fontWeight: '700' },
  calCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  calTxt: { fontSize: 13, fontWeight: '800' },
});
