import { BackgroundLandingPage } from '@/src/components/BackgroundLandingPage';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const { u } = useAppPreferences();
  const l = u.landing;

  return (
    <Screen style={styles.screen}>
      <BackgroundLandingPage>
        <View style={styles.content}>
          <Text style={styles.kicker}>{l.kicker}</Text>
          <Text style={styles.title}>{l.title}</Text>
          <Text style={styles.subtitle}>{l.subtitle}</Text>

          <PrimaryButton
            title={l.createAccount}
            onPress={() => router.push('/(auth)/register')}
          />
          <PrimaryButton
            title={l.logIn}
            onPress={() => router.push('/(auth)/login')}
            style={styles.secondaryButton}
          />
          <Pressable
            onPress={() =>
              router.replace({
                pathname: '/home',
                params: { guest: '1', displayName: u.common.guestDisplayName },
              })
            }
            style={({ pressed }) => [styles.guestBtn, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel={l.guestA11y}
          >
            <Text style={styles.guestBtnText}>{l.guestExplore}</Text>
          </Pressable>
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
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(161,161,170,0.95)',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  secondaryButton: {
    backgroundColor: '#2a2a30',
  },
  guestBtn: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a1a1aa',
    textDecorationLine: 'underline',
  },
});
