import { TextField } from '@/src/components/TextField';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import {
  applyProfileDefaultsToLinkPage,
  loadLinkPageState,
  saveLinkPageState,
} from '@/src/features/linkPage/linkPageStorage';
import { BIO_MAX_WORDS, countWords, type UserProfileState } from '@/src/features/profile/profileTypes';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { formatUiString } from '@/src/i18n/ui/formatUiString';
import { setPendingNfcDestination } from '@/src/features/tapitOnboarding/pendingNfcDestination';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  buildPublicPageUrl,
  defaultLinkPageState,
  publicPageBaseUrl,
  randomPublicSlug,
  type LinkPageState,
} from '@/src/features/linkPage/linkPageTypes';

function paramToString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (Array.isArray(v) && v[0]) return String(v[0]).trim();
  return undefined;
}

function newRowId(): string {
  return `l_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function LinkPageBuilderScreen() {
  const insets = useSafeAreaInsets();
  const raw = useLocalSearchParams<{ displayName?: string | string[]; guest?: string | string[] }>();
  const guestRaw = (paramToString(raw.guest) || '').toLowerCase();
  const isGuest = guestRaw === '1' || guestRaw === 'true' || guestRaw === 'yes';

  const { u } = useAppPreferences();
  const { profile, colors, hydrated } = useUserProfile();
  const [page, setPage] = useState<LinkPageState>(() => defaultLinkPageState());
  const [storageLoaded, setStorageLoaded] = useState(false);

  const journeyParams = useMemo(() => {
    const p: Record<string, string> = {};
    const g = paramToString(raw.guest);
    const d = isGuest ? paramToString(raw.displayName) : profile.displayName;
    if (g) p.guest = g;
    if (d) p.displayName = d;
    return p;
  }, [raw.guest, raw.displayName, isGuest, profile.displayName]);

  useEffect(() => {
    void (async () => {
      const s = await loadLinkPageState();
      setPage(s);
      setStorageLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!storageLoaded || !hydrated || isGuest) return;
    setPage((prev) => {
      if (prev.didApplyInitialProfileDefaults) return prev;
      const merged = applyProfileDefaultsToLinkPage(prev, profile as UserProfileState);
      void saveLinkPageState(merged);
      return merged;
    });
  }, [storageLoaded, hydrated, isGuest, profile]);

  const patchPage = useCallback((partial: Partial<LinkPageState>) => {
    setPage((prev) => {
      const next = { ...prev, ...partial };
      void saveLinkPageState(next);
      return next;
    });
  }, []);

  const tf = {
    labelColor: colors.muted,
    inputBackgroundColor: colors.surface,
    inputBorderColor: colors.border,
    inputTextColor: colors.text,
  };

  const bioWords = countWords(page.bio);
  const bioTooLong = bioWords > BIO_MAX_WORDS;

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(u.linkPage.headerTitle, u.linkPage.photosPicker);
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      patchPage({ photoUri: res.assets[0].uri });
    }
  };

  const addPresetRow = (platform: string) => {
    setPage((prev) => {
      const next = { ...prev, links: [...prev.links, { id: newRowId(), platform, url: '' }] };
      void saveLinkPageState(next);
      return next;
    });
  };

  const updateLink = (id: string, field: 'platform' | 'url', value: string) => {
    setPage((prev) => {
      const next = {
        ...prev,
        links: prev.links.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
      };
      void saveLinkPageState(next);
      return next;
    });
  };

  const removeLink = (id: string) => {
    setPage((prev) => {
      const next = { ...prev, links: prev.links.filter((r) => r.id !== id) };
      void saveLinkPageState(next);
      return next;
    });
  };

  const publicUrl = page.publicSlug ? buildPublicPageUrl(page.publicSlug) : null;

  const onExport = async () => {
    if (!page.firstName.trim() && !page.lastName.trim()) {
      Alert.alert(u.linkPage.alertAlmostTitle, u.linkPage.alertAlmostBody);
      return;
    }
    if (bioTooLong) {
      Alert.alert(
        u.linkPage.alertBioTitle,
        formatUiString(u.linkPage.alertBioBody, { max: BIO_MAX_WORDS }),
      );
      return;
    }

    const slug = page.publicSlug ?? randomPublicSlug(8);
    const next: LinkPageState = {
      ...page,
      publicSlug: slug,
      exportedAtIso: new Date().toISOString(),
    };
    setPage(next);
    await saveLinkPageState(next);

    const url = buildPublicPageUrl(slug);
    try {
      await Share.share({
        message: formatUiString(u.linkPage.shareMessage, { url }),
        url,
      });
    } catch {
      /* user dismissed share sheet */
    }
    Alert.alert(
      u.linkPage.alertExportedTitle,
      formatUiString(u.linkPage.alertExportedBody, { url }),
    );
  };

  const goProgramNfc = async () => {
    if (!publicUrl) {
      Alert.alert(u.linkPage.alertExportFirstTitle, u.linkPage.alertExportFirstBody);
      return;
    }
    await setPendingNfcDestination(publicUrl);
    router.push({ pathname: '/card-journey', params: journeyParams });
  };

  const goHome = () => {
    router.replace({ pathname: '/home', params: journeyParams });
  };

  const displayNamePreview =
    [page.firstName, page.lastName].filter(Boolean).join(' ') || u.linkPage.previewPlaceholderName;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      {isGuest ? (
        <View style={[styles.ribbon, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.ribbonText, { color: colors.muted }]}>{u.linkPage.guestRibbon}</Text>
        </View>
      ) : null}

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={goHome}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          accessibilityLabel={u.analytics.backA11y}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{u.linkPage.headerTitle}</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 32 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lead, { color: colors.muted }]}>{u.linkPage.lead}</Text>

        <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable onPress={pickPhoto} style={styles.photoPress}>
            {page.photoUri ? (
              <Image source={{ uri: page.photoUri }} style={styles.photo} />
            ) : (
              <View style={[styles.photoPlaceholder, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                <Ionicons name="camera-outline" size={28} color={colors.muted} />
              </View>
            )}
            <View style={[styles.photoEdit, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="image-outline" size={16} color={colors.text} />
            </View>
          </Pressable>
          <Text style={[styles.previewName, { color: colors.text }]}>{displayNamePreview}</Text>
          {page.pronouns.trim() ? (
            <Text style={[styles.previewPro, { color: colors.muted }]}>{page.pronouns.trim()}</Text>
          ) : null}
          <Text style={[styles.previewHint, { color: colors.muted }]}>
            {page.links.filter((l) => l.url.trim()).length} links ·{' '}
            {publicUrl ? u.linkPage.linksReady : u.linkPage.notExported}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{u.linkPage.namePronouns}</Text>
        <TextField
          label={u.linkPage.firstName}
          value={page.firstName}
          onChangeText={(t) => patchPage({ firstName: t })}
          placeholder={u.linkPage.placeholderFirst}
          {...tf}
        />
        <TextField
          label={u.linkPage.lastName}
          value={page.lastName}
          onChangeText={(t) => patchPage({ lastName: t })}
          placeholder={u.linkPage.placeholderLast}
          {...tf}
        />
        <TextField
          label={u.linkPage.pronouns}
          value={page.pronouns}
          onChangeText={(t) => patchPage({ pronouns: t })}
          placeholder={u.linkPage.placeholderPronouns}
          {...tf}
        />

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 12 }]}>{u.linkPage.bioTitle}</Text>
        <Text style={[styles.sectionHint, { color: colors.muted }]}>
          {formatUiString(u.profileFields.bioWords, { max: BIO_MAX_WORDS })}
        </Text>
        <Text style={[styles.label, { color: colors.muted }]}>{u.linkPage.aboutYou}</Text>
        <TextInput
          style={[
            styles.bioInput,
            {
              backgroundColor: colors.surface,
              borderColor: bioTooLong ? '#f87171' : colors.border,
              color: colors.text,
            },
          ]}
          placeholder={u.linkPage.bioPlaceholder}
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          value={page.bio}
          onChangeText={(t) => patchPage({ bio: t })}
        />
        <Text style={[styles.wordCount, { color: bioTooLong ? '#f87171' : colors.muted }]}>
          {bioWords}/{BIO_MAX_WORDS} {u.profileFields.wordsCount}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>{u.linkPage.socialLinksTitle}</Text>
        <Text style={[styles.sectionHint, { color: colors.muted }]}>{u.linkPage.socialLinksHint}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
          {u.linkPagePresets.map((p) => (
            <Pressable
              key={p}
              onPress={() => addPresetRow(p)}
              style={({ pressed }) => [
                styles.presetChip,
                { borderColor: colors.border, backgroundColor: colors.surface },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={[styles.presetChipText, { color: colors.text }]}>+ {p}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          onPress={() => addPresetRow(u.linkPage.customPlatform)}
          style={({ pressed }) => [styles.addCustomRow, { borderColor: colors.accent }, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
          <Text style={[styles.addCustomText, { color: colors.accent }]}>{u.linkPage.addCustomRow}</Text>
        </Pressable>

        {page.links.map((row) => (
          <View key={row.id} style={[styles.linkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.linkCardTop}>
              <Text style={[styles.linkCardLabel, { color: colors.muted }]}>{u.linkPage.platform}</Text>
              <Pressable onPress={() => removeLink(row.id)} hitSlop={8} accessibilityLabel={u.linkPage.removeLinkA11y}>
                <Ionicons name="trash-outline" size={20} color="#f87171" />
              </Pressable>
            </View>
            <TextInput
              style={[
                styles.linkInput,
                { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text },
              ]}
              value={row.platform}
              onChangeText={(t) => updateLink(row.id, 'platform', t)}
              placeholder={u.linkPage.platformPlaceholder}
              placeholderTextColor={colors.muted}
            />
            <Text style={[styles.linkCardLabel, { color: colors.muted, marginTop: 10 }]}>{u.linkPage.url}</Text>
            <TextInput
              style={[
                styles.linkInput,
                { backgroundColor: colors.surface2, borderColor: colors.border, color: colors.text },
              ]}
              value={row.url}
              onChangeText={(t) => updateLink(row.id, 'url', t)}
              placeholder={u.linkPage.urlPlaceholder}
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        ))}

        {publicUrl ? (
          <View style={[styles.urlCard, { backgroundColor: `${colors.accent}12`, borderColor: `${colors.accent}40` }]}>
            <Text style={[styles.urlCardTitle, { color: colors.text }]}>{u.linkPage.liveUrl}</Text>
            <Text selectable style={[styles.urlText, { color: colors.accent }]}>
              {publicUrl}
            </Text>
            {page.exportedAtIso ? (
              <Text style={[styles.exportedMeta, { color: colors.muted }]}>
                {u.linkPage.exportedPrefix} {new Date(page.exportedAtIso).toLocaleString()}
              </Text>
            ) : null}
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            { backgroundColor: colors.accent },
            pressed && { opacity: 0.92 },
          ]}
          onPress={() => void onExport()}
        >
          <Ionicons name="share-outline" size={20} color={colors.onAccent} />
          <Text style={[styles.primaryBtnText, { color: colors.onAccent }]}>{u.linkPage.exportCta}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryBtn,
            { borderColor: colors.border, backgroundColor: colors.surface },
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => void goProgramNfc()}
        >
          <Ionicons name="hardware-chip-outline" size={20} color={colors.text} />
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>{u.linkPage.nfcJourneyCta}</Text>
        </Pressable>

        <Text style={[styles.footnote, { color: colors.muted }]}>
          {formatUiString(u.linkPage.footnote, { base: publicPageBaseUrl() })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  ribbon: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ribbonText: { fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 17 },
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
  lead: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 22,
  },
  photoPress: { position: 'relative', marginBottom: 12 },
  photo: { width: 88, height: 88, borderRadius: 44 },
  photoPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEdit: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  previewName: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  previewPro: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  previewHint: { fontSize: 12, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sectionHint: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  bioInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  wordCount: { fontSize: 12, marginTop: 6, alignSelf: 'flex-end' },
  presetRow: { gap: 8, paddingBottom: 12, flexDirection: 'row' },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  presetChipText: { fontSize: 13, fontWeight: '600' },
  addCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 6,
  },
  addCustomText: { fontSize: 15, fontWeight: '600' },
  linkCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  linkCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  linkCardLabel: { fontSize: 12, fontWeight: '600' },
  linkInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  urlCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  urlCardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  urlText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  exportedMeta: { fontSize: 12, marginTop: 8 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600' },
  footnote: { fontSize: 12, lineHeight: 17, textAlign: 'center' },
});
