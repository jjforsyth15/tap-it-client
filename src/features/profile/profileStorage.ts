import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultUserProfile, PROFILE_STORAGE_KEY, type UserProfileState } from '@/src/features/profile/profileTypes';

function mergeWithDefaults(parsed: unknown): UserProfileState {
  const base = defaultUserProfile();
  if (!parsed || typeof parsed !== 'object') return base;
  const o = parsed as Record<string, unknown>;
  return {
    ...base,
    displayName: typeof o.displayName === 'string' ? o.displayName : base.displayName,
    loginUsername: typeof o.loginUsername === 'string' ? o.loginUsername : base.loginUsername,
    email: typeof o.email === 'string' ? o.email : base.email,
    phone: typeof o.phone === 'string' ? o.phone : base.phone,
    bio: typeof o.bio === 'string' ? o.bio : base.bio,
    profileImageUri: typeof o.profileImageUri === 'string' ? o.profileImageUri : o.profileImageUri === null ? null : base.profileImageUri,
    socialInstagram: typeof o.socialInstagram === 'string' ? o.socialInstagram : base.socialInstagram,
    socialTwitter: typeof o.socialTwitter === 'string' ? o.socialTwitter : base.socialTwitter,
    socialFacebook: typeof o.socialFacebook === 'string' ? o.socialFacebook : base.socialFacebook,
    socialLinkedin: typeof o.socialLinkedin === 'string' ? o.socialLinkedin : base.socialLinkedin,
    memberSinceIso: typeof o.memberSinceIso === 'string' ? o.memberSinceIso : base.memberSinceIso,
    accentHex: typeof o.accentHex === 'string' ? o.accentHex : base.accentHex,
    colorMode: o.colorMode === 'light' || o.colorMode === 'dark' ? o.colorMode : base.colorMode,
    securityQ1Id: typeof o.securityQ1Id === 'string' ? o.securityQ1Id : o.securityQ1Id === null ? null : base.securityQ1Id,
    securityQ2Id: typeof o.securityQ2Id === 'string' ? o.securityQ2Id : o.securityQ2Id === null ? null : base.securityQ2Id,
    securityQ3Id: typeof o.securityQ3Id === 'string' ? o.securityQ3Id : o.securityQ3Id === null ? null : base.securityQ3Id,
    securityA1: typeof o.securityA1 === 'string' ? o.securityA1 : base.securityA1,
    securityA2: typeof o.securityA2 === 'string' ? o.securityA2 : base.securityA2,
    securityA3: typeof o.securityA3 === 'string' ? o.securityA3 : base.securityA3,
    accountStatus:
      o.accountStatus === 'disabled' || o.accountStatus === 'active' ? o.accountStatus : base.accountStatus,
  };
}

export async function loadUserProfile(): Promise<UserProfileState> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return defaultUserProfile();
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    return defaultUserProfile();
  }
}

export async function saveUserProfile(state: UserProfileState): Promise<void> {
  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state));
}

export async function clearUserProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
}
