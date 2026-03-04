import type { RecoverEmailPayload, RecoverEmailResponse } from '@/src/features/auth/types';
import { request, stubRequest, USE_REAL_API } from './client';
import { routes } from './routes';

export async function recoverEmail(payload: RecoverEmailPayload): Promise<RecoverEmailResponse> {
  if (USE_REAL_API) {
    return request<RecoverEmailResponse>(routes.auth.recoverEmail, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  return stubRequest({ inSystem: false } as RecoverEmailResponse);
}
