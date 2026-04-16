import { apiFetchWithAuth } from '@/src/features/auth/auth.api';
import type { ColorMode } from '@/src/features/profile/profileTypes';

export type AccountMeDTO = {
  id: string;
  email: string;
  login_username: string;
  display_name: string | null;
  phone: string;
  bio: string;
  social_instagram: string;
  social_twitter: string;
  social_facebook: string;
  social_linkedin: string;
  accent_hex: string;
  color_mode: ColorMode;
  member_since_iso: string;
};

export type AccountPatchDTO = {
  display_name?: string;
  phone?: string;
  bio?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_linkedin?: string;
  accent_hex?: string;
  color_mode?: ColorMode;
};

export async function fetchAccountMe(): Promise<AccountMeDTO> {
  return apiFetchWithAuth<AccountMeDTO>('/api/v1/account/me');
}

export async function patchAccount(patch: AccountPatchDTO): Promise<AccountMeDTO> {
  return apiFetchWithAuth<AccountMeDTO>('/api/v1/account/me', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function changeAccountPassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetchWithAuth('/api/v1/account/password', {
    method: 'POST',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}
