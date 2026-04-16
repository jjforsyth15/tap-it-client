import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/src/components/Screen';
import { QuestionDropdown } from '@/src/components/QuestionDropdown';
import { TextField } from '@/src/components/TextField';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { ErrorBanner } from '@/src/components/ErrorBanner';
import { SECURITY_QUESTIONS } from '@/src/constants/securityQuestions';
import { validateSecurityAnswers } from '@/src/features/auth/validators';
import { getAuthErrorMessage, submitSecurityQuestions } from '@/src/features/auth/auth.api';

export default function SecurityQuestionsSetupScreen() {
  const [questionIds, setQuestionIds] = useState<(string | null)[]>([null, null, null]);
  const [answers, setAnswers] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setQuestionId = (index: number, id: string) => {
    const next = [...questionIds];
    next[index] = id;
    setQuestionIds(next);
  };

  const handleSubmit = async () => {
    setError('');
    const allSelected = questionIds.every((id) => id != null);
    if (!allSelected) {
      setError('Please select a question for each row.');
      return;
    }
    const unique = new Set(questionIds);
    if (unique.size < 3) {
      setError('Please choose three different questions.');
      return;
    }
    const result = validateSecurityAnswers(answers);
    if (!result.valid) {
      setError(result.message);
      return;
    }
    setLoading(true);
    try {
      await submitSecurityQuestions({
        questions: questionIds.map((id, i) => ({
          questionId: id!,
          answer: answers[i].trim(),
        })),
      });
      router.replace('/(auth)/success-account-made');
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
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              <QuestionDropdown
                label={`Security Question ${i + 1}`}
                options={SECURITY_QUESTIONS}
                selectedId={questionIds[i]}
                onSelect={(id) => setQuestionId(i, id)}
              />
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
            </React.Fragment>
          ))}
          <ErrorBanner message={error} />
          <PrimaryButton title="Submit" onPress={handleSubmit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
