# TapIt Frontend -> Backend Integration Map

This document is for the backend team working in a separate repository.
It explains where auth-related frontend files live, what they do, and where to connect real endpoints.

## Current Status

- The frontend currently uses **mock auth responses**.
- The previous `src/endpoints/` folder was removed.
- API calls are currently stubbed directly in `src/features/auth/auth.api.ts`.

---

## Project Locations and Responsibilities

### Routing and Screens

- `src/app/_layout.tsx`
  - Root app layout and stack setup.
  - No backend logic.

- `src/app/index.tsx`
  - Landing page ("Welcome to TapIt") with navigation to auth flows.
  - No backend logic.

- `src/app/(auth)/_layout.tsx`
  - Auth stack route declarations.
  - No backend logic.

### Auth Screens (UI + Flow)

- `src/app/(auth)/login.tsx`
  - Calls `login(...)`.
  - Expects token + user on success.

- `src/app/(auth)/register.tsx`
  - Registration form and validation.
  - Proceeds to security question setup.
  - Register API can be called before/after security question submission based on backend design.

- `src/app/(auth)/security-questions-setup.tsx`
  - Collects 3 security question/answer pairs.
  - Calls `submitSecurityQuestions(...)`.

- `src/app/(auth)/email-recovery.tsx`
  - Phone-based email recovery.
  - Calls `recoverEmail(...)`.

- `src/app/(auth)/password-recovery.tsx`
  - Phone + email password recovery trigger.
  - Calls `recoverPassword(...)`.

- `src/app/(auth)/security-questions.tsx`
  - Verifies security answers in recovery flow.
  - Calls `verifySecurityAnswers(...)`.

- `src/app/(auth)/email-recovery-result.tsx`
- `src/app/(auth)/password-recovery-result.tsx`
- `src/app/(auth)/success-account-made.tsx`
- `src/app/(auth)/server-error.tsx`
  - Result and fallback screens.
  - No direct backend logic.

### Shared Auth Contracts and Logic

- `src/features/auth/types.ts`
  - **Primary request/response contract definitions** used by UI and auth API layer.
  - Backend should align payload/response shapes with these types.

- `src/features/auth/validators.ts`
  - Client-side validation only (UX).
  - Backend must still validate independently.

- `src/features/auth/auth.api.ts`
  - **Current integration point** for auth APIs.
  - Contains `ApiError` and stubbed functions:
    - `login`
    - `register`
    - `recoverEmail`
    - `recoverPassword`
    - `verifySecurityAnswers`
    - `submitSecurityQuestions`
  - This is the exact file to switch from mocks to real HTTP calls.

### Shared UI Components

- `src/components/*`
  - Reusable UI primitives (buttons, fields, screen wrapper, etc.).
  - No backend logic.

### Security Question Source

- `src/constants/securityQuestions.ts`
  - Frontend question IDs and labels.
  - Backend should accept these IDs (or provide/coordinate a canonical list).

---

## API Contract Summary (from `src/features/auth/types.ts`)

### Login

- Request: `LoginPayload`
  - `email: string`
  - `password: string`
- Success: `LoginResponse`
  - `token: string`
  - `user: { id: string; email: string }`

### Register

- Request: `RegisterPayload`
  - `firstName`, `lastName`, `email`, `password`, `phone`
- Success: `RegisterResponse`
  - `token: string`
  - `user: { id: string; email: string }`

### Recover Email

- Request: `RecoverEmailPayload`
  - `phone: string`
- Success: `RecoverEmailResponse`
  - `{ email: string }` or `{ inSystem: false }`

### Recover Password

- Request: `RecoverPasswordPayload`
  - `phone: string`
  - `email: string`
- Success: `RecoverPasswordResponse`
  - `{ sent: true }` or `{ inSystem: false }`

### Verify Security Answers

- Request: `VerifySecurityAnswersPayload`
  - `phone: string`
  - `answers: { questionId: string; answer: string }[]`
- Success: `VerifySecurityAnswersResponse`
  - `{ email: string }` or `{ correct: false }`

### Submit Security Questions

- Request: `SubmitSecurityQuestionsPayload`
  - `questions: { questionId: string; answer: string }[]`
  - `registrationToken?: string`
- Success: `SubmitSecurityQuestionsResponse`
  - `{ success: true }`

---

## Expected Error Shape

Frontend expects thrown errors to contain a readable message.

Recommended backend error response shape:

```json
{
  "message": "Human-readable error message"
}
```

If `message` is absent, the UI will fall back to a generic error path.

---

## Suggested Backend Route Map

These route names are suggestions based on existing frontend flow and prior route conventions.
Backend repo can choose different paths, but frontend `auth.api.ts` must be updated to match.

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/recover-email`
- `POST /auth/recover-password`
- `POST /auth/verify-security-answers`
- `POST /auth/security-questions`

---

## How To Connect Real Endpoints (Frontend)

1. Update `src/features/auth/auth.api.ts`:
   - Replace each stubbed function body with `fetch` or your shared HTTP client.
2. Keep request/response shapes aligned with `src/features/auth/types.ts`.
3. Throw `ApiError` with meaningful `message` for non-2xx responses.
4. Confirm navigation behavior per screen:
   - recover flows use union responses (`inSystem: false`, `correct: false`, etc.).
5. Test from these screens:
   - `login.tsx`
   - `register.tsx`
   - `security-questions-setup.tsx`
   - `email-recovery.tsx`
   - `password-recovery.tsx`
   - `security-questions.tsx`

---

## Notes for Separate Backend Repo

- CORS is required for web builds if frontend and backend origins differ.
- For native builds, use reachable host URLs (not localhost unless emulator/simulator mapping is configured).
- Security answers should be normalized and stored securely (hashed where applicable).
- Return stable identifiers and error messages; frontend rendering depends on predictable response shape.
