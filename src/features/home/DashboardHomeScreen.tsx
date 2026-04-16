import { TextField } from '@/src/components/TextField';
import {
  MOCK_ACCESSORIES,
  MOCK_ANALYTICS_SNAPSHOT,
  MOCK_PORTFOLIO_ITEMS,
  MOCK_USER_STORIES,
} from '@/src/constants/mockHomeData';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import type { AppThemeColors, ColorMode, UserNfcCard } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import type { MainTabKey } from '@/src/i18n/ui/types';
import { Ionicons } from '@expo/vector-icons';
import { mainTabIsActive } from '@/src/navigation/mainTabNav';
import { router, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const GREEN = '#4ade80';

function paramToString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return undefined;
}

function createStyles(c: AppThemeColors, colorMode: ColorMode) {
  const trackBg = colorMode === 'light' ? '#d4d4d8' : '#2a2a30';
  const accessoryTagBg = colorMode === 'light' ? '#e4e4e7' : '#27272f';
  const portfolioStub = colorMode === 'light' ? '#d4d4d8' : '#2a2a30';
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg },
    guestRibbon: {
      backgroundColor: c.surface,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    guestRibbonText: {
      fontSize: 12,
      fontWeight: '600',
      color: c.muted,
      textAlign: 'center',
    },
    scroll: { paddingHorizontal: 20, paddingTop: 8 },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.accent,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarText: { fontSize: 18, fontWeight: '700', color: c.onAccent },
    avatarImg: { width: '100%', height: '100%' },
    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { opacity: 0.75 },
    welcome: { fontSize: 22, fontWeight: '700', color: c.text, marginBottom: 6 },
    welcomeSub: { fontSize: 14, color: c.muted, marginBottom: 20, lineHeight: 20 },
    journeyCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colorMode === 'light' ? '#e4e4e7' : '#f4f4f5',
      borderRadius: 18,
      paddingVertical: 18,
      paddingHorizontal: 16,
      marginBottom: 28,
    },
    journeyCtaIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(10,10,10,0.06)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    journeyCtaTextCol: { flex: 1, gap: 4 },
    journeyCtaTitle: { fontSize: 17, fontWeight: '800', color: '#0a0a0a' },
    journeyCtaSub: { fontSize: 12, fontWeight: '500', color: 'rgba(10,10,10,0.55)', lineHeight: 16 },
    storiesRow: { gap: 12, paddingBottom: 28, paddingRight: 8 },
    storyCard: {
      width: 292,
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
    },
    storyIconRow: { marginBottom: 10 },
    storyQuote: {
      fontSize: 15,
      fontWeight: '500',
      color: c.text,
      lineHeight: 22,
      marginBottom: 12,
    },
    storyTag: {
      alignSelf: 'flex-start',
      backgroundColor: accessoryTagBg,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    storyTagText: { fontSize: 10, fontWeight: '700', color: c.muted, textTransform: 'uppercase' },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: c.text, marginBottom: 6 },
    sectionHint: { fontSize: 13, color: c.muted, marginBottom: 14, lineHeight: 18 },
    analyticsCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 28,
    },
    analyticsRow: { flexDirection: 'row', marginBottom: 18 },
    analyticsStat: { flex: 1 },
    analyticsValue: { fontSize: 28, fontWeight: '800', color: c.text },
    analyticsValueSmall: { fontSize: 15, fontWeight: '700', color: c.text, lineHeight: 20 },
    analyticsLabel: { fontSize: 12, color: c.muted, marginTop: 4 },
    analyticsPeriod: { fontSize: 11, color: c.muted, marginTop: 2 },
    analyticsDivider: { width: 1, backgroundColor: c.border, marginHorizontal: 12 },
    deviceTitle: { fontSize: 12, fontWeight: '600', color: c.muted, marginBottom: 10 },
    deviceBars: { gap: 8 },
    deviceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    deviceLabel: { width: 64, fontSize: 12, color: c.muted },
    deviceTrack: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      backgroundColor: trackBg,
      overflow: 'hidden',
    },
    deviceFill: { height: '100%', backgroundColor: c.accent, borderRadius: 3 },
    devicePct: { width: 32, fontSize: 12, color: c.text, textAlign: 'right' },
    chipRow: { gap: 8, paddingBottom: 20 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipText: { fontSize: 13, fontWeight: '600', color: c.text },
    cardsRow: { gap: 14, paddingBottom: 12, paddingRight: 8 },
    nfcCard: {
      width: 168,
      height: 108,
      borderRadius: 12,
      padding: 12,
      justifyContent: 'space-between',
      borderWidth: 1,
    },
    nfcCardLight: { backgroundColor: '#e4e4e7', borderColor: '#d4d4d8' },
    nfcCardDark: { backgroundColor: '#1e2a3d', borderColor: '#2d4a6f' },
    nfcCardTitle: { fontSize: 14, fontWeight: '600', lineHeight: 18 },
    nfcCardTitleLight: { color: '#18181b' },
    nfcCardTitleDark: { color: '#f4f4f5' },
    nfcCardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    addCardGhost: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'flex-start',
      marginBottom: 28,
      paddingVertical: 6,
    },
    addCardGhostText: { fontSize: 15, fontWeight: '600', color: c.accent },
    accessoryRow: { gap: 12, paddingBottom: 28, paddingRight: 8 },
    accessoryCard: {
      width: 156,
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 14,
    },
    accessoryTag: {
      alignSelf: 'flex-start',
      backgroundColor: accessoryTagBg,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: 10,
    },
    accessoryTagText: { fontSize: 10, fontWeight: '700', color: c.muted, textTransform: 'uppercase' },
    accessoryTitle: { fontSize: 15, fontWeight: '700', color: c.text, marginBottom: 4 },
    accessoryPrice: { fontSize: 13, color: c.muted, marginBottom: 12 },
    accessoryBtn: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      paddingVertical: 8,
      alignItems: 'center',
    },
    accessoryBtnText: { fontSize: 13, fontWeight: '600', color: c.text },
    roadmapGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 28,
    },
    roadmapTile: {
      width: '48%',
      flexGrow: 1,
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 12,
      gap: 6,
    },
    roadmapTitle: { fontSize: 13, fontWeight: '700', color: c.text },
    roadmapSub: { fontSize: 11, color: c.muted, lineHeight: 15 },
    portfolioRow: { gap: 12, paddingBottom: 28, paddingRight: 8 },
    portfolioTile: {
      width: 112,
      height: 100,
      borderRadius: 12,
      padding: 10,
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    portfolioDark: { backgroundColor: '#12141a', alignItems: 'center' },
    portfolioImage: { backgroundColor: c.surface },
    portfolioImageStub: {
      flex: 1,
      borderRadius: 8,
      backgroundColor: portfolioStub,
      marginBottom: 6,
      minHeight: 36,
    },
    portfolioLabel: { fontSize: 11, fontWeight: '600', color: c.text },
    leadCard: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 24,
    },
    leadCardTitle: { fontSize: 16, fontWeight: '600', color: c.text, marginBottom: 12 },
    leadField: { marginBottom: 4 },
    leadCta: {
      marginTop: 12,
      backgroundColor: c.accent,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    leadCtaText: { fontSize: 16, fontWeight: '600', color: c.onAccent },
    securityNote: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
      backgroundColor: 'rgba(74, 222, 128, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(74, 222, 128, 0.25)',
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
    },
    securityNoteText: { flex: 1, fontSize: 13, color: c.muted, lineHeight: 18 },
    bottomNav: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      paddingTop: 10,
      backgroundColor: c.bottomNavBg,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    tabItem: { alignItems: 'center', gap: 4, minWidth: 56 },
    tabLabel: { fontSize: 10, color: c.muted, fontWeight: '500' },
    tabLabelActive: { color: c.text, fontWeight: '700' },
    emptyActiveCards: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 12,
      gap: 10,
    },
    emptyActiveCardsTitle: { fontSize: 15, fontWeight: '700', color: c.text },
    emptyActiveCardsBody: { fontSize: 13, color: c.muted, lineHeight: 18 },
    emptyActiveCardsCta: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: c.accent,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
    },
    emptyActiveCardsCtaText: { fontSize: 14, fontWeight: '700', color: c.onAccent },
  });
}

export default function DashboardHomeScreen() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const raw = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const guestRaw = (paramToString(raw.guest) || '').toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';

  const { u } = useAppPreferences();
  const { profile, colors, setProfile, hydrated, myCards } = useUserProfile();
  const seededDisplay = useRef(false);

  useEffect(() => {
    if (!hydrated || isGuest || seededDisplay.current) return;
    const d = paramToString(raw.displayName);
    if (d) {
      setProfile({ displayName: d });
      seededDisplay.current = true;
    }
  }, [hydrated, isGuest, raw.displayName, setProfile]);

  const displayName = isGuest
    ? paramToString(raw.displayName) || u.common.guestDisplayName
    : profile.displayName;

  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');

  const journeyParams = useMemo(() => {
    const p: Record<string, string> = {};
    const g = paramToString(raw.guest);
    const d = isGuest ? paramToString(raw.displayName) : profile.displayName;
    if (g) p.guest = g;
    if (d) p.displayName = d;
    return p;
  }, [raw.guest, raw.displayName, isGuest, profile.displayName]);

  const styles = useMemo(
    () => createStyles(colors, profile.colorMode),
    [colors, profile.colorMode],
  );

  const tf = {
    labelColor: colors.muted,
    inputBackgroundColor: colors.surface,
    inputBorderColor: colors.border,
    inputTextColor: colors.text,
  };

  const goShop = () => {
    router.push({ pathname: '/shop', params: journeyParams });
  };

  const goCreateNfcCard = () => {
    router.push({ pathname: '/card-journey', params: journeyParams });
  };

  const goProfile = () => {
    router.push({ pathname: '/profile', params: journeyParams });
  };

  const openAnalytics = () => {
    router.push({ pathname: '/analytics', params: journeyParams });
  };

  const onTabPress = (key: MainTabKey) => {
    if (key === 'home') {
      router.replace({ pathname: '/home', params: journeyParams });
      return;
    }
    if (key === 'cards') {
      router.push({ pathname: '/my-cards', params: journeyParams });
      return;
    }
    if (key === 'analytics') {
      router.replace({ pathname: '/analytics', params: journeyParams });
      return;
    }
    if (key === 'shop') {
      router.replace({ pathname: '/shop', params: journeyParams });
      return;
    }
    if (key === 'profile') {
      goProfile();
      return;
    }
  };

  const tabActive = (key: MainTabKey) => mainTabIsActive(pathname, segments, key);

  return (
    <SafeAreaView style={[styles.root, { paddingTop: insets.top }]} edges={['top']}>
      {isGuest ? (
        <View style={styles.guestRibbon}>
          <Text style={styles.guestRibbonText}>{u.common.guestRibbon}</Text>
        </View>
      ) : null}
      {profile.accountStatus === 'disabled' ? (
        <View style={[styles.guestRibbon, { borderBottomWidth: StyleSheet.hairlineWidth }]}>
          <Text style={styles.guestRibbonText}>{u.common.accountDisabledRibbon}</Text>
        </View>
      ) : null}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topRow}>
          <Pressable
            onPress={goProfile}
            style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            {profile.profileImageUri ? (
              <Image source={{ uri: profile.profileImageUri }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
            )}
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.welcome}>
          {u.home.welcomeBack} {displayName}
        </Text>
        <Text style={styles.welcomeSub}>{u.home.welcomeSub}</Text>

        <Pressable
          onPress={goShop}
          style={({ pressed }) => [styles.journeyCta, pressed && { opacity: 0.92 }]}
          accessibilityRole="button"
          accessibilityLabel={`${u.home.journeyCtaTitle}. ${u.home.journeyCtaSub}`}
        >
          <View style={styles.journeyCtaIcon}>
            <Ionicons name="bag-outline" size={26} color={colors.accent} />
          </View>
          <View style={styles.journeyCtaTextCol}>
            <Text style={styles.journeyCtaTitle}>{u.home.journeyCtaTitle}</Text>
            <Text style={styles.journeyCtaSub}>{u.home.journeyCtaSub}</Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="#0a0a0a" />
        </Pressable>

        <Text style={styles.sectionTitle}>{u.home.storiesTitle}</Text>
        <Text style={styles.sectionHint}>{u.home.storiesHint}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesRow}>
          {MOCK_USER_STORIES.map((story) => (
            <View key={story.id} style={styles.storyCard}>
              <View style={styles.storyIconRow}>
                <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.accent} accessibilityLabel="Quote" />
              </View>
              <Text style={styles.storyQuote}>{story.quote}</Text>
              <View style={styles.storyTag}>
                <Text style={styles.storyTagText}>{story.tag}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{u.home.analyticsSnapshotTitle}</Text>
        <Text style={styles.sectionHint}>{u.home.analyticsSnapshotHint}</Text>
        <Pressable
          onPress={openAnalytics}
          style={({ pressed }) => [styles.analyticsCard, pressed && { opacity: 0.92 }]}
          accessibilityRole="button"
          accessibilityLabel="Open full analytics"
        >
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsStat}>
              <Text style={styles.analyticsValue}>{MOCK_ANALYTICS_SNAPSHOT.cardViews.toLocaleString()}</Text>
              <Text style={styles.analyticsLabel}>{u.home.cardViews}</Text>
              <Text style={styles.analyticsPeriod}>{MOCK_ANALYTICS_SNAPSHOT.periodLabel}</Text>
            </View>
            <View style={styles.analyticsDivider} />
            <View style={styles.analyticsStat}>
              <Text style={styles.analyticsValueSmall} numberOfLines={2}>
                {MOCK_ANALYTICS_SNAPSHOT.topLink}
              </Text>
              <Text style={styles.analyticsLabel}>{u.home.mostClickedLink}</Text>
            </View>
          </View>
          <Text style={styles.deviceTitle}>{u.home.deviceType}</Text>
          <View style={styles.deviceBars}>
            {MOCK_ANALYTICS_SNAPSHOT.byDevice.map((d) => (
              <View key={d.label} style={styles.deviceRow}>
                <Text style={styles.deviceLabel}>{d.label}</Text>
                <View style={styles.deviceTrack}>
                  <View style={[styles.deviceFill, { width: `${d.pct}%` }]} />
                </View>
                <Text style={styles.devicePct}>{d.pct}%</Text>
              </View>
            ))}
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>{u.home.profilesCardsTitle}</Text>
        <Text style={styles.sectionHint}>{u.home.profilesCardsHint}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {(
            [
              u.home.chipPersonal,
              u.home.chipWork,
              u.home.chipSideHustle,
              u.home.chipEvent,
            ] as const
          ).map((c) => (
            <View key={c} style={styles.chip}>
              <Text style={styles.chipText}>{c}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{u.home.activeCardsTitle}</Text>
        {myCards.length === 0 ? (
          <View style={styles.emptyActiveCards}>
            <Text style={styles.emptyActiveCardsTitle}>{u.home.noCardsTitle}</Text>
            <Text style={styles.emptyActiveCardsBody}>{u.home.noCardsBody}</Text>
            <Pressable
              style={({ pressed }) => [styles.emptyActiveCardsCta, pressed && { opacity: 0.92 }]}
              onPress={goCreateNfcCard}
              accessibilityRole="button"
              accessibilityLabel={u.home.createNfcCard}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.onAccent} />
              <Text style={styles.emptyActiveCardsCtaText}>{u.home.createNfcCard}</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
            {myCards.map((card: UserNfcCard) => (
              <View
                key={card.id}
                style={[
                  styles.nfcCard,
                  card.variant === 'light' ? styles.nfcCardLight : styles.nfcCardDark,
                ]}
              >
                <Text
                  style={[
                    styles.nfcCardTitle,
                    card.variant === 'light' ? styles.nfcCardTitleLight : styles.nfcCardTitleDark,
                  ]}
                  numberOfLines={2}
                >
                  {card.title}
                </Text>
                <View style={styles.nfcCardFooter}>
                  <Ionicons
                    name="share-outline"
                    size={16}
                    color={card.variant === 'light' ? '#52525b' : 'rgba(255,255,255,0.6)'}
                  />
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={16}
                    color={card.variant === 'light' ? '#52525b' : 'rgba(255,255,255,0.6)'}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        <Pressable style={styles.addCardGhost} onPress={goShop}>
          <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
          <Text style={styles.addCardGhostText}>{u.home.addCard}</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>{u.home.browseAccessoriesTitle}</Text>
        <Text style={styles.sectionHint}>{u.home.browseAccessoriesHint}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accessoryRow}>
          {MOCK_ACCESSORIES.map((a) => (
            <View key={a.id} style={styles.accessoryCard}>
              <View style={styles.accessoryTag}>
                <Text style={styles.accessoryTagText}>{a.tag}</Text>
              </View>
              <Text style={styles.accessoryTitle}>{a.title}</Text>
              <Text style={styles.accessoryPrice}>{a.priceLabel}</Text>
              <Pressable style={styles.accessoryBtn} onPress={() => {}}>
                <Text style={styles.accessoryBtnText}>{u.home.view}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{u.home.customizationRoadmapTitle}</Text>
        <View style={styles.roadmapGrid}>
          {[
            { icon: 'color-palette-outline' as const, t: u.home.roadmap1t, s: u.home.roadmap1s },
            { icon: 'grid-outline' as const, t: u.home.roadmap2t, s: u.home.roadmap2s },
            { icon: 'chatbubbles-outline' as const, t: u.home.roadmap3t, s: u.home.roadmap3s },
            { icon: 'phone-portrait-outline' as const, t: u.home.roadmap4t, s: u.home.roadmap4s },
          ].map((item) => (
            <View key={item.t} style={styles.roadmapTile}>
              <Ionicons name={item.icon} size={22} color={colors.accent} />
              <Text style={styles.roadmapTitle}>{item.t}</Text>
              <Text style={styles.roadmapSub}>{item.s}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{u.home.portfolioTitle}</Text>
        <Text style={styles.sectionHint}>{u.home.portfolioHint}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portfolioRow}>
          {MOCK_PORTFOLIO_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (item.opensLinkBuilder) {
                  router.push({ pathname: '/link-page', params: journeyParams });
                  return;
                }
                Alert.alert('TapIt', `${item.label} ${u.home.portfolioSampleAlert}`);
              }}
              style={({ pressed }) => [
                styles.portfolioTile,
                item.tone === 'dark' ? styles.portfolioDark : styles.portfolioImage,
                pressed && styles.pressed,
              ]}
            >
              {item.tone === 'dark' ? (
                <Ionicons name={item.opensLinkBuilder ? 'link' : 'brush-outline'} size={28} color="#818cf8" />
              ) : (
                <View style={styles.portfolioImageStub} />
              )}
              <Text style={styles.portfolioLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{u.home.leadCaptureTitle}</Text>
        <Text style={styles.sectionHint}>{u.home.leadCaptureHint}</Text>
        <View style={styles.leadCard}>
          <Text style={styles.leadCardTitle}>{u.home.visitorFields}</Text>
          <TextField
            label={u.home.name}
            value={leadName}
            onChangeText={setLeadName}
            placeholder={u.home.placeholderName}
            containerStyle={styles.leadField}
            {...tf}
          />
          <TextField
            label={u.home.email}
            value={leadEmail}
            onChangeText={setLeadEmail}
            placeholder={u.home.placeholderEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.leadField}
            {...tf}
          />
          <TextField
            label={u.home.company}
            value={leadCompany}
            onChangeText={setLeadCompany}
            placeholder={u.home.placeholderCompany}
            containerStyle={styles.leadField}
            {...tf}
          />
          <Pressable style={({ pressed }) => [styles.leadCta, pressed && styles.pressed]} onPress={() => {}}>
            <Text style={styles.leadCtaText}>{u.home.leadCta}</Text>
          </Pressable>
        </View>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={20} color={GREEN} />
          <Text style={styles.securityNoteText}>{u.home.securityNote}</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {(
          [
            { icon: 'home-outline' as const, key: 'home' as const },
            { icon: 'card-outline' as const, key: 'cards' as const },
            { icon: 'stats-chart-outline' as const, key: 'analytics' as const },
            { icon: 'bag-outline' as const, key: 'shop' as const },
            { icon: 'person-outline' as const, key: 'profile' as const },
          ] as const
        ).map((tab) => {
          const active = tabActive(tab.key);
          return (
            <Pressable key={tab.key} style={styles.tabItem} onPress={() => onTabPress(tab.key)}>
              <Ionicons name={tab.icon} size={22} color={active ? colors.text : colors.muted} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{u.nav[tab.key]}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
