import { BackgroundLandingPage } from '@/src/components/BackgroundLandingPage';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <Screen style={styles.screen}>
      <BackgroundLandingPage>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to TapIt</Text>
          <Text style={styles.subtitle}>Get started with your account</Text>

          <PrimaryButton
            title="First time? Create account"
            onPress={() => router.push('/(auth)/register')}
          />
          <PrimaryButton
            title="Return? Log in"
            onPress={() => router.push('/(auth)/login')}
            style={styles.secondaryButton}
          />
        </View>
      </BackgroundLandingPage>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 20,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#2a2a30',
  },
});
