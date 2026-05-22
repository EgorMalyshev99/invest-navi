'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { ChangeBadge, fetchAssets } from '@/entities/asset';
import { useWatchlist, WatchlistStatusSelect } from '@/features/watchlist';
import { Link } from '@/i18n/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function WatchlistView() {
  const t = useTranslations('watchlist');
  const tStatus = useTranslations('watchlistStatus');
  const { entries, remove, setStatus, analytics } = useWatchlist();

  const { data: assets } = useQuery({
    queryKey: ['assets', 100],
    queryFn: () => fetchAssets(100),
    enabled: entries.length > 0,
  });

  const priceBySymbol = new Map(assets?.map((asset) => [asset.symbol, asset]) ?? []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('analyticsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => {
            const quote = priceBySymbol.get(entry.symbol);
            return (
              <Card key={entry.symbol}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle className="text-base">
                      <Link href={`/market/${entry.symbol}`} className="hover:text-primary">
                        {entry.name}
                      </Link>
                    </CardTitle>
                    <p className="text-muted-foreground font-mono text-sm tabular-nums">
                      {entry.symbol}
                    </p>
                  </div>
                  {quote ? <ChangeBadge value={quote.changePercent} /> : null}
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <WatchlistStatusSelect
                    value={entry.status}
                    onValueChange={(status) => setStatus(entry.symbol, status)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(entry.symbol)}
                  >
                    {t('remove')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
