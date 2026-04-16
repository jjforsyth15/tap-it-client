import { useUserProfile } from '@/src/features/profile/UserProfileContext';
import { Stack } from 'expo-router';
import React from 'react';

/** In-screen headers (see SettingsSubpageHeader) so back/title always match Profile-style UX. */
export default function SettingsLayout() {
  const { colors } = useUserProfile();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    />
  );
}
