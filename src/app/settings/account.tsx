import { PrimaryButton } from '@/src/components/PrimaryButton';
import { QuestionDropdown } from '@/src/components/QuestionDropdown';
import { SettingsSubpageHeader } from '@/src/components/SettingsSubpageHeader';
import { TextField } from '@/src/components/TextField';
import { SECURITY_QUESTIONS } from '@/src/constants/securityQuestions';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { ProfileIdentityFields } from '@/src/features/profile/ProfileIdentityFields';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Q_OPTIONS = SECURITY_QUESTIONS.map((q) => ({ id: q.id, label: q.label }));

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { profile, colors, setProfile, setColorMode, setAccentHex, resetProfileStorage } = useUserProfile();
  const { s } = useAppPreferences();
  const [secError, setSecError] = useState('');

  const tf = {
    labelColor: colors.muted,
    inputBackgroundColor: colors.surface,
    inputBorderColor: colors.border,
    inputTextColor: colors.text,
  };

  const saveSecurityQuestions = () => {
    setSecError('');
    const ids = [profile.securityQ1Id, profile.securityQ2Id, profile.securityQ3Id];
    if (!ids.every(Boolean)) {
      setSecError('Pick a question for each row.');
      return;
    }
    if (new Set(ids).size < 3) {
      setSecError('Choose three different questions.');
      return;
    }
    const answers = [profile.securityA1.trim(), profile.securityA2.trim(), profile.securityA3.trim()];
    if (answers.some((a) => a.length < 2)) {
      setSecError('Each answer should be at least 2 characters.');
      return;
    }
    Alert.alert('Saved', 'Security questions updated on this device.');
  };

  const disableAccount = () => {
    Alert.alert(
      'Disable account',
      'You will stay signed in for this demo, but your profile will show as disabled.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: () => setProfile({ accountStatus: 'disabled' }),
        },
      ],
    );
  };

  const reenableAccount = () => {
    setProfile({ accountStatus: 'active' });
  };

  const deleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This clears local profile data and returns you to the welcome screen (demo only).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await resetProfileStorage();
            router.replace('/');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['bottom']}>
      <SettingsSubpageHeader title={s.account} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: 32 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionLabel, { color: colors.accent }]}>Profile</Text>
          <TextField
            label="Username (login)"
            value={profile.loginUsername}
            editable={false}
            placeholder="—"
            {...tf}
          />
          <Text style={[styles.lockedHint, { color: colors.muted }]}>
            Your login username cannot be changed here.
          </Text>
          <TextField label="Email" value={profile.email} editable={false} placeholder="—" {...tf} />
          <Text style={[styles.lockedHint, { color: colors.muted }]}>
            Email changes are handled by support in this demo.
          </Text>
          <ProfileIdentityFields
            profile={profile}
            colors={colors}
            setProfile={setProfile}
            setColorMode={setColorMode}
            setAccentHex={setAccentHex}
            context="account"
          />
          <TextField
            label="Phone number"
            value={profile.phone}
            onChangeText={(t) => setProfile({ phone: t })}
            placeholder="+1 …"
            keyboardType="phone-pad"
            {...tf}
          />

          <Text style={[styles.sectionLabel, { color: colors.accent, marginTop: 20 }]}>Security</Text>
        <Text style={[styles.blockTitle, { color: colors.text }]}>How you sign in</Text>
        <Text style={[styles.blockSub, { color: colors.muted }]}>
          Password for your TapIt account (not your phone passcode).
        </Text>
        <Pressable
          onPress={() => router.push('/settings/update-password')}
          style={({ pressed }) => [
            styles.linkRow,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.85 },
          ]}
        >
          <View style={styles.linkRowLeft}>
            <Ionicons name="key-outline" size={20} color={colors.accent} />
            <View>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Password</Text>
              <Text style={[styles.linkSub, { color: colors.muted }]}>Update password</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>

        <Text style={[styles.blockTitle, { color: colors.text, marginTop: 16 }]}>Security questions</Text>
        <Text style={[styles.blockSub, { color: colors.muted }]}>
          Used to verify it is you if you get locked out.
        </Text>
        {secError ? <Text style={styles.secError}>{secError}</Text> : null}
        <QuestionDropdown
          label="Question 1"
          options={Q_OPTIONS}
          selectedId={profile.securityQ1Id}
          onSelect={(id) => setProfile({ securityQ1Id: id })}
        />
        <TextField
          label="Answer 1"
          value={profile.securityA1}
          onChangeText={(t) => setProfile({ securityA1: t })}
          placeholder="Your answer"
          {...tf}
        />
        <QuestionDropdown
          label="Question 2"
          options={Q_OPTIONS}
          selectedId={profile.securityQ2Id}
          onSelect={(id) => setProfile({ securityQ2Id: id })}
        />
        <TextField
          label="Answer 2"
          value={profile.securityA2}
          onChangeText={(t) => setProfile({ securityA2: t })}
          placeholder="Your answer"
          {...tf}
        />
        <QuestionDropdown
          label="Question 3"
          options={Q_OPTIONS}
          selectedId={profile.securityQ3Id}
          onSelect={(id) => setProfile({ securityQ3Id: id })}
        />
        <TextField
          label="Answer 3"
          value={profile.securityA3}
          onChangeText={(t) => setProfile({ securityA3: t })}
          placeholder="Your answer"
          {...tf}
        />
        <PrimaryButton
          title="Save security questions"
          onPress={saveSecurityQuestions}
          style={{ backgroundColor: colors.accent }}
        />

        <Text style={[styles.sectionLabel, { color: '#f87171', marginTop: 28 }]}>Danger zone</Text>
        {profile.accountStatus === 'disabled' ? (
          <Pressable
            onPress={reenableAccount}
            style={({ pressed }) => [
              styles.dangerBtn,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.dangerBtnText, { color: colors.accent }]}>Re-enable account</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={disableAccount}
            style={({ pressed }) => [
              styles.dangerBtn,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.dangerBtnText, { color: colors.text }]}>Disable account</Text>
          </Pressable>
        )}
        <Pressable
          onPress={deleteAccount}
          style={({ pressed }) => [
            styles.dangerBtn,
            { borderColor: 'rgba(248,113,113,0.5)', backgroundColor: 'rgba(248,113,113,0.08)' },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.deleteText}>Delete account</Text>
        </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, marginBottom: 10, textTransform: 'uppercase' },
  lockedHint: { fontSize: 12, marginTop: -8, marginBottom: 12, lineHeight: 16 },
  blockTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  blockSub: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  linkRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkTitle: { fontSize: 16, fontWeight: '600' },
  linkSub: { fontSize: 12, marginTop: 2 },
  secError: { color: '#f87171', marginBottom: 8, fontSize: 14 },
  dangerBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerBtnText: { fontSize: 16, fontWeight: '600' },
  deleteText: { fontSize: 16, fontWeight: '700', color: '#f87171' },
});
