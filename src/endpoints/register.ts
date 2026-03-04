import type { RegisterPayload, RegisterResponse } from '@/src/features/auth/types';
import { request, stubRequest, USE_REAL_API } from './client';
import { routes } from './routes';

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  if (USE_REAL_API) {
    return request<RegisterResponse>(routes.auth.register, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  return stubRequest({
    token: 'mock-jwt-token',
    user: { id: '1', email: payload.email },
  });
}
