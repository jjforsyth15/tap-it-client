import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ADMIN_SESSION_KEY = 'tapit_admin_session';

export async function setAdminSession(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, '1');
    }
    return;
  }
  await SecureStore.setItemAsync(ADMIN_SESSION_KEY, '1');
}

export async function hasAdminSession(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(ADMIN_SESSION_KEY) === '1';
  }
  const v = await SecureStore.getItemAsync(ADMIN_SESSION_KEY);
  return v === '1';
}

export async function clearAdminSession(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
    return;
  }
  await SecureStore.deleteItemAsync(ADMIN_SESSION_KEY);
}
