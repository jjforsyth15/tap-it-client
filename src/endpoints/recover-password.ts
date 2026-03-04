import type { RecoverPasswordPayload, RecoverPasswordResponse } from '@/src/features/auth/types';
import { request, stubRequest, USE_REAL_API } from './client';
import { routes } from './routes';

export async function recoverPassword(
  payload: RecoverPasswordPayload
): Promise<RecoverPasswordResponse> {
  if (USE_REAL_API) {
    return request<RecoverPasswordResponse>(routes.auth.recoverPassword, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  return stubRequest({ inSystem: false } as RecoverPasswordResponse);
}
