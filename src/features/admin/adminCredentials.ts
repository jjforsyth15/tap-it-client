/**
 * Admin login reads EXPO_PUBLIC_ADMIN_EMAIL and EXPO_PUBLIC_ADMIN_PASSWORD from .env (see .env.example).
 * Client-side checks are for UI/prototyping only — not secure for production.
 */
export function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.EXPO_PUBLIC_ADMIN_EMAIL?.trim();
  const password = process.env.EXPO_PUBLIC_ADMIN_PASSWORD;
  if (!email || password === undefined || password === '') {
    return null;
  }
  return { email, password };
}

export function validateAdminLogin(inputEmail: string, inputPassword: string): boolean {
  const creds = getAdminCredentials();
  if (!creds) return false;
  const sameEmail = inputEmail.trim().toLowerCase() === creds.email.toLowerCase();
  const samePassword = inputPassword === creds.password;
  return sameEmail && samePassword;
}
