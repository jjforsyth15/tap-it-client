// No backend is configured. Use the demo account: 12345678@gmail.com / 12345678


import { ErrorBanner } from '@/src/components/ErrorBanner';
import { PasswordField } from '@/src/components/PasswordField';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { getAuthErrorMessage } from '@/src/features/auth/authErrors';
import {
  isDemoHardcodedLogin,
  signInWithDemoHardcodedCredentials,
} from '@/src/features/auth/demoHardcodedLogin';
import { validateLoginForm } from '@/src/features/auth/validators';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Ionicons } from '@expo/vector-icons';
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

export default function LoginScreen() {
  const { u } = useAppPreferences();
  const { refreshFromServer, applyAuthUser } = useUserProfile();
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
      if (isDemoHardcodedLogin(email, password)) {
        const user = await signInWithDemoHardcodedCredentials();
        applyAuthUser(user);
        void refreshFromServer();
        const displayName = user.display_name?.trim() || user.email;
        router.replace({
          pathname: '/home',
          params: { displayName },
        });
        return;
      }
      setError(
        'No backend is configured. Use the demo account: 12345678@gmail.com / 12345678',
      );
      return;
    } catch (err) {
      setError(getAuthErrorMessage(err));
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
          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Back to welcome"
          >
            <Ionicons name="chevron-back" size={22} color="#e4e4e7" />
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
          <Text style={styles.title}>{u.login.title}</Text>
          <ErrorBanner message={error} />
          <TextField
            label={u.login.email}
            value={email}
            onChangeText={setEmail}
            placeholder={u.login.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <PasswordField
            label={u.login.password}
            value={password}
            onChangeText={setPassword}
            placeholder={u.login.passwordPlaceholder}
            autoComplete="password"
          />
          <PrimaryButton title={u.login.submit} onPress={handleLogin} loading={loading} />
          <PrimaryButton
            title={u.login.register}
            onPress={() => router.push('/(auth)/register')}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 24,
  },
  secondaryButton: {
    marginTop: 24,
    backgroundColor: '#2a2a30',
  },
});
