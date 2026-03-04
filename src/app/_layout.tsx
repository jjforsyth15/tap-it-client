import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f0f12' },
        headerTintColor: '#e4e4e7',
        contentStyle: { backgroundColor: '#0f0f12' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
    </SafeAreaProvider>
  );
}
