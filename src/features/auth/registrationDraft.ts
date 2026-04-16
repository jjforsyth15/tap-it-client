import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RegistrationFormDraft } from './types';

const STORAGE_KEY = '@tap_it/registration_draft_v1';

/** Persists across reloads / Metro refresh (in-memory draft did not). */
export async function setRegistrationDraft(data: RegistrationFormDraft): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getRegistrationDraft(): Promise<RegistrationFormDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const o = parsed as Record<string, unknown>;
    if (
      typeof o.firstName === 'string' &&
      typeof o.lastName === 'string' &&
      typeof o.email === 'string' &&
      typeof o.password === 'string' &&
      typeof o.phone === 'string'
    ) {
      return {
        firstName: o.firstName,
        lastName: o.lastName,
        email: o.email,
        password: o.password,
        phone: o.phone,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearRegistrationDraft(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
