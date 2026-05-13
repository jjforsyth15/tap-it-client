/** Shared auth-style errors for UI (no network layer). */

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
  return 'Something went wrong.';
}
