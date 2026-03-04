import type { LoginPayload, LoginResponse } from '@/src/features/auth/types';
import { request, stubRequest, USE_REAL_API } from './client';
import { routes } from './routes';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (USE_REAL_API) {
    return request<LoginResponse>(routes.auth.login, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  return stubRequest({
    token: 'mock-jwt-token',
    user: { id: '1', email: payload.email },
  });
}
