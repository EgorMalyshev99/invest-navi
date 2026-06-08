'use client';

import { Button } from '@repo/ui';
import { RouteNotFoundLayout } from '@repo/ui/components/route-not-found-layout';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';

export function RouteNotFoundContent() {
  const t = useTranslations('errors');

  return (
    <RouteNotFoundLayout
      title={t('notFoundTitle')}
      description={t('notFoundDescription')}
      actions={
        <>
          <Button asChild>
            <Link href="/">{t('goHome')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/market">{t('goMarket')}</Link>
          </Button>
        </>
      }
    />
  );
}
