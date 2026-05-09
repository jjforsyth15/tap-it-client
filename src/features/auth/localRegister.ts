import { clearRegistrationDraft } from '@/src/features/auth/registrationDraft';
import { saveAccessToken } from '@/src/features/auth/session';
import type { AuthTokensResponse, RegistrationFormDraft } from '@/src/features/auth/types';

/** Offline registration: session token stored locally only (no server). */
export async function registerAccountLocal(draft: RegistrationFormDraft): Promise<AuthTokensResponse> {
  try {
    await saveAccessToken(`local-${Date.now()}`);
  } catch (e) {
    throw new Error(e instanceof Error ? `Could not save session: ${e.message}` : 'Could not save session.');
  }
  await clearRegistrationDraft();
  const display = `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim();
  const user = {
    id: `local-${draft.email.trim()}`,
    email: draft.email.trim(),
    display_name: display || null,
  };
  return {
    access_token: 'local-session',
    token_type: 'bearer',
    user,
  };
}
