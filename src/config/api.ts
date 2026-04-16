/**
 * Central API base URL for the Python backend.
 *
 * Resolution order:
 * 1. EXPO_PUBLIC_API_BASE_URL (`.env`)
 * 2. `expo.extra.apiBaseUrl` from app.config.js
 * 3. Fallback: production deploy on Render
 *
 * After changing `.env`, restart: `npx expo start -c`
 */
import Constants from 'expo-constants';

const DEFAULT_API_BASE = 'https://tap-it-server.onrender.com';

let didLogBaseUrl = false;

function fromExtra(): string | undefined {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  const v = extra?.apiBaseUrl?.trim();
  return v && v.length > 0 ? v.replace(/\/$/, '') : undefined;
}

function fromProcessEnv(): string | undefined {
  try {
    const v = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
    return v && v.length > 0 ? v.replace(/\/$/, '') : undefined;
  } catch {
    return undefined;
  }
}

export function getApiBaseUrl(): string {
  const envUrl = fromProcessEnv();
  const base = envUrl || fromExtra() || DEFAULT_API_BASE;

  if (__DEV__ && !didLogBaseUrl) {
    didLogBaseUrl = true;
    console.log('[Tapit] API base URL:', base, envUrl ? '(from EXPO_PUBLIC_API_BASE_URL)' : '(extra or default)');
  }
  return base;
}

/** Build a full URL for a path starting with `/api/...`. */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
