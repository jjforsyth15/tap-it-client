import { TextField } from '@/src/components/TextField';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import {
  ACCENT_COLOR_PRESETS,
  BIO_MAX_WORDS,
  countWords,
  type AppThemeColors,
  type ColorMode,
  type UserProfileState,
} from '@/src/features/profile/profileTypes';
import { formatUiString } from '@/src/i18n/ui/formatUiString';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  profile: UserProfileState;
  colors: AppThemeColors;
  setProfile: (patch: Partial<UserProfileState>) => void;
  setColorMode: (mode: ColorMode) => void;
  setAccentHex: (hex: string) => void;
  isGuest?: boolean;
  /** Where this block is shown — adjusts the display name hint copy. */
  context?: 'profile' | 'account';
};

export function ProfileIdentityFields({
  profile,
  colors,
  setProfile,
  setColorMode,
  setAccentHex,
  isGuest = false,
  context = 'profile',
}: Props) {
  const { u } = useAppPreferences();
  const pf = u.profileFields;
  const displayNameHint =
    context === 'account' ? pf.displayNameHintAccount : pf.displayNameHintProfile;

  const bioWords = countWords(profile.bio);
  const bioTooLong = bioWords > BIO_MAX_WORDS;

  const tf = {
    labelColor: colors.muted,
    inputBackgroundColor: colors.surface,
    inputBorderColor: colors.border,
    inputTextColor: colors.text,
  };

  const editable = !isGuest;

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{pf.displayName}</Text>
      <Text style={[styles.sectionHint, { color: colors.muted }]}>{displayNameHint}</Text>
      <TextField
        label={pf.displayName}
        value={profile.displayName}
        onChangeText={(t) => setProfile({ displayName: t })}
        placeholder={pf.placeholderYourName}
        editable={editable}
        {...tf}
      />

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>{pf.bioTitle}</Text>
      <Text style={[styles.sectionHint, { color: colors.muted }]}>
        {formatUiString(pf.bioWords, { max: BIO_MAX_WORDS })}
      </Text>
      <Text style={[styles.label, { color: colors.muted }]}>{pf.aboutYou}</Text>
      <TextInput
        style={[
          styles.bioInput,
          {
            backgroundColor: colors.surface,
            borderColor: bioTooLong ? '#f87171' : colors.border,
            color: colors.text,
          },
        ]}
        placeholder={pf.bioPlaceholder}
        placeholderTextColor={colors.muted}
        multiline
        textAlignVertical="top"
        value={profile.bio}
        onChangeText={(t) => setProfile({ bio: t })}
        editable={editable}
      />
      <Text style={[styles.wordCount, { color: bioTooLong ? '#f87171' : colors.muted }]}>
        {bioWords}/{BIO_MAX_WORDS} {pf.wordsCount}
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>{pf.socialTitle}</Text>
      <Text style={[styles.sectionHint, { color: colors.muted }]}>{pf.socialHint}</Text>
      <TextField
        label={pf.instagram}
        value={profile.socialInstagram}
        onChangeText={(t) => setProfile({ socialInstagram: t })}
        placeholder={pf.placeholderInstagram}
        autoCapitalize="none"
        keyboardType="url"
        editable={editable}
        {...tf}
      />
      <TextField
        label={pf.twitter}
        value={profile.socialTwitter}
        onChangeText={(t) => setProfile({ socialTwitter: t })}
        placeholder={pf.placeholderTwitter}
        autoCapitalize="none"
        keyboardType="url"
        editable={editable}
        {...tf}
      />
      <TextField
        label={pf.facebook}
        value={profile.socialFacebook}
        onChangeText={(t) => setProfile({ socialFacebook: t })}
        placeholder={pf.placeholderFacebook}
        autoCapitalize="none"
        keyboardType="url"
        editable={editable}
        {...tf}
      />
      <TextField
        label={pf.linkedin}
        value={profile.socialLinkedin}
        onChangeText={(t) => setProfile({ socialLinkedin: t })}
        placeholder={pf.placeholderLinkedin}
        autoCapitalize="none"
        keyboardType="url"
        editable={editable}
        {...tf}
      />

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>{pf.appearance}</Text>
      <View style={styles.modeRow}>
        <Text style={[styles.modeLabel, { color: colors.muted }]}>{pf.theme}</Text>
        <View style={styles.modeToggle}>
          {(['dark', 'light'] as const).map((m) => {
            const on = profile.colorMode === m;
            return (
              <Pressable
                key={m}
                onPress={() => (editable ? setColorMode(m) : undefined)}
                disabled={!editable}
                style={[
                  styles.modeChip,
                  {
                    borderColor: on ? colors.accent : colors.border,
                    backgroundColor: on ? `${colors.accent}22` : colors.surface,
                    opacity: editable ? 1 : 0.5,
                  },
                ]}
              >
                <Text style={[styles.modeChipText, { color: on ? colors.accent : colors.text }]}>
                  {m === 'dark' ? pf.dark : pf.light}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text style={[styles.label, { color: colors.muted, marginTop: 12 }]}>{pf.accentColor}</Text>
      <View style={styles.presetRow}>
        {ACCENT_COLOR_PRESETS.map((hex) => (
          <Pressable
            key={hex}
            onPress={() => (editable ? setAccentHex(hex) : undefined)}
            disabled={!editable}
            style={[
              styles.presetDot,
              { backgroundColor: hex, opacity: editable ? 1 : 0.5 },
              profile.accentHex.toLowerCase() === hex.toLowerCase() && { borderWidth: 2, borderColor: colors.text },
            ]}
            accessibilityLabel={`${pf.accentColor} ${hex}`}
          />
        ))}
      </View>
      <TextField
        label={pf.customHex}
        value={profile.accentHex}
        onChangeText={(t) => setProfile({ accentHex: t })}
        placeholder="#6366f1"
        autoCapitalize="characters"
        editable={editable}
        {...tf}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
  modeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  modeLabel: { fontSize: 14, fontWeight: '600' },
  modeToggle: { flexDirection: 'row', gap: 8 },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  modeChipText: { fontSize: 13, fontWeight: '600' },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  presetDot: { width: 32, height: 32, borderRadius: 16 },
});
