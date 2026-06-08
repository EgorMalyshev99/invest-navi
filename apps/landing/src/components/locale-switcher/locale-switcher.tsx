'use client';

import { CaretDownIcon } from '@phosphor-icons/react';
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui';
import { useLocale, useTranslations } from 'next-intl';

import { LocaleFlag } from '@/components/locale-switcher/locale-flag';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getLocaleLabelCode, type AppLocale } from '@/lib/locales';

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
          <span className="text-muted-foreground inline-flex size-4" aria-hidden>
            <CaretDownIcon size={16} />
          </span>
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
