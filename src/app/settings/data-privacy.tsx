import { SettingsSubpageHeader } from '@/src/components/SettingsSubpageHeader';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '@/src/constants/legalLinks';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

async function openExternal(url: string) {
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert('Cannot open link', url);
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Cannot open link', 'Check the URL and try again.');
  }
}

export default function DataPrivacySettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useUserProfile();
  const { preferences, setPreferences, s } = useAppPreferences();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['bottom']}>
      <SettingsSubpageHeader title={s.dataPrivacyTitle} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lead, { color: colors.muted }]}>{s.dataPrivacyLead}</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.title, { color: colors.text }]}>{s.improveService}</Text>
              <Text style={[styles.sub, { color: colors.muted }]}>{s.improveServiceSub}</Text>
            </View>
            <Switch
              value={preferences.useDataToImprove}
              onValueChange={(v) => setPreferences({ useDataToImprove: v })}
              trackColor={{ false: colors.border, true: `${colors.accent}88` }}
              thumbColor={preferences.useDataToImprove ? colors.accent : '#f4f4f5'}
            />
          </View>
        </View>

        <Pressable
          onPress={() => void openExternal(TERMS_OF_SERVICE_URL)}
          style={({ pressed }) => [
            styles.linkRow,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name="document-text-outline" size={22} color={colors.accent} />
          <Text style={[styles.linkTitle, { color: colors.text }]}>{s.termsOfService}</Text>
          <Ionicons name="open-outline" size={20} color={colors.muted} />
        </Pressable>

        <Pressable
          onPress={() => void openExternal(PRIVACY_POLICY_URL)}
          style={({ pressed }) => [
            styles.linkRow,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name="lock-closed-outline" size={22} color={colors.accent} />
          <Text style={[styles.linkTitle, { color: colors.text }]}>{s.privacyPolicy}</Text>
          <Ionicons name="open-outline" size={20} color={colors.muted} />
        </Pressable>

        <Text style={[styles.note, { color: colors.muted }]}>Legal pages open in your default browser.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  lead: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowText: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sub: { fontSize: 13, lineHeight: 18 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  linkTitle: { flex: 1, fontSize: 16, fontWeight: '600' },
  note: { fontSize: 12, lineHeight: 17, marginTop: 8 },
});
