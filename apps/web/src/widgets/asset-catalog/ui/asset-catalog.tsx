'use client';

import { useTranslations } from 'next-intl';

import { AssetCatalogTable } from './asset-catalog-table';

import { ChangeBadge, RiskBadge, TypeBadge, type Asset, useAssetsQuery } from '@/entities/asset';
import { buildAssetEducation } from '@/features/asset-education';
import { CatalogViewToggle, useCatalogViewMode } from '@/features/catalog-view-mode';
import { AddToWatchlistButton } from '@/features/watchlist';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/shared/lib/format';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

function SimpleAssetCard({ asset }: { asset: Asset }) {
  const education = buildAssetEducation(asset, []);

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">
            <Link href={`/market/${asset.symbol}`} className="hover:text-primary">
              {asset.name}
            </Link>
          </CardTitle>
          <p className="text-muted-foreground font-mono text-sm tabular-nums">{asset.symbol}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TypeBadge type={asset.instrumentType} />
          <RiskBadge level={education.riskLevel} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-2">
          <p className="font-mono text-lg font-semibold tabular-nums">
            {formatPrice(asset.lastPrice, asset.currency ?? 'RUB')}
          </p>
          <ChangeBadge value={asset.changePercent} />
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{education.whatIs}</p>
        <AddToWatchlistButton asset={asset} variant="ghost" />
      </CardContent>
    </Card>
  );
}

export function AssetCatalog() {
  const t = useTranslations('catalog');
  const { isSimple } = useCatalogViewMode();
  const { data, isLoading, isError, refetch, isFetching } = useAssetsQuery(50);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
        </div>
        <CatalogViewToggle />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {(['a', 'b', 'c', 'd'] as const).map((id) => (
            <Skeleton key={id} className="h-40 w-full" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              {t('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('empty')}</p>
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <>
          {isFetching ? <p className="text-muted-foreground text-xs">{t('refreshing')}</p> : null}
          {isSimple ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.map((asset) => (
                <SimpleAssetCard key={asset.symbol} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetCatalogTable assets={data} />
          )}
        </>
      ) : null}
    </section>
  );
}
