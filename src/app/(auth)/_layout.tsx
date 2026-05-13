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
    </Stack>
  );
}
