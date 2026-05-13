/** Locales offered in Settings → Language (expand copy per locale over time). */
export type AppLocale =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'zh-Hans'
  | 'ja'
  | 'pt-BR'
  | 'hi'
  | 'ar'
  | 'ko';

export const APP_LOCALE_OPTIONS: { code: AppLocale; labelNative: string; labelEn: string }[] = [
  { code: 'en', labelNative: 'English', labelEn: 'English' },
  { code: 'es', labelNative: 'Español', labelEn: 'Spanish' },
  { code: 'fr', labelNative: 'Français', labelEn: 'French' },
  { code: 'de', labelNative: 'Deutsch', labelEn: 'German' },
  { code: 'zh-Hans', labelNative: '简体中文', labelEn: 'Chinese (Simplified)' },
  { code: 'ja', labelNative: '日本語', labelEn: 'Japanese' },
  { code: 'pt-BR', labelNative: 'Português (Brasil)', labelEn: 'Portuguese (Brazil)' },
  { code: 'hi', labelNative: 'हिन्दी', labelEn: 'Hindi' },
  { code: 'ar', labelNative: 'العربية', labelEn: 'Arabic' },
  { code: 'ko', labelNative: '한국어', labelEn: 'Korean' },
];

export function isAppLocale(v: string): v is AppLocale {
  return APP_LOCALE_OPTIONS.some((o) => o.code === v);
}

/** Locales that use right-to-left layout (Settings copy + mirrored UI). */
export function isRtlLocale(locale: AppLocale): boolean {
  return locale === 'ar';
}
