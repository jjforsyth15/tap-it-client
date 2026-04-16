export type LinkPageSocialRow = {
  id: string;
  platform: string;
  url: string;
};

export type LinkPageState = {
  firstName: string;
  lastName: string;
  pronouns: string;
  photoUri: string | null;
  bio: string;
  links: LinkPageSocialRow[];
  /** Public path segment (e.g. ab12cd34) */
  publicSlug: string | null;
  exportedAtIso: string | null;
  /** One-time merge from account profile when the sheet was still empty */
  didApplyInitialProfileDefaults: boolean;
};

export function defaultLinkPageState(): LinkPageState {
  return {
    firstName: '',
    lastName: '',
    pronouns: '',
    photoUri: null,
    bio: '',
    links: [],
    publicSlug: null,
    exportedAtIso: null,
    didApplyInitialProfileDefaults: false,
  };
}

export const LINK_PAGE_STORAGE_KEY = '@tap_it/link_page_v1';

export function publicPageBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_LINK_PAGE_BASE_URL?.trim();
  const base = raw && raw.length > 0 ? raw.replace(/\/+$/, '') : 'https://tapit.app';
  return base;
}

export function buildPublicPageUrl(slug: string): string {
  return `${publicPageBaseUrl()}/p/${slug}`;
}

export function randomPublicSlug(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < length; i += 1) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}
