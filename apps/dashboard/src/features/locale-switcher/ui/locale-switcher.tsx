'use client';

import { CaretDownIcon } from '@phosphor-icons/react';
import { Button } from '@repo/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { cn } from '@repo/ui/lib/utils';
import { useTranslation } from 'react-i18next';


import { updateProfile } from '@/features/auth/api/auth-api';
import { toGraphqlPreferredLocale } from '@/features/auth/lib/graphql-enums';
import { getLocaleLabelCode, type AppLocale } from '@/features/locale-switcher/model/locales';
import { LocaleFlag } from '@/features/locale-switcher/ui/locale-flag';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from '@/i18n/react-i18n';
import { routing } from '@/i18n/routing';
import { getAccessToken } from '@/shared/auth/token-store';


type LocaleSwitcherProps = {
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export function LocaleSwitcher({ align = 'end', className }: LocaleSwitcherProps) {
  const t = useTranslations('locale');
  const locale = useLocale() as AppLocale;
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = async (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    await i18n.changeLanguage(nextLocale);
    router.replace(pathname);
    if (getAccessToken()) {
      try {
        await updateProfile({ preferredLocale: toGraphqlPreferredLocale(nextLocale) });
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
