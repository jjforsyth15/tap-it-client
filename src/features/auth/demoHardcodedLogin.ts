/**
 * Development-only bypass: sign in without calling the API.
 * 
 */
import { saveAccessToken } from '@/src/features/auth/session';
import type { AuthUser } from '@/src/features/auth/types';

export const DEMO_HARDCODED_EMAIL = '12345678@gmail.com';
export const DEMO_HARDCODED_PASSWORD = '12345678';

export function isDemoHardcodedLogin(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_HARDCODED_EMAIL.toLowerCase() &&
    password === DEMO_HARDCODED_PASSWORD
  );
}

export async function signInWithDemoHardcodedCredentials(): Promise<AuthUser> {
  const user: AuthUser = {
    id: 'demo-hardcoded-user',
    email: DEMO_HARDCODED_EMAIL,
    display_name: 'Demo User',
  };
  await saveAccessToken('demo-hardcoded-session-token');
  return user;
}
