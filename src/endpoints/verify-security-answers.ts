import type {
  VerifySecurityAnswersPayload,
  VerifySecurityAnswersResponse,
} from '@/src/features/auth/types';
import { request, stubRequest, USE_REAL_API } from './client';
import { routes } from './routes';

export async function verifySecurityAnswers(
  payload: VerifySecurityAnswersPayload
): Promise<VerifySecurityAnswersResponse> {
  if (USE_REAL_API) {
    return request<VerifySecurityAnswersResponse>(routes.auth.verifySecurityAnswers, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  return stubRequest({ correct: false } as VerifySecurityAnswersResponse);
}
