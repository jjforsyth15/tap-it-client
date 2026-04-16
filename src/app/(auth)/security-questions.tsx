import { ErrorBanner } from '@/src/components/ErrorBanner';
import { LinkText } from '@/src/components/LinkText';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { getAuthErrorMessage, verifyForgotPasswordAnswers } from '@/src/features/auth/auth.api';
import { clearPasswordRecoveryDraft, getPasswordRecoveryDraft } from '@/src/features/auth/passwordRecoveryDraft';
import { validateSecurityAnswers } from '@/src/features/auth/validators';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SecurityQuestionsScreen() {
  const draft = useMemo(() => getPasswordRecoveryDraft(), []);
  const [answers, setAnswers] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!draft || draft.questions.length < 3) {
      setError('Start from Password recovery and verify your phone and email first.');
      return;
    }
    const result = validateSecurityAnswers(answers);
    if (!result.valid) {
      setError(result.message);
      return;
    }
    setLoading(true);
    try {
      const response = await verifyForgotPasswordAnswers({
        phone: draft.phone,
        email: draft.email,
        answers: draft.questions.map((q, i) => ({
          question: q.question,
          answer: answers[i].trim(),
        })),
      });
      if ('correct' in response && response.correct === false) {
        setError('Answers are wrong.');
        return;
      }
      if ('success' in response && response.success) {
        clearPasswordRecoveryDraft();
        router.replace('/(auth)/password-recovery-result');
        return;
      }
      setError('Answers are wrong.');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!draft || draft.questions.length < 3) {
    return (
      <Screen>
        <View style={styles.missing}>
          <Text style={styles.missingText}>
            Open this screen from Forgot password after entering your phone and email.
          </Text>
          <PrimaryButton title="Back to log in" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </Screen>
    );
  }

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
          {draft.questions.map((q, i) => (
            <View key={`${q.question}-${i}`} style={styles.block}>
              <Text style={styles.questionLabel}>{q.question}</Text>
              <TextField
                label="Your answer"
                value={answers[i]}
                onChangeText={(text) => {
                  const next = [...answers];
                  next[i] = text;
                  setAnswers(next);
                }}
                placeholder="Your answer"
              />
            </View>
          ))}
          <ErrorBanner message={error} />
          <PrimaryButton title="Submit" onPress={handleSubmit} loading={loading} />
          <LinkText text="Back to log in" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 8 },
  questionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e4e4e7',
    marginBottom: 8,
  },
  missing: { flex: 1, justifyContent: 'center', gap: 16 },
  missingText: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
});
