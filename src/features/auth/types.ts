// define the structure of data sent between the frontend and backend for your authentication system.

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { id: string; email: string };
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

export type RegisterResponse = {
  token: string;
  user: { id: string; email: string };
};

export type RecoverEmailPayload = {
  phone: string;
};

export type RecoverEmailResponse = {
  email: string;
} | { inSystem: false };

export type RecoverPasswordPayload = {
  phone: string;
  email: string;
};

export type RecoverPasswordResponse = {
  sent: true;
} | { inSystem: false };

export type SecurityAnswerItem = {
  questionId: string;
  answer: string;
};

export type VerifySecurityAnswersPayload = {
  phone: string;
  answers: SecurityAnswerItem[];
};

export type VerifySecurityAnswersResponse = {
  email: string;
} | { correct: false };

export type SubmitSecurityQuestionsPayload = {
  questions: SecurityAnswerItem[];
  registrationToken?: string; 
};

export type SubmitSecurityQuestionsResponse = {
  success: true;
};
