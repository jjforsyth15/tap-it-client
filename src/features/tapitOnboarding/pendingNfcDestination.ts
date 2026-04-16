import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@tap_it/pending_nfc_destination_v1';

export async function setPendingNfcDestination(url: string): Promise<void> {
  await AsyncStorage.setItem(KEY, url.trim());
}

/** Returns the stored URL once, then clears it (for hand-off into the card journey). */
export async function consumePendingNfcDestination(): Promise<string | null> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    if (v) await AsyncStorage.removeItem(KEY);
    return v?.trim() || null;
  } catch {
    return null;
  }
}
