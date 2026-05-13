import { SettingsSubpageHeader } from '@/src/components/SettingsSubpageHeader';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { APP_LOCALE_OPTIONS, type AppLocale } from '@/src/i18n/appLocales';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LanguageSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useUserProfile();
  const { preferences, setLocale, s } = useAppPreferences();

  const select = (code: AppLocale) => {
    setLocale(code);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['bottom']}>
      <SettingsSubpageHeader title={s.languageTitle} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lead, { color: colors.muted }]}>{s.languageLead}</Text>

        {APP_LOCALE_OPTIONS.map((opt) => {
          const on = preferences.locale === opt.code;
          return (
            <Pressable
              key={opt.code}
              onPress={() => select(opt.code)}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: colors.surface, borderColor: on ? colors.accent : colors.border },
                pressed && { opacity: 0.88 },
              ]}
            >
              <View style={styles.rowText}>
                <Text style={[styles.native, { color: colors.text }]}>{opt.labelNative}</Text>
                <Text style={[styles.en, { color: colors.muted }]}>{opt.labelEn}</Text>
              </View>
              {on ? <Ionicons name="checkmark-circle" size={24} color={colors.accent} /> : null}
            </Pressable>
          );
        })}

        <Text style={[styles.footnote, { color: colors.muted }]}>{s.languageFootnote}</Text>
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
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  rowText: { flex: 1, paddingRight: 12 },
  native: { fontSize: 17, fontWeight: '700' },
  en: { fontSize: 13, marginTop: 4 },
  footnote: { fontSize: 12, lineHeight: 17, marginTop: 12 },
});
