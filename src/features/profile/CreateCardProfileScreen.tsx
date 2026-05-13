import { TextField } from '@/src/components/TextField';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { createCardProfile } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export function CreateCardProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, addCardProfile } = useUserProfile();
  const { u } = useAppPreferences();
  const s = u.createCardProfile;

  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [website, setWebsite] = useState('');
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  const tf = {
    labelColor: colors.muted,
    inputBackgroundColor: colors.surface,
    inputBorderColor: colors.border,
    inputTextColor: colors.text,
  };

  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    return url.trim().startsWith('https://');
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(s.headerTitle, s.nameRequired);
      return;
    }

    const links: { key: string; label: string; value: string }[] = [
      { key: 'instagram', label: s.instagram, value: instagram },
      { key: 'twitter', label: s.twitter, value: twitter },
      { key: 'facebook', label: s.facebook, value: facebook },
      { key: 'linkedin', label: s.linkedin, value: linkedin },
      { key: 'tiktok', label: s.tiktok, value: tiktok },
      { key: 'website', label: s.website, value: website },
    ];

    const errors: Record<string, string> = {};
    for (const link of links) {
      if (!isValidUrl(link.value)) {
        errors[link.key] = `Double check the URL — it should start with https://`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setUrlErrors(errors);
      return;
    }

    setUrlErrors({});
    const cp = createCardProfile(name.trim());
    cp.socialInstagram = instagram.trim();
    cp.socialTwitter = twitter.trim();
    cp.socialFacebook = facebook.trim();
    cp.socialLinkedin = linkedin.trim();
    cp.socialTiktok = tiktok.trim();
    cp.socialWebsite = website.trim();
    addCardProfile(cp);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel={s.cancel}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{s.headerTitle}</Text>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.accent }, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
        >
          <Text style={[styles.saveBtnText, { color: colors.onAccent }]}>{s.save}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{s.nameLabel}</Text>
        <Text style={[styles.sectionHint, { color: colors.muted }]}>{s.nameHint}</Text>
        <TextField
          label={s.nameLabel}
          value={name}
          onChangeText={setName}
          placeholder={s.namePlaceholder}
          autoFocus
          {...tf}
        />

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>{s.socialTitle}</Text>
        <Text style={[styles.sectionHint, { color: colors.muted }]}>{s.socialHint}</Text>

        <TextField
          label={s.instagram}
          value={instagram}
          onChangeText={(t) => { setInstagram(t); setUrlErrors((p) => { const n = { ...p }; delete n.instagram; return n; }); }}
          placeholder={s.placeholderInstagram}
          autoCapitalize="none"
          keyboardType="url"
          error={urlErrors.instagram}
          {...tf}
        />
        <TextField
          label={s.twitter}
          value={twitter}
          onChangeText={(t) => { setTwitter(t); setUrlErrors((p) => { const n = { ...p }; delete n.twitter; return n; }); }}
          placeholder={s.placeholderTwitter}
          autoCapitalize="none"
          keyboardType="url"
          error={urlErrors.twitter}
          {...tf}
        />
        <TextField
          label={s.facebook}
          value={facebook}
          onChangeText={(t) => { setFacebook(t); setUrlErrors((p) => { const n = { ...p }; delete n.facebook; return n; }); }}
          placeholder={s.placeholderFacebook}
          autoCapitalize="none"
          keyboardType="url"
          error={urlErrors.facebook}
          {...tf}
        />
        <TextField
          label={s.linkedin}
          value={linkedin}
          onChangeText={(t) => { setLinkedin(t); setUrlErrors((p) => { const n = { ...p }; delete n.linkedin; return n; }); }}
          placeholder={s.placeholderLinkedin}
          autoCapitalize="none"
          keyboardType="url"
          error={urlErrors.linkedin}
          {...tf}
        />
        <TextField
          label={s.tiktok}
          value={tiktok}
          onChangeText={(t) => { setTiktok(t); setUrlErrors((p) => { const n = { ...p }; delete n.tiktok; return n; }); }}
          placeholder={s.placeholderTiktok}
          autoCapitalize="none"
          keyboardType="url"
          error={urlErrors.tiktok}
          {...tf}
        />
        <TextField
          label={s.website}
          value={website}
          onChangeText={(t) => { setWebsite(t); setUrlErrors((p) => { const n = { ...p }; delete n.website; return n; }); }}
          placeholder={s.placeholderWebsite}
          autoCapitalize="none"
          keyboardType="url"
          error={urlErrors.website}
          {...tf}
        />
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
  headerTitle: { fontSize: 18, fontWeight: '700' },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sectionHint: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
});
