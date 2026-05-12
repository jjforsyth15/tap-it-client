import { useAppPreferences } from '@/src/features/appPreferences/AppPreferencesContext';
import { View } from 'react-native';
import { TapitPageHeader } from '../TapitPageHeader';
import { NfcCardHero } from './NfcCardHero';
import { StoryBusinessExamples } from './StoryBusinessExamples';
import { StoryCallout } from './StoryCallout';

export function StoryPageChooseLink() {
  const { u } = useAppPreferences();
  const o = u.onboarding;
  return (
    <View>
      <NfcCardHero />
      <StoryCallout text={o.storyChooseCallout} delay={60} />
      <TapitPageHeader subtitle={o.storyChooseHeaderSub} />
      <StoryBusinessExamples />
    </View>
  );
}
