export const API_BASE = '/api';

export const routes = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    recoverEmail: `${API_BASE}/auth/recover-email`,
    recoverPassword: `${API_BASE}/auth/recover-password`,
    verifySecurityAnswers: `${API_BASE}/auth/verify-security-answers`,
    securityQuestions: `${API_BASE}/auth/security-questions`,
  },
} as const;
