import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f0f12' },
        headerTintColor: '#e4e4e7',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#0f0f12' },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Log in', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Sign up' }} />
      <Stack.Screen name="email-recovery" options={{ title: 'Email Recovery' }} />
      <Stack.Screen name="password-recovery" options={{ title: 'Password Recovery' }} />
      <Stack.Screen name="security-questions" options={{ title: 'Security Questions' }} />
      <Stack.Screen name="security-questions-setup" options={{ title: 'Security Questions' }} />
      <Stack.Screen name="email-recovery-result" options={{ title: 'Email Found' }} />
      <Stack.Screen name="password-recovery-result" options={{ title: 'Password Reset' }} />
      <Stack.Screen name="success-account-made" options={{ title: 'Account Created', headerShown: false }} />
      <Stack.Screen name="server-error" options={{ title: 'Error', headerShown: false }} />
    </Stack>
  );
}
