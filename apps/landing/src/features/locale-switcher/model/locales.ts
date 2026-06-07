import type { routing } from '@/i18n/routing';

export type AppLocale = (typeof routing.locales)[number];

export const localeOptions = [
  { code: 'ru' as const, labelCode: 'RU' },
  { code: 'en' as const, labelCode: 'EN' },
] as const satisfies ReadonlyArray<{ code: AppLocale; labelCode: string }>;

export function getLocaleLabelCode(code: AppLocale): string {
  return localeOptions.find((item) => item.code === code)?.labelCode ?? code.toUpperCase();
}
