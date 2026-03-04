import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { LinkText } from '@/src/components/LinkText';
import { ErrorBanner } from '@/src/components/ErrorBanner';
import { validateRecoverEmailForm } from '@/src/features/auth/validators';
import { recoverEmail, ApiError } from '@/src/features/auth/auth.api';

export default function EmailRecoveryScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    const result = validateRecoverEmailForm(phone);
    if (!result.valid) {
      setError(result.message);
      return;
    }
    setLoading(true);
    try {
      const response = await recoverEmail({ phone: phone.trim() });
      if ('inSystem' in response && !response.inSystem) {
        setError('Not in system.');
        return;
      }
      if ('email' in response) {
        router.replace({
          pathname: '/(auth)/email-recovery-result',
          params: { email: response.email },
        });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Not in system.');
      } else {
        router.replace('/(auth)/server-error');
      }
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
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 000-0000"
            keyboardType="phone-pad"
          />
          <ErrorBanner message={error} />
          <PrimaryButton title="Enter" onPress={handleSubmit} loading={loading} />
          <LinkText text="Back to log in" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
