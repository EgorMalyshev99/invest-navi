export const locales = ['ru', 'en'] as const;
export const defaultLocale = 'ru';

export type AppLocale = (typeof locales)[number];
