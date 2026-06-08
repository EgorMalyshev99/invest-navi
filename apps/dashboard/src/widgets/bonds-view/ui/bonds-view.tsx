'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
} from '@repo/ui';

import { BondsCatalogTable } from './bonds-catalog-table';
import { BondsIntroPanel } from './bonds-intro-panel';

import { useBondsQuery } from '@/entities/bond';
import { useTranslations } from '@/i18n/react-i18n';

export function BondsView() {
  const t = useTranslations('bonds');
  const { data: bonds, isLoading, isError, refetch } = useBondsQuery(40);

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
      </div>

      <BondsIntroPanel />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t('loadError')}</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              {t('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <BondsCatalogTable bonds={bonds ?? []} emptyMessage={t('empty')} />
      )}

      <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>
    </section>
  );
}
