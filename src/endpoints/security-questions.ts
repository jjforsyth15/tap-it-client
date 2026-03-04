import type {
  SubmitSecurityQuestionsPayload,
  SubmitSecurityQuestionsResponse,
} from '@/src/features/auth/types';
import { request, stubRequest, USE_REAL_API } from './client';
import { routes } from './routes';

export async function submitSecurityQuestions(
  payload: SubmitSecurityQuestionsPayload
): Promise<SubmitSecurityQuestionsResponse> {
  if (USE_REAL_API) {
    return request<SubmitSecurityQuestionsResponse>(routes.auth.securityQuestions, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  return stubRequest({ success: true });
}
