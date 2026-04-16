import { AppPreferencesProvider } from '@/src/features/appPreferences/AppPreferencesContext';
import { UserProfileProvider } from '@/src/features/profile/UserProfileContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProfileProvider>
        <AppPreferencesProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0f0f12' },
            headerTintColor: '#e4e4e7',
            contentStyle: { backgroundColor: '#0f0f12' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="shop" options={{ headerShown: false }} />
          <Stack.Screen name="analytics" options={{ headerShown: false }} />
          <Stack.Screen name="link-page" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="card-journey" options={{ headerShown: false }} />
          <Stack.Screen name="my-cards" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
        </Stack>
        </AppPreferencesProvider>
      </UserProfileProvider>
    </SafeAreaProvider>
  );
}
