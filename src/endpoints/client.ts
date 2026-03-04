export type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
  headers?: Record<string, string>;
};

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

export async function request<T = unknown>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = config;
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const url = path.startsWith('http') ? path : path;
  const response = await fetch(url, {
    method,
    headers: defaultHeaders,
    body,
  });

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }
    throw new ApiError(
      (payload as { message?: string })?.message ?? response.statusText,
      response.status,
      payload
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return response.text() as unknown as T;
}

const MOCK_DELAY_MS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const USE_REAL_API = false;

export async function stubRequest<T>(mock: T): Promise<T> {
  await sleep(MOCK_DELAY_MS);
  return mock;
}
