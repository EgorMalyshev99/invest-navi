'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-muted inline-flex rounded-lg p-1">
      {routing.locales.map((nextLocale) => (
        <Button
          key={nextLocale}
          type="button"
          size="sm"
          variant={locale === nextLocale ? 'default' : 'ghost'}
          onClick={() => router.replace(pathname, { locale: nextLocale })}
        >
          {t(nextLocale)}
        </Button>
      ))}
    </div>
  );
}
