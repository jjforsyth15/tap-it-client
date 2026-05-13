import { SettingsSubpageHeader } from '@/src/components/SettingsSubpageHeader';
import { HELP_CENTER_URL, SUPPORT_EMAIL } from '@/src/constants/legalLinks';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
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

export default function SupportSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useUserProfile();
  const { s } = useAppPreferences();

  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('TapIt support')}`;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['bottom']}>
      <SettingsSubpageHeader title={s.supportTitle} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lead, { color: colors.muted }]}>{s.supportLead}</Text>

        <Pressable
          onPress={() => void openExternal(mailto)}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name="mail-outline" size={22} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>{s.contactSupport}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>

        <Pressable
          onPress={() => void openExternal(HELP_CENTER_URL)}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Ionicons name="globe-outline" size={22} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>{s.helpCenter}</Text>
          <Ionicons name="open-outline" size={20} color={colors.muted} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  lead: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  title: { flex: 1, fontSize: 16, fontWeight: '600' },
});
