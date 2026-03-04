import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { PrimaryButton } from '@/src/components/PrimaryButton';

export default function PasswordRecoveryResultScreen() {
  return (
    <Screen>
      <View style={styles.messageBox}>
        <Text style={styles.text}>
          We will send an email to your account email to reset your password.
        </Text>
      </View>
      <PrimaryButton title="Back to log in" onPress={() => router.replace('/(auth)/login')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  text: {
    fontSize: 14,
    color: '#34d399',
  },
});
