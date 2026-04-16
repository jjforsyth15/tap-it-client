import { ErrorBanner } from '@/src/components/ErrorBanner';
import { LinkText } from '@/src/components/LinkText';
import { PasswordField } from '@/src/components/PasswordField';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { getAuthErrorMessage } from '@/src/features/auth/auth.api';
import { setRegistrationDraft } from '@/src/features/auth/registrationDraft';
import { validateRegisterForm } from '@/src/features/auth/validators';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function RegisterScreen() {
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
      await setRegistrationDraft({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
      });
      router.push('/(auth)/security-questions-setup');
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
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
          <PrimaryButton title="Continue" onPress={handleContinue} loading={loading} />
          <LinkText text="Back to log in" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
