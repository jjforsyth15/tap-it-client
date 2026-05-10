import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import type { AppThemeColors, ColorMode, UserNfcCard } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { mainTabIsActive } from '@/src/navigation/mainTabNav';
import { router, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import NfcReader from '../../../NFC/NfcReader';

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
    welcomeSub: { fontSize: 14, color: c.muted, marginBottom: 24, lineHeight: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: c.text, marginBottom: 6 },
    sectionHint: { fontSize: 13, color: c.muted, marginBottom: 14, lineHeight: 18 },
    cardsRow: { gap: 14, paddingBottom: 24, paddingRight: 8 },
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
    tabItem: { alignItems: 'center', gap: 4, minWidth: 72 },
    tabLabel: { fontSize: 10, color: c.muted, fontWeight: '500' },
    tabLabelActive: { color: c.text, fontWeight: '700' },
  });
}

type HomeTabKey = 'home' | 'profile';

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

  const goProfile = () => {
    router.push({ pathname: '/profile', params: journeyParams });
  };

  const onTabPress = (key: HomeTabKey) => {
    if (key === 'home') {
      router.replace({ pathname: '/home', params: journeyParams });
      return;
    }
    goProfile();
  };

  const tabActive = (key: HomeTabKey) => {
    if (key === 'home') return mainTabIsActive(pathname, segments, 'home');
    return mainTabIsActive(pathname, segments, 'profile');
  };

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
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel="Open settings"
          >
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.welcome}>
          {u.home.welcomeBack} {displayName}
        </Text>
        <Text style={styles.welcomeSub}>{u.home.welcomeSub}</Text>

        <Text style={styles.sectionTitle}>{u.home.activeCardsTitle}</Text>
        <Text style={styles.sectionHint}>{u.home.profilesCardsHint}</Text>
        {myCards.length === 0 ? (
          <View style={styles.emptyActiveCards}>
            <Text style={styles.emptyActiveCardsTitle}>{u.home.noCardsTitle}</Text>
            <Text style={styles.emptyActiveCardsBody}>{u.home.noCardsBody}</Text>
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

        <NfcReader />
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {(
          [
            { icon: 'home-outline' as const, key: 'home' as const },
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
