'use client';

import { CaretDownIcon } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';

import type { PreferredLocale } from '@/shared/api/graphql/generated/graphql';

import { updateProfile } from '@/features/auth/api/auth-api';
import { getLocaleLabelCode, type AppLocale } from '@/features/locale-switcher/model/locales';
import { LocaleFlag } from '@/features/locale-switcher/ui/locale-flag';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { getAccessToken } from '@/shared/lib/auth-cookies';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

type LocaleSwitcherProps = {
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export function LocaleSwitcher({ align = 'end', className }: LocaleSwitcherProps) {
  const t = useTranslations('locale');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = async (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
    if (getAccessToken()) {
      try {
        await updateProfile({ preferredLocale: nextLocale as PreferredLocale });
      } catch {
        // Locale cookie still updated by router
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('gap-1.5 px-2', className)}
          aria-label={t('switch')}
        >
          <LocaleFlag locale={locale} />
          <span className="text-sm font-medium tracking-wide">{getLocaleLabelCode(locale)}</span>
          <CaretDownIcon className="text-muted-foreground size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-36">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => handleChange(value as AppLocale)}
        >
          {routing.locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              <LocaleFlag locale={code as AppLocale} />
              {t(code)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
