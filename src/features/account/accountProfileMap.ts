import type { AuthUser } from '@/src/features/auth/types';
import type { UserProfileState } from '@/src/features/profile/profileTypes';

// Apply fields from login/register response (local or remote)
export function mergeAuthUserIntoProfile(base: UserProfileState, user: AuthUser): UserProfileState {
  return {
    ...base,
    displayName: (user.display_name && user.display_name.trim()) || user.email,
    loginUsername: user.email,
    email: user.email,
    accountStatus: 'active',
  };
}
