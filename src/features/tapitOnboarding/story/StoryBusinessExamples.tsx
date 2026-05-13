import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useTapitOnboardingTheme } from '../TapitOnboardingThemeContext';
import { RADIUS } from '../theme';

/** Project root `photos/` — one image per landing subsection */
const SECTION_IMAGES = [
  require('../../../../photos/001NFC.png'),
  require('../../../../photos/002NFC.png'),
  require('../../../../photos/003NFC.png'),
  require('../../../../photos/004NFC.png'),
  require('../../../../photos/005NFC.png'),
] as const;

type MdiName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Icon names at runtime; Expo's glyph typings omit some MDI names (e.g. discord). */
const SOCIAL_ICONS: readonly { name: string; color: string }[] = [
  { name: 'linkedin', color: '#0a66c2' },
  { name: 'instagram', color: '#e11d48' },
  { name: 'twitter', color: '#38bdf8' },
  { name: 'snapchat', color: '#eab308' },
  { name: 'discord', color: '#5865f2' },
];

function PulsingBrandIcon({ entry, index }: { entry: (typeof SOCIAL_ICONS)[number]; index: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      index * 140,
      withRepeat(
        withSequence(
          withTiming(1.14, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [index, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const { name, color } = entry;

  return (
    <Animated.View style={[styles.iconBubble, { borderColor: `${color}44`, backgroundColor: `${color}18` }, animStyle]}>
      <MaterialCommunityIcons name={name as MdiName} size={24} color={color} />
    </Animated.View>
  );
}

function AnimatedSocialStrip() {
  const T = useTapitOnboardingTheme();
  return (
    <View style={styles.socialStrip}>
      <Text style={[styles.socialStripLabel, { color: T.muted }]}>LinkedIn · Instagram · X · Snapchat · Discord</Text>
      <View style={styles.socialIconsRow}>
        {SOCIAL_ICONS.map((entry, i) => (
          <PulsingBrandIcon key={`${String(entry.name)}-${i}`} entry={entry} index={i} />
        ))}
      </View>
    </View>
  );
}

type SectionBlockProps = {
  index: number;
  title: string;
  body: string;
};

function SectionBlock({ index, title, body }: SectionBlockProps) {
  const T = useTapitOnboardingTheme();
  const src = SECTION_IMAGES[index] ?? SECTION_IMAGES[0];

  return (
    <View style={[styles.sectionCard, { borderColor: T.border, backgroundColor: T.surface }]}>
      <Text style={[styles.sectionTitle, { color: T.text }]}>{title}</Text>
      <View style={[styles.imageFrame, { borderColor: T.border }]}>
        <Image source={src} style={styles.sectionImage} contentFit="contain" transition={200} accessibilityLabel={title} />
      </View>
      {index === 0 ? <AnimatedSocialStrip /> : null}
      <Text style={[styles.sectionBody, { color: T.muted }]}>{body}</Text>
    </View>
  );
}

/**
 * Five stacked sections on landing step 1 (after hero + “Your URL lives on the card”).
 */
export function StoryBusinessExamples() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  const T = useTapitOnboardingTheme();

  const sections: { title: string; body: string }[] = [
    { title: o.landingS1Title, body: o.landingS1Body },
    { title: o.landingS2Title, body: o.landingS2Body },
    { title: o.landingS3Title, body: o.landingS3Body },
    { title: o.landingS4Title, body: o.landingS4Body },
    { title: o.landingS5Title, body: o.landingS5Body },
  ];

  return (
    <View style={styles.wrap}>
      <Text style={[styles.stackHead, { color: T.muted }]}>{o.storyLandingSectionsTitle}</Text>
      {sections.map((s, i) => (
        <SectionBlock key={s.title} index={i} title={s.title} body={s.body} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18, gap: 16, paddingBottom: 28 },
  stackHead: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionCard: {
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },
  imageFrame: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,120,120,0.06)',
  },
  sectionImage: {
    width: '100%',
    aspectRatio: 1.586,
    maxHeight: 220,
  },
  sectionBody: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  socialStrip: { gap: 8 },
  socialStripLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  socialIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
