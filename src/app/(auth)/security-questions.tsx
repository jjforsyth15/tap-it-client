import { ErrorBanner } from '@/src/components/ErrorBanner';
import { LinkText } from '@/src/components/LinkText';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { ApiError, verifySecurityAnswers } from '@/src/features/auth/auth.api';
import { validateSecurityAnswers } from '@/src/features/auth/validators';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const PLACEHOLDER_QUESTIONS = [
  'What was the name of your first pet?',
  'What city were you born in?',
  "What is your mother's maiden name?",
];

export default function SecurityQuestionsScreen() {
  const [answers, setAnswers] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    const result = validateSecurityAnswers(answers);
    if (!result.valid) {
      setError(result.message);
      return;
    }
    setLoading(true);
    try {
      const response = await verifySecurityAnswers({
        phone: '', 
        answers: answers.map((a, i) => ({ questionId: `q${i}`, answer: a.trim() })),
      });
      if ('correct' in response && response.correct === false) {
        setError('Answers are wrong.');
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
        setError(err.message || 'Answers are wrong.');
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
          {PLACEHOLDER_QUESTIONS.map((q, i) => (
            <TextField
              key={i}
              label={`Question ${i + 1}`}
              value={answers[i]}
              onChangeText={(text) => {
                const next = [...answers];
                next[i] = text;
                setAnswers(next);
              }}
              placeholder={q}
            />
          ))}
          <ErrorBanner message={error} />
          <PrimaryButton title="Submit" onPress={handleSubmit} loading={loading} />
          <LinkText text="Back to log in" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
