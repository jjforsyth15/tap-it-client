import { ErrorBanner } from '@/src/components/ErrorBanner';
import { Ionicons } from '@expo/vector-icons';
import { LinkText } from '@/src/components/LinkText';
import { PasswordField } from '@/src/components/PasswordField';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { getAuthErrorMessage } from '@/src/features/auth/authErrors';
import { registerAccountLocal } from '@/src/features/auth/localRegister';
import { validateRegisterForm } from '@/src/features/auth/validators';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

export default function RegisterScreen() {
  const { applyAuthUser, refreshFromServer } = useUserProfile();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError('');
    const result = validateRegisterForm({
      firstName,
      lastName,
      email,
      emailConfirm,
      password,
      passwordConfirm,
      phone,
    });
    if (!result.valid) {
      setError(result.message);
      return;
    }
    setLoading(true);
    try {
      const response = await registerAccountLocal({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
      });
      applyAuthUser(response.user);
      void refreshFromServer();
      const displayName = response.user.display_name?.trim() || response.user.email;
      router.replace({
        pathname: '/home',
        params: { displayName },
      });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Back to welcome"
          >
            <Ionicons name="chevron-back" size={22} color="#e4e4e7" />
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
          <TextField
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            autoComplete="given-name"
          />
          <TextField
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            autoComplete="family-name"
          />
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextField
            label="Email confirmation"
            value={emailConfirm}
            onChangeText={setEmailConfirm}
            placeholder="Re-enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <PasswordField
            label="Password confirmation"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <TextField
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 000-0000"
            keyboardType="phone-pad"
          />
          <ErrorBanner message={error} />
          <PrimaryButton title="Create account" onPress={handleContinue} loading={loading} />
          <LinkText text="Back to log in" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 24 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 6,
    paddingRight: 12,
  },
  backBtnPressed: { opacity: 0.7 },
  backLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e4e4e7',
  },
});
