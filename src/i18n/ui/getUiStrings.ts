import type { AppLocale } from '@/src/i18n/appLocales';
import type { UiStrings } from '@/src/i18n/ui/types';

import { UI_EN } from '@/src/i18n/ui/en';
import { UI_AR } from '@/src/i18n/ui/locales/ar';
import { UI_DE } from '@/src/i18n/ui/locales/de';
import { UI_ES } from '@/src/i18n/ui/locales/es';
import { UI_FR } from '@/src/i18n/ui/locales/fr';
import { UI_HI } from '@/src/i18n/ui/locales/hi';
import { UI_JA } from '@/src/i18n/ui/locales/ja';
import { UI_KO } from '@/src/i18n/ui/locales/ko';
import { UI_PT_BR } from '@/src/i18n/ui/locales/pt-BR';
import { UI_ZH_HANS } from '@/src/i18n/ui/locales/zh-Hans';

const TABLE: Record<AppLocale, UiStrings> = {
  en: UI_EN,
  es: UI_ES,
  fr: UI_FR,
  de: UI_DE,
  'zh-Hans': UI_ZH_HANS,
  ja: UI_JA,
  'pt-BR': UI_PT_BR,
  ko: UI_KO,
  hi: UI_HI,
  ar: UI_AR,
};

export function getUiStrings(locale: AppLocale): UiStrings {
  return TABLE[locale] ?? UI_EN;
}

export type { MainTabKey, UiStrings } from '@/src/i18n/ui/types';
