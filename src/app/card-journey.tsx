import { TapitHomeScreen } from '@/src/features/tapitOnboarding/TapitHomeScreen';
import { router } from 'expo-router';
import React from 'react';

export default function CardJourneyScreen() {
  return (
    <TapitHomeScreen showExitToDashboard onExitToDashboard={() => router.back()} />
  );
}
