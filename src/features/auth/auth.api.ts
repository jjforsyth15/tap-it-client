import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  RecoverEmailPayload,
  RecoverEmailResponse,
  RecoverPasswordPayload,
  RecoverPasswordResponse,
  VerifySecurityAnswersPayload,
  VerifySecurityAnswersResponse,
  SubmitSecurityQuestionsPayload,
  SubmitSecurityQuestionsResponse,
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

const MOCK_DELAY_MS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stubRequest<T>(mock: T): Promise<T> {
  await sleep(MOCK_DELAY_MS);
  return mock;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return stubRequest({
    token: 'mock-jwt-token',
    user: { id: '1', email: payload.email },
  });
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return stubRequest({
    token: 'mock-jwt-token',
    user: { id: '1', email: payload.email },
  });
}

export async function recoverEmail(
  payload: RecoverEmailPayload
): Promise<RecoverEmailResponse> {
  return stubRequest({ inSystem: false } as RecoverEmailResponse);
}

export async function recoverPassword(
  payload: RecoverPasswordPayload
): Promise<RecoverPasswordResponse> {
  return stubRequest({ inSystem: false } as RecoverPasswordResponse);
}

export async function verifySecurityAnswers(
  payload: VerifySecurityAnswersPayload
): Promise<VerifySecurityAnswersResponse> {
  return stubRequest({ correct: false } as VerifySecurityAnswersResponse);
}

export async function submitSecurityQuestions(
  payload: SubmitSecurityQuestionsPayload
): Promise<SubmitSecurityQuestionsResponse> {
  return stubRequest({ success: true });
}
