import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f0f12' },
        headerTintColor: '#e4e4e7',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#0f0f12' },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Admin', headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
