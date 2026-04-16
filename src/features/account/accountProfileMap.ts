import type { AccountPatchDTO, AccountMeDTO } from '@/src/features/account/account.api';
import type { AuthUser } from '@/src/features/auth/types';
import type { UserProfileState } from '@/src/features/profile/profileTypes';

/** Apply fields from login/register JWT response (no extra GET needed for name/email). */
export function mergeAuthUserIntoProfile(base: UserProfileState, user: AuthUser): UserProfileState {
  return {
    ...base,
    displayName: (user.display_name && user.display_name.trim()) || user.email,
    loginUsername: user.email,
    email: user.email,
    accountStatus: 'active',
  };
}

/** Apply server account fields while keeping local-only data (NFC cards, security Q draft, photo). */
export function mergeServerAccount(base: UserProfileState, a: AccountMeDTO): UserProfileState {
  return {
    ...base,
    displayName: (a.display_name && a.display_name.trim()) || a.email,
    loginUsername: a.login_username,
    email: a.email,
    phone: a.phone,
    bio: a.bio,
    socialInstagram: a.social_instagram,
    socialTwitter: a.social_twitter,
    socialFacebook: a.social_facebook,
    socialLinkedin: a.social_linkedin,
    accentHex: a.accent_hex,
    colorMode: a.color_mode,
    memberSinceIso: a.member_since_iso,
    accountStatus: 'active',
  };
}

export function profileStateToAccountPatch(p: UserProfileState): AccountPatchDTO {
  return {
    display_name: p.displayName,
    phone: p.phone,
    bio: p.bio,
    social_instagram: p.socialInstagram,
    social_twitter: p.socialTwitter,
    social_facebook: p.socialFacebook,
    social_linkedin: p.socialLinkedin,
    accent_hex: p.accentHex,
    color_mode: p.colorMode,
  };
}
