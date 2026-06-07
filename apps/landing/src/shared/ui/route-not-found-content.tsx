'use client';

import { Button } from '@repo/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@repo/ui/empty';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export function RouteNotFoundContent() {
  const t = useTranslations('errors');

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16">
      <Empty className="max-w-md">
        <EmptyHeader>
          <EmptyTitle>{t('notFoundTitle')}</EmptyTitle>
          <EmptyDescription>{t('notFoundDescription')}</EmptyDescription>
        </EmptyHeader>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">{t('goHome')}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/market">{t('goMarket')}</Link>
          </Button>
        </div>
      </Empty>
    </div>
  );
}
