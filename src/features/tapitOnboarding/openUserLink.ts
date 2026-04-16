import { Alert, Linking } from 'react-native';

/** Turn user input into something the system browser can open (https, tel, mailto, or a search). */
export function normalizeUserLinkForBrowser(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^tel:/i.test(t)) return t;
  if (/^mailto:/i.test(t)) return t;
  if (/^\+?[\d\s().-]{7,}$/.test(t)) {
    const digits = t.replace(/[^\d+]/g, '');
    return digits ? `tel:${digits}` : null;
  }
  if (/^[a-z0-9][a-z0-9+.-]*:\/\//i.test(t)) return t;
  if (/[.]/.test(t) && !/\s/.test(t)) return `https://${t}`;
  return `https://www.google.com/search?q=${encodeURIComponent(t)}`;
}

/** Opens in the device default browser (Safari, Chrome, etc.). */
export async function openUserLinkInBrowser(raw: string): Promise<void> {
  const url = normalizeUserLinkForBrowser(raw);
  if (!url) {
    Alert.alert('No link yet', 'Add a link or URL first.');
    return;
  }
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Cannot open', 'Check the link and try again.');
  }
}
