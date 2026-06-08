import {
  getLocaleLabelCode as getSharedLocaleLabelCode,
  localeOptions,
} from '@repo/shared/lib/locales';

import type { routing } from '@/i18n/routing';

export type AppLocale = (typeof routing.locales)[number];

export { localeOptions };

export function getLocaleLabelCode(code: AppLocale): string {
  return getSharedLocaleLabelCode(code);
}
