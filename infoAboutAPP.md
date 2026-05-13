App entry & layout

src/app/_layout.tsx
Root layout: wraps app in SafeAreaProvider, then a Stack with index and (auth).
Backend: None.

src/app/index.tsx
Entry screen: redirects to /(auth)/login.
Backend: None.

src/app/(auth)/_layout.tsx
Auth stack layout: defines all auth screens (login, register, recovery, security questions, results, server-error) and their options.
Backend: None.

Auth screens (src/app/(auth)/)
login.tsx
Login UI: email + password, “Forgot email”, “Forgot password”, “Make a new account”. Calls login(); on unexpected error goes to server-error.
Backend: Expects POST /api/auth/login; request/response shapes in src/features/auth/types.ts (LoginPayload, LoginResponse). Errors: JSON with message or status text.

register.tsx
Registration: first name, last name, email, confirm email, password, confirm password, phone. Validates then navigates to security-questions-setup or shows “Not filled out”.
Backend: Can call POST /api/auth/register (optional; can be after security Qs). Types: RegisterPayload, RegisterResponse.

security-questions-setup.tsx
Post-registration: 3 security question dropdowns + 3 answer fields. Submit calls submitSecurityQuestions(), then success-account-made or server-error.
Backend: Expects POST /api/auth/security-questions with SubmitSecurityQuestionsPayload; response SubmitSecurityQuestionsResponse. Question IDs must match src/constants/securityQuestions.ts (or your own list).

email-recovery.tsx
Email recovery: phone input, calls recoverEmail(). “Not in system” → inline error; success with email → email-recovery-result (with email param).
Backend: Expects POST /api/auth/recover-email with RecoverEmailPayload. Response: { email } or { inSystem: false }.

password-recovery.tsx
Password recovery: phone + email, calls recoverPassword(). “Not in system” or success → password-recovery-result.
Backend: Expects POST /api/auth/recover-password with RecoverPasswordPayload. Response: { sent: true } or { inSystem: false }.

security-questions.tsx
Recovery flow: 3 fixed question labels + 3 answer inputs. Calls verifySecurityAnswers(); “Answers are wrong” or success (navigate to email-recovery-result with email).
Backend: Expects POST /api/auth/verify-security-answers with VerifySecurityAnswersPayload. Response: { email } or { correct: false }. Question IDs must align with what you store for that user.

email-recovery-result.tsx
Shows recovered email and “Back to log in”.
Backend: None (reads email from route params).

password-recovery-result.tsx
Message that reset email will be sent + “Back to log in”.
Backend: None.

success-account-made.tsx
“Account created” + “Back to log in”.
Backend: None.

server-error.tsx
Generic error screen + “Back to log in”.
Backend: None.

Components (src/components/)
Screen.tsx
Wraps content in SafeAreaView (from react-native-safe-area-context) and standard padding.
Backend: None.

TextField.tsx
Label + text input + optional error text.
Backend: None.

PasswordField.tsx
Password input with show/hide toggle.
Backend: None.

PrimaryButton.tsx
Primary button with optional loading state.
Backend: None.

LinkText.tsx
Tappable link-style text.
Backend: None.

ErrorBanner.tsx
Red error message block.
Backend: None.

QuestionDropdown.tsx
Modal dropdown for choosing a security question (used in security-questions-setup).
Backend: None.

Auth feature (src/features/auth/)
types.ts
Request/response types for all auth: LoginPayload/LoginResponse, RegisterPayload/RegisterResponse, RecoverEmailPayload/RecoverEmailResponse, RecoverPasswordPayload/RecoverPasswordResponse, VerifySecurityAnswersPayload/VerifySecurityAnswersResponse, SubmitSecurityQuestionsPayload/SubmitSecurityQuestionsResponse, SecurityAnswerItem.
Backend: Single source of truth for API contracts. Align your request/response bodies and error shape (message) with these types.

validators.ts
Client-side validation (required, email format, password match/length, etc.) used before calling the API.
Backend: Backend should still validate; these are for UX only.

auth.api.ts
Re-exports ApiError and all auth API functions from @/src/endpoints (login, register, recoverEmail, recoverPassword, verifySecurityAnswers, submitSecurityQuestions).
Backend: When wiring to real API, set USE_REAL_API = true in src/endpoints/client.ts and set base URL (e.g. env) so request() hits your server.

API / endpoints (src/endpoints/)

routes.ts
Defines API_BASE ('/api') and routes.auth.* path strings for login, register, recover-email, recover-password, verify-security-answers, security-questions.
Backend: Keep these paths in sync with your routes. For a different host (e.g. native app), use a full base URL (e.g. process.env.EXPO_PUBLIC_API_URL) and pass full URL into request() (or build it in client.ts).

client.ts
Shared request(path, { method, body, headers }), ApiError, and USE_REAL_API. Sends JSON, reads JSON or text, throws ApiError on non-ok (message from body or status text). Also exports stubRequest() for mocks.
Backend: Set USE_REAL_API = true here to call your API. Ensure path passed to request() is full URL when not same-origin (e.g. prepend base in client or in each endpoint).

login.ts
Calls request(routes.auth.login, POST, body) when USE_REAL_API is true; otherwise returns mock login response.
Backend: Implements client for POST /api/auth/login; types from types.ts.

register.ts
Same pattern for register.
Backend: Implements POST /api/auth/register.

recover-email.ts
Same pattern for recover-email.
Backend: Implements POST /api/auth/recover-email.

recover-password.ts
Same pattern for recover-password.
Backend: Implements POST /api/auth/recover-password.

verify-security-answers.ts
Same pattern for verify-security-answers.
Backend: Implements POST /api/auth/verify-security-answers.

security-questions.ts
Same pattern for security-questions.
Backend: Implements POST /api/auth/security-questions.

index.ts
Re-exports ApiError, request, USE_REAL_API, API_BASE, routes, and all auth endpoint functions.
Backend: None.

Constants (src/constants/)
securityQuestions.ts

List of security questions (id + label) for registration and recovery dropdowns; type SecurityQuestionId.
Backend: Backend can use the same IDs or extend; store questionId + hashed answer per user; validate answers in verify-security-answers.
Backend checklist

Implement routes to match src/endpoints/routes.ts and accept JSON bodies per src/features/auth/types.ts.
Return error JSON with message (or client falls back to status text).
For security-questions and verify-security-answers, align question IDs with src/constants/securityQuestions.ts (or document your mapping).
Client turns on real API by setting USE_REAL_API = true in src/endpoints/client.ts and configuring the request base URL (same-origin or env-based full URL).