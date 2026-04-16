import type { PasswordRecoveryDraft } from './types';

let draft: PasswordRecoveryDraft | null = null;

export function setPasswordRecoveryDraft(data: PasswordRecoveryDraft): void {
  draft = { ...data };
}

export function getPasswordRecoveryDraft(): PasswordRecoveryDraft | null {
  return draft;
}

export function clearPasswordRecoveryDraft(): void {
  draft = null;
}
