import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { useUserProfile } from '@/src/features/profile/UserProfileContext';

export default function SuccessAccountMadeScreen() {
  const { refreshFromServer } = useUserProfile();
  const [loading, setLoading] = useState(false);

  const goHome = async () => {
    setLoading(true);
    try {
      await refreshFromServer();
      router.replace('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.box}>
        <Text style={styles.title}>Account created</Text>
        <Text style={styles.subtitle}>You are signed in. Continue to the app or go back to log in.</Text>
      </View>
      <PrimaryButton title="Continue to app" onPress={goHome} loading={loading} />
      <PrimaryButton
        title="Back to log in"
        onPress={() => router.replace('/(auth)/login')}
        style={styles.secondary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#34d399',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  secondary: {
    marginTop: 12,
    backgroundColor: '#2a2a30',
  },
});
