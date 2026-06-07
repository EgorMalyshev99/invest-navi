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
import { useLocale, useTranslations } from 'next-intl';

import { getLocaleLabelCode, type AppLocale } from '@/features/locale-switcher/model/locales';
import { LocaleFlag } from '@/features/locale-switcher/ui/locale-flag';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type LocaleSwitcherProps = {
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export function LocaleSwitcher({ align = 'end', className }: LocaleSwitcherProps) {
  const t = useTranslations('locale');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
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
