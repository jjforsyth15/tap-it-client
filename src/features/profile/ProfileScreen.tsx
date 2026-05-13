import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import type { CardProfile } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { mainTabIsActive } from '@/src/navigation/mainTabNav';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { countWords } from '@/src/features/profile/profileTypes';
import React, { useEffect, useMemo, useRef } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function paramToString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return undefined;
}

type HomeTabKey = 'home' | 'profile';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const raw = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const guestRaw = (paramToString(raw.guest) || '').toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';
  const routeDisplayName = paramToString(raw.displayName);

  const { profile, colors, setProfile, cardProfiles, hydrated } = useUserProfile();
  const { u } = useAppPreferences();
  const seededFromRoute = useRef(false);

  useEffect(() => {
    if (!hydrated || isGuest || seededFromRoute.current || !routeDisplayName) return;
    seededFromRoute.current = true;
    setProfile({ displayName: routeDisplayName });
  }, [hydrated, isGuest, routeDisplayName, setProfile]);

  const journeyParams = useMemo(() => {
    const p: Record<string, string> = {};
    const g = paramToString(raw.guest);
    const d = paramToString(raw.displayName) || profile.displayName;
    if (g) p.guest = g;
    if (d) p.displayName = d;
    return p;
  }, [raw.guest, raw.displayName, profile.displayName]);

  const goHome = () => {
    router.replace({ pathname: '/home', params: journeyParams });
  };

  const openSettings = () => {
    router.push('/settings');
  };

  const onTabPress = (key: HomeTabKey) => {
    if (key === 'home') {
      router.replace({ pathname: '/home', params: journeyParams });
      return;
    }
    router.replace({ pathname: '/profile', params: journeyParams });
  };

  const tabActive = (key: HomeTabKey) => mainTabIsActive(pathname, segments, key);

  const pickImage = async () => {
    if (isGuest) {
      Alert.alert(u.profile.headerTitle, u.profile.photoSignIn);
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(u.profile.headerTitle, u.profile.photosAllow);
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      setProfile({ profileImageUri: res.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      {isGuest ? (
        <View style={[styles.guestRibbon, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.guestRibbonText, { color: colors.muted }]}>{u.common.guestRibbon}</Text>
        </View>
      ) : null}
      {profile.accountStatus === 'disabled' ? (
        <View style={[styles.banner, { backgroundColor: colors.surface2, borderBottomColor: colors.border }]}>
          <Ionicons name="pause-circle" size={18} color={colors.muted} />
          <Text style={[styles.bannerText, { color: colors.text }]}>{u.profile.bannerDisabled}</Text>
        </View>
      ) : null}

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={goHome}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={u.profile.backA11y}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{u.profile.headerTitle}</Text>
        <Pressable
          onPress={openSettings}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={u.profile.settingsA11y}
        >
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 100 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarBlock}>
          <Pressable onPress={pickImage} style={styles.avatarPress}>
            {profile.profileImageUri ? (
              <Image source={{ uri: profile.profileImageUri }} style={styles.avatarImg} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.accent }]}>
                <Text style={[styles.avatarLetter, { color: colors.onAccent }]}>
                  {profile.displayName.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={[styles.avatarEdit, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="camera" size={16} color={colors.text} />
            </View>
          </Pressable>
          <Text style={[styles.avatarHint, { color: colors.muted }]}>{u.profile.avatarHint}</Text>
        </View>

        <Text style={[styles.displayName, { color: colors.text }]}>{profile.displayName}</Text>

        <Text style={[styles.bioLabel, { color: colors.muted }]}>Bio (20 words max)</Text>
        <TextInput
          style={[
            styles.bioInput,
            {
              backgroundColor: colors.surface,
              borderColor: countWords(profile.bio) > 20 ? '#f87171' : colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Tell people what you do…"
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          value={profile.bio}
          onChangeText={(t) => setProfile({ bio: t })}
          editable={!isGuest}
        />
        <Text style={[styles.wordCount, { color: countWords(profile.bio) > 20 ? '#f87171' : colors.muted }]}>
          {countWords(profile.bio)}/20 words
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{u.profile.pickUserTitle}</Text>
        <Text style={[styles.sectionHint, { color: colors.muted }]}>{u.profile.pickUserHint}</Text>

        {cardProfiles.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="person-add-outline" size={32} color={colors.muted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{u.profile.noUsersYet}</Text>
            <Text style={[styles.emptyHint, { color: colors.muted }]}>{u.profile.noUsersHint}</Text>
          </View>
        ) : (
          <View style={styles.cardList}>
            {cardProfiles.map((cp: CardProfile) => {
              const linkCount = [
                cp.socialInstagram,
                cp.socialTwitter,
                cp.socialFacebook,
                cp.socialLinkedin,
                cp.socialTiktok,
                cp.socialWebsite,
              ].filter(Boolean).length;
              return (
                <Pressable
                  key={cp.id}
                  onPress={() => router.push({ pathname: '/view-card-profile', params: { id: cp.id } })}
                  style={({ pressed }) => [
                    styles.userCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={[styles.userCardIcon, { backgroundColor: `${colors.accent}22` }]}>
                    <Ionicons name="person" size={20} color={colors.accent} />
                  </View>
                  <View style={styles.userCardBody}>
                    <Text style={[styles.userCardName, { color: colors.text }]}>{cp.name}</Text>
                    <Text style={[styles.userCardMeta, { color: colors.muted }]}>
                      {linkCount} {linkCount === 1 ? 'link' : 'links'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          onPress={() => router.push('/create-card-profile')}
          style={({ pressed }) => [
            styles.createBtn,
            { backgroundColor: colors.accent },
            pressed && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={20} color={colors.onAccent} />
          <Text style={[styles.createBtnText, { color: colors.onAccent }]}>{u.profile.createUser}</Text>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>{u.profile.memberSince}</Text>
        <Text style={[styles.memberSince, { color: colors.text }]}>
          {new Date(profile.memberSinceIso).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12), backgroundColor: colors.bg, borderTopColor: colors.border }]}>
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
              <Text style={[styles.tabLabel, { color: colors.muted }, active && styles.tabLabelActive && { color: colors.text }]}>
                {u.nav[tab.key]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  guestRibbon: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  guestRibbonText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bannerText: { flex: 1, fontSize: 13, lineHeight: 18 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  avatarBlock: { alignItems: 'center', marginBottom: 20 },
  avatarPress: { position: 'relative' },
  avatarImg: { width: 96, height: 96, borderRadius: 48 },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontSize: 36, fontWeight: '800' },
  avatarEdit: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarHint: { marginTop: 10, fontSize: 12 },
  displayName: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  bioLabel: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  bioInput: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  wordCount: { fontSize: 12, marginTop: 6, alignSelf: 'flex-end', marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sectionHint: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  emptyCard: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyHint: { fontSize: 13, lineHeight: 18, textAlign: 'center' },
  cardList: { gap: 10, marginBottom: 16 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  userCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCardBody: { flex: 1 },
  userCardName: { fontSize: 15, fontWeight: '700' },
  userCardMeta: { fontSize: 12, marginTop: 2 },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    marginBottom: 8,
  },
  createBtnText: { fontSize: 15, fontWeight: '700' },
  memberSince: { fontSize: 16, fontWeight: '600' },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tabItem: { alignItems: 'center', gap: 4, minWidth: 72 },
  tabLabel: { fontSize: 10, fontWeight: '500' },
  tabLabelActive: { fontWeight: '700' },
});
