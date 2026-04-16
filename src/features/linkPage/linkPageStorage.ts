import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultLinkPageState,
  LINK_PAGE_STORAGE_KEY,
  type LinkPageSocialRow,
  type LinkPageState,
} from '@/src/features/linkPage/linkPageTypes';
import type { UserProfileState } from '@/src/features/profile/profileTypes';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function parseLinks(raw: unknown): LinkPageSocialRow[] {
  if (!Array.isArray(raw)) return [];
  const out: LinkPageSocialRow[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const id = typeof item.id === 'string' ? item.id : '';
    const platform = typeof item.platform === 'string' ? item.platform : '';
    const url = typeof item.url === 'string' ? item.url : '';
    if (!id) continue;
    out.push({ id, platform, url });
  }
  return out;
}

function mergeStored(parsed: unknown): LinkPageState {
  const base = defaultLinkPageState();
  if (!isRecord(parsed)) return base;
  return {
    ...base,
    firstName: typeof parsed.firstName === 'string' ? parsed.firstName : base.firstName,
    lastName: typeof parsed.lastName === 'string' ? parsed.lastName : base.lastName,
    pronouns: typeof parsed.pronouns === 'string' ? parsed.pronouns : base.pronouns,
    photoUri:
      typeof parsed.photoUri === 'string'
        ? parsed.photoUri
        : parsed.photoUri === null
          ? null
          : base.photoUri,
    bio: typeof parsed.bio === 'string' ? parsed.bio : base.bio,
    links: parseLinks(parsed.links),
    publicSlug:
      typeof parsed.publicSlug === 'string'
        ? parsed.publicSlug
        : parsed.publicSlug === null
          ? null
          : base.publicSlug,
    exportedAtIso:
      typeof parsed.exportedAtIso === 'string'
        ? parsed.exportedAtIso
        : parsed.exportedAtIso === null
          ? null
          : base.exportedAtIso,
    didApplyInitialProfileDefaults:
      typeof parsed.didApplyInitialProfileDefaults === 'boolean'
        ? parsed.didApplyInitialProfileDefaults
        : base.didApplyInitialProfileDefaults,
  };
}

export async function loadLinkPageState(): Promise<LinkPageState> {
  try {
    const raw = await AsyncStorage.getItem(LINK_PAGE_STORAGE_KEY);
    if (!raw) return defaultLinkPageState();
    return mergeStored(JSON.parse(raw));
  } catch {
    return defaultLinkPageState();
  }
}

export async function saveLinkPageState(state: LinkPageState): Promise<void> {
  await AsyncStorage.setItem(LINK_PAGE_STORAGE_KEY, JSON.stringify(state));
}

function newRowId(): string {
  return `l_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/** One-time fill from account profile when the link page is still a blank slate. */
export function applyProfileDefaultsToLinkPage(
  state: LinkPageState,
  profile: UserProfileState,
): LinkPageState {
  if (state.didApplyInitialProfileDefaults) return state;
  let next: LinkPageState = { ...state, didApplyInitialProfileDefaults: true };

  const dn = profile.displayName.trim();
  if (!next.firstName.trim() && !next.lastName.trim() && dn) {
    const parts = dn.split(/\s+/).filter(Boolean);
    next = {
      ...next,
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' '),
    };
  }

  if (!next.bio.trim() && profile.bio.trim()) {
    next = { ...next, bio: profile.bio };
  }

  if (!next.photoUri && profile.profileImageUri) {
    next = { ...next, photoUri: profile.profileImageUri };
  }

  if (next.links.length === 0) {
    const fromProfile: LinkPageSocialRow[] = [];
    if (profile.socialInstagram.trim()) {
      fromProfile.push({ id: newRowId(), platform: 'Instagram', url: profile.socialInstagram.trim() });
    }
    if (profile.socialTwitter.trim()) {
      fromProfile.push({ id: newRowId(), platform: 'X (Twitter)', url: profile.socialTwitter.trim() });
    }
    if (profile.socialFacebook.trim()) {
      fromProfile.push({ id: newRowId(), platform: 'Facebook', url: profile.socialFacebook.trim() });
    }
    if (profile.socialLinkedin.trim()) {
      fromProfile.push({ id: newRowId(), platform: 'LinkedIn', url: profile.socialLinkedin.trim() });
    }
    next = { ...next, links: fromProfile };
  }

  return next;
}
