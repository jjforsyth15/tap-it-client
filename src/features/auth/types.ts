/** Payloads and responses for auth-related API calls. */

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  display_name: string | null;
};

export type AuthTokensResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export type RegistrationFormDraft = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

export type SecurityQuestionAnswer = {
  question: string;
  answer: string;
};

export type SubmitSecuritySetupPayload = {
  /** Dropdown ids from `SECURITY_QUESTIONS` plus plain answers */
  questions: { questionId: string; answer: string }[];
};

export type RecoverEmailPayload = {
  phone: string;
};

export type RecoverEmailResponse = { email: string } | { inSystem: false };

export type RecoverPasswordQuestionsPayload = {
  phone: string;
  email: string;
};

export type RecoverPasswordQuestionsResponse =
  | { inSystem: false }
  | { questions: { question: string }[] };

export type VerifyForgotPasswordPayload = {
  phone: string;
  email: string;
  answers: SecurityQuestionAnswer[];
};

export type VerifyForgotPasswordResponse = { success: true } | { correct: false };

/** In-memory state between password recovery and security-question answers */
export type PasswordRecoveryDraft = {
  phone: string;
  email: string;
  questions: { question: string }[];
};
