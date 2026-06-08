export const localeOptions = [
  { code: 'ru' as const, labelCode: 'RU' },
  { code: 'en' as const, labelCode: 'EN' },
] as const;

export type LocaleCode = (typeof localeOptions)[number]['code'];

export function getLocaleLabelCode(code: string): string {
  const match = localeOptions.find((item) => item.code === code);
  return match?.labelCode ?? code.toUpperCase();
}
