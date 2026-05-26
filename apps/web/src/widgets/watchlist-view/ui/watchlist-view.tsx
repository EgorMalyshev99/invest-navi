'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { WatchlistCardList } from './watchlist-card-list';
import { WatchlistTable } from './watchlist-table';

import type { WatchlistRow } from '../model/types';

import { useAssetsQuery } from '@/entities/asset';
import { useWatchlist } from '@/features/watchlist';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@/i18n/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function WatchlistView() {
  const t = useTranslations('watchlist');
  const tStatus = useTranslations('watchlistStatus');
  const isMobile = useIsMobile();
  const { entries, remove, setStatus, analytics } = useWatchlist();

  const { data: assets } = useAssetsQuery(100, {
    enabled: entries.length > 0,
  });

  const priceBySymbol = useMemo(
    () => new Map(assets?.map((asset) => [asset.symbol, asset]) ?? []),
    [assets],
  );

  const rows: WatchlistRow[] = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        quote: priceBySymbol.get(entry.symbol),
      })),
    [entries, priceBySymbol],
  );

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('analyticsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="font-mono text-2xl font-semibold tabular-nums">{analytics.total}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            {(Object.keys(analytics.byStatus) as Array<keyof typeof analytics.byStatus>).map(
              (status) =>
                analytics.byStatus[status] > 0 ? (
                  <span key={status} className="bg-muted rounded-md px-2 py-1">
                    {tStatus(status)}: {analytics.byStatus[status]}
                  </span>
                ) : null,
            )}
          </div>
          {analytics.insight ? (
            <Alert>
              <AlertTitle>{t('analyticsInsightTitle')}</AlertTitle>
              <AlertDescription>{analytics.insight}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-10">
            <p className="text-muted-foreground text-sm">{t('empty')}</p>
            <Button asChild>
              <Link href="/market">{t('goMarket')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : isMobile ? (
        <WatchlistCardList rows={rows} onRemove={remove} onStatusChange={setStatus} />
      ) : (
        <WatchlistTable rows={rows} onRemove={remove} onStatusChange={setStatus} />
      )}
    </section>
  );
}
