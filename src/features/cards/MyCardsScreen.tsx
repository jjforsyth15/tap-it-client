import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import type { AppThemeColors, ColorMode, UserNfcCard } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import type { MainTabKey } from '@/src/i18n/ui/types';
import { mainTabIsActive } from '@/src/navigation/mainTabNav';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function paramToString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return undefined;
}

function createStyles(c: AppThemeColors, colorMode: ColorMode) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg },
    guestRibbon: {
      backgroundColor: c.surface,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    guestRibbonText: { fontSize: 12, fontWeight: '600', color: c.muted, textAlign: 'center' },
    scroll: { paddingHorizontal: 20, paddingTop: 12 },
    title: { fontSize: 22, fontWeight: '800', color: c.text, marginBottom: 6 },
    subtitle: { fontSize: 14, color: c.muted, marginBottom: 20, lineHeight: 20 },
    emptyCard: {
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 20,
      marginBottom: 20,
      gap: 14,
    },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: c.text, lineHeight: 22 },
    emptyBody: { fontSize: 14, color: c.muted, lineHeight: 20 },
    primaryCta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.accent,
      paddingVertical: 14,
      borderRadius: 12,
    },
    primaryCtaText: { fontSize: 15, fontWeight: '700', color: c.onAccent },
    cardsRow: { gap: 14, paddingBottom: 12, paddingRight: 8, flexDirection: 'row', flexWrap: 'wrap' },
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
  });
}

function NfcCardTile({
  card,
  styles,
}: {
  card: UserNfcCard;
  styles: ReturnType<typeof createStyles>;
}) {
  const light = card.variant === 'light';
  return (
    <View
      style={[styles.nfcCard, light ? styles.nfcCardLight : styles.nfcCardDark]}
      accessibilityLabel={card.title}
    >
      <Text
        style={[styles.nfcCardTitle, light ? styles.nfcCardTitleLight : styles.nfcCardTitleDark]}
        numberOfLines={2}
      >
        {card.title}
      </Text>
      <View style={styles.nfcCardFooter}>
        <Ionicons
          name="share-outline"
          size={16}
          color={light ? '#52525b' : 'rgba(255,255,255,0.6)'}
        />
        <Ionicons
          name="ellipsis-horizontal"
          size={16}
          color={light ? '#52525b' : 'rgba(255,255,255,0.6)'}
        />
      </View>
    </View>
  );
}

export default function MyCardsScreen() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const raw = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const guestRaw = (paramToString(raw.guest) || '').toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';

  const { u } = useAppPreferences();
  const { profile, colors, myCards, refreshMyCards } = useUserProfile();

  useFocusEffect(
    useCallback(() => {
      if (!isGuest) void refreshMyCards();
    }, [isGuest, refreshMyCards]),
  );

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

  const goCreateCard = () => {
    router.push({ pathname: '/card-journey', params: journeyParams });
  };

  const onTabPress = (key: MainTabKey) => {
    if (key === 'home') {
      router.replace({ pathname: '/home', params: journeyParams });
      return;
    }
    if (key === 'cards') {
      router.replace({ pathname: '/my-cards', params: journeyParams });
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
      router.replace({ pathname: '/profile', params: journeyParams });
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

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{u.myCards.title}</Text>
        <Text style={styles.subtitle}>{u.myCards.subtitle}</Text>

        {myCards.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{u.myCards.emptyTitle}</Text>
            <Text style={styles.emptyBody}>{u.myCards.emptyBody}</Text>
            <Pressable
              style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.92 }]}
              onPress={goCreateCard}
              accessibilityRole="button"
              accessibilityLabel={u.myCards.createNfcA11y}
            >
              <Ionicons name="add-circle-outline" size={22} color={colors.onAccent} />
              <Text style={styles.primaryCtaText}>{u.myCards.createNfc}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cardsRow}>
            {myCards.map((card) => (
              <NfcCardTile key={card.id} card={card} styles={styles} />
            ))}
          </View>
        )}
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
