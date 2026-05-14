import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type SocialEntry = {
  label: string;
  url: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

export function ViewCardProfileScreen() {
  



  const insets = useSafeAreaInsets();
  const { colors, cardProfiles } = useUserProfile();
  const { u } = useAppPreferences();
  const { id } = useLocalSearchParams<{ id: string }>();

  const cp = cardProfiles.find((p) => p.id === id);

  if (!cp) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Not found</Text>
          <View style={styles.headerBtn} />
        </View>
      </SafeAreaView>
    );
  }

  const s = u.createCardProfile;

  const links: SocialEntry[] = [
    { label: s.instagram, url: cp.socialInstagram, icon: 'logo-instagram' },
    { label: s.twitter, url: cp.socialTwitter, icon: 'logo-twitter' },
    { label: s.facebook, url: cp.socialFacebook, icon: 'logo-facebook' },
    { label: s.linkedin, url: cp.socialLinkedin, icon: 'logo-linkedin' },
    { label: s.tiktok, url: cp.socialTiktok, icon: 'logo-tiktok' },
    { label: s.website, url: cp.socialWebsite, icon: 'globe-outline' },
  ];

  const filledLinks = links.filter((l) => l.url.trim().length > 0);

  const openLink = (url: string) => {
    void Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {cp.name}
        </Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.nameCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.nameIcon, { backgroundColor: `${colors.accent}22` }]}>
            <Ionicons name="person" size={28} color={colors.accent} />
          </View>
          <Text style={[styles.cardName, { color: colors.text }]}>{cp.name}</Text>
          <Text style={[styles.cardDate, { color: colors.muted }]}>
            Created {new Date(cp.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{s.socialTitle}</Text>

        {filledLinks.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.muted }]}>No links added yet.</Text>
        ) : (
          <View style={styles.linkList}>
            {filledLinks.map((link) => (
              <Pressable
                key={link.label}
                onPress={() => openLink(link.url)}
                style={({ pressed }) => [
                  styles.linkRow,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Ionicons name={link.icon} size={22} color={colors.accent} />
                <View style={styles.linkBody}>
                  <Text style={[styles.linkLabel, { color: colors.text }]}>{link.label}</Text>
                  <Text style={[styles.linkUrl, { color: colors.muted }]} numberOfLines={1}>
                    {link.url}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  nameCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 8,
  },
  nameIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardName: { fontSize: 20, fontWeight: '800' },
  cardDate: { fontSize: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  emptyText: { fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  linkList: { gap: 10 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  linkBody: { flex: 1 },
  linkLabel: { fontSize: 15, fontWeight: '600' },
  linkUrl: { fontSize: 12, marginTop: 2 },
});
