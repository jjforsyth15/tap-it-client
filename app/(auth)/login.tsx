import { ErrorBanner } from '@/src/components/ErrorBanner';
import { LinkText } from '@/src/components/LinkText';
import { PasswordField } from '@/src/components/PasswordField';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { ApiError, login } from '@/src/features/auth/auth.api';
import { validateLoginForm } from '@/src/features/auth/validators';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    const result = validateLoginForm(email, password);
    if (!result.valid) {
      setError(result.message);
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        router.replace('/server-error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Log in</Text>
          <ErrorBanner message={error} />
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            autoComplete="password"
          />
          <PrimaryButton title="Log in" onPress={handleLogin} loading={loading} />
          <View style={styles.links}>
            <LinkText text="Forgot email" onPress={() => router.push('/email-recovery')} />
            <LinkText text="Forgot password" onPress={() => router.push('/password-recovery')} />
          </View>
          <PrimaryButton
            title="Make a new account"
            onPress={() => router.push('/register')}
            style={styles.secondaryButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e4e4e7',
    marginBottom: 24,
  },
  links: {
    marginTop: 16,
    gap: 12,
  },
  secondaryButton: {
    marginTop: 24,
    backgroundColor: '#2a2a30',
  },
});
