import {
  cn,
} from '@repo/ui';
import { GB, RU } from 'country-flag-icons/react/3x2';

import type { AppLocale } from '@/features/locale-switcher/model/locales';

const localeFlags: Record<AppLocale, typeof RU> = {
  ru: RU,
  en: GB,
};

type LocaleFlagProps = {
  locale: AppLocale;
  className?: string;
};

export function LocaleFlag({ locale, className }: LocaleFlagProps) {
  const Flag = localeFlags[locale];
  return <Flag className={cn('h-4 w-6 shrink-0 rounded-sm', className)} aria-hidden />;
}
