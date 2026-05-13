import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { ProfileIdentityFields } from '@/src/features/profile/ProfileIdentityFields';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function paramToString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return undefined;
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const raw = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const guestRaw = (paramToString(raw.guest) || '').toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';
  const routeDisplayName = paramToString(raw.displayName);

  const { profile, colors, setProfile, setColorMode, setAccentHex, hydrated } = useUserProfile();
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
        contentContainerStyle={[styles.scroll, { paddingBottom: 28 + insets.bottom }]}
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

        <ProfileIdentityFields
          profile={profile}
          colors={colors}
          setProfile={setProfile}
          setColorMode={setColorMode}
          setAccentHex={setAccentHex}
          isGuest={isGuest}
          context="profile"
        />

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>{u.profile.memberSince}</Text>
        <Text style={[styles.memberSince, { color: colors.text }]}>
          {new Date(profile.memberSinceIso).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </ScrollView>
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
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  memberSince: { fontSize: 16, fontWeight: '600' },
});
