import { SECURITY_QUESTIONS } from '@/src/constants/securityQuestions';
import { apiUrl, getApiBaseUrl } from '@/src/config/api';
import { clearRegistrationDraft, getRegistrationDraft } from './registrationDraft';
import { getAccessToken, saveAccessToken } from './session';
import type {
  AuthTokensResponse,
  LoginPayload,
  RecoverEmailPayload,
  RecoverEmailResponse,
  RecoverPasswordQuestionsPayload,
  RecoverPasswordQuestionsResponse,
  SubmitSecuritySetupPayload,
  VerifyForgotPasswordPayload,
  VerifyForgotPasswordResponse,
} from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Metro can duplicate modules so `instanceof ApiError` may fail; use this for catches.
 */
export function isApiError(err: unknown): err is ApiError {
  if (err instanceof ApiError) return true;
  if (err && typeof err === 'object' && (err as { name?: string }).name === 'ApiError') {
    return typeof (err as Error).message === 'string';
  }
  return false;
}

export function getAuthErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return `Can't reach the server at ${getApiBaseUrl()}. Set EXPO_PUBLIC_API_BASE_URL in tap-it-client/.env (e.g. https://tap-it-server.onrender.com) and restart with npx expo start -c.`;
}

function parseDetail(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const detail = d.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((x) => {
        if (!x || typeof x !== 'object') return null;
        const row = x as { msg?: unknown; type?: unknown; loc?: unknown };
        const msg = row.msg != null ? String(row.msg) : null;
        if (!msg) return null;
        const loc = Array.isArray(row.loc) ? row.loc.filter((p) => typeof p === 'string').join('.') : '';
        return loc ? `${loc}: ${msg}` : msg;
      })
      .filter(Boolean);
    if (parts.length) return parts.join(' · ');
  }
  if (typeof d.message === 'string') return d.message;
  return null;
}

/** Register hashes several bcrypts server-side — allow a long timeout. */
const REGISTER_FETCH_TIMEOUT_MS = 120_000;
/** Login and most auth calls should fail fast if the API is unreachable. */
const DEFAULT_FETCH_TIMEOUT_MS = 25_000;

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  authToken?: string | null,
  timeoutMs: number = DEFAULT_FETCH_TIMEOUT_MS
): Promise<T> {
  const url = apiUrl(path);
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(init?.body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(init?.headers ?? {}),
  };
  let res: Response;
  try {
    res = await fetchWithTimeout(url, { ...init, headers }, timeoutMs);
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError(
        [
          `Request timed out after ${timeoutMs / 1000}s.`,
          `Check EXPO_PUBLIC_API_BASE_URL (${getApiBaseUrl()}), your network, and that the API is up.`,
          'Restart Metro after .env changes: npx expo start -c',
        ].join(' '),
        0,
        e
      );
    }
    const hint =
      e instanceof TypeError
        ? `Network error (${e.message}). URL: ${url} · Base: ${getApiBaseUrl()}`
        : `Network error. URL: ${url}`;
    throw new ApiError(hint, 0, e);
  }
  const text = await res.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { detail: text.slice(0, 200) || `Non-JSON response (${res.status})` };
    }
  }
  if (!res.ok) {
    let msg = parseDetail(data) ?? `Request failed (${res.status})`;
    if (res.status === 429 && data && typeof data === 'object') {
      const o = data as Record<string, unknown>;
      if (typeof o.detail === 'string') msg = o.detail;
      else if (typeof o.message === 'string') msg = o.message;
    }
    throw new ApiError(msg, res.status, data);
  }
  return data as T;
}

/** Bearer-authenticated JSON requests (same timeouts as `apiFetch`). */
export async function apiFetchWithAuth<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    throw new ApiError('Session expired. Sign in again.', 401);
  }
  return apiFetch<T>(path, init, token);
}

function mapRecoverEmail(data: Record<string, unknown>): RecoverEmailResponse {
  if (data.in_system === false || data.inSystem === false) {
    return { inSystem: false };
  }
  const email = data.email;
  if (typeof email === 'string') return { email };
  return { inSystem: false };
}

function mapRecoverPasswordQuestions(data: Record<string, unknown>): RecoverPasswordQuestionsResponse {
  if (data.in_system === false || data.inSystem === false) {
    return { inSystem: false };
  }
  const qs = data.questions;
  if (Array.isArray(qs)) {
    return {
      questions: qs.map((q) => ({
        question: typeof q === 'object' && q && 'question' in q ? String((q as { question: unknown }).question) : '',
      })),
    };
  }
  return { inSystem: false };
}

function mapVerifyForgotPassword(data: Record<string, unknown>): VerifyForgotPasswordResponse {
  if (data.correct === false) return { correct: false };
  if (data.success === true) return { success: true };
  return { correct: false };
}

export async function login(payload: LoginPayload): Promise<AuthTokensResponse> {
  const body = await apiFetch<AuthTokensResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: payload.email.trim(), password: payload.password }),
  });
  if (!body.access_token) {
    throw new ApiError('Invalid response from server (missing token).');
  }
  try {
    await saveAccessToken(body.access_token);
  } catch (e) {
    throw new ApiError(
      e instanceof Error ? `Could not save session: ${e.message}` : 'Could not save session.',
      0,
      e
    );
  }
  return body;
}

/**
 * Called from the security-questions **setup** screen after the user picks 3 questions.
 * Sends the full registration payload to `POST /api/v1/auth/register`.
 */
export async function submitSecurityQuestions(
  payload: SubmitSecuritySetupPayload
): Promise<void> {
  const draft = await getRegistrationDraft();
  if (!draft) {
    throw new ApiError(
      'Registration data was lost. Go back to the sign-up form, fill it again, then continue to security questions.'
    );
  }
  const security_questions = payload.questions.map(({ questionId, answer }) => {
    const meta = SECURITY_QUESTIONS.find((q) => q.id === questionId);
    if (!meta) {
      throw new ApiError('Invalid security question selection.');
    }
    return { question: meta.label, answer };
  });
  const body = await apiFetch<AuthTokensResponse>(
    '/api/v1/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({
        email: draft.email.trim(),
        password: draft.password,
        first_name: draft.firstName.trim(),
        last_name: draft.lastName.trim(),
        phone_number: draft.phone.trim(),
        security_questions,
      }),
    },
    null,
    REGISTER_FETCH_TIMEOUT_MS
  );
  if (!body.access_token) {
    throw new ApiError('Invalid response from server (missing token).');
  }
  try {
    await saveAccessToken(body.access_token);
  } catch (e) {
    throw new ApiError(
      e instanceof Error ? `Could not save session: ${e.message}` : 'Could not save session.',
      0,
      e
    );
  }
  await clearRegistrationDraft();
}

export async function recoverEmail(payload: RecoverEmailPayload): Promise<RecoverEmailResponse> {
  const raw = await apiFetch<Record<string, unknown>>('/api/v1/auth/forgot-email', {
    method: 'POST',
    body: JSON.stringify({ phone: payload.phone.trim() }),
  });
  return mapRecoverEmail(raw);
}

export async function requestPasswordRecoveryQuestions(
  payload: RecoverPasswordQuestionsPayload
): Promise<RecoverPasswordQuestionsResponse> {
  const raw = await apiFetch<Record<string, unknown>>('/api/v1/auth/forgot-password/questions', {
    method: 'POST',
    body: JSON.stringify({ phone: payload.phone.trim(), email: payload.email.trim() }),
  });
  return mapRecoverPasswordQuestions(raw);
}

export async function verifyForgotPasswordAnswers(
  payload: VerifyForgotPasswordPayload
): Promise<VerifyForgotPasswordResponse> {
  const raw = await apiFetch<Record<string, unknown>>('/api/v1/auth/forgot-password/verify-answers', {
    method: 'POST',
    body: JSON.stringify({
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      answers: payload.answers,
    }),
  });
  return mapVerifyForgotPassword(raw);
}
