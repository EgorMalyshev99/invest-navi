export const routing = {
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'never',
} as const;

export type AppLocale = (typeof routing.locales)[number];
