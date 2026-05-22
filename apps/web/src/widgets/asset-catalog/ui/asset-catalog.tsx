'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import {
  ChangeBadge,
  RiskBadge,
  TypeBadge,
  fetchAssets,
  getSectorLabel,
  type Asset,
} from '@/entities/asset';
import { buildAssetEducation } from '@/features/asset-education';
import { CatalogViewToggle, useCatalogViewMode } from '@/features/catalog-view-mode';
import { AddToWatchlistButton } from '@/features/watchlist';
import { Link } from '@/i18n/navigation';
import { formatCompactNumber, formatPercent, formatPrice } from '@/shared/lib/format';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

function SimpleAssetCard({ asset }: { asset: Asset }) {
  const education = buildAssetEducation(asset, []);

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
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
      <CardContent className="space-y-3">
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

function AdvancedTable({ assets }: { assets: Asset[] }) {
  const t = useTranslations('catalog');

  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('columnName')}</TableHead>
            <TableHead>{t('columnPrice')}</TableHead>
            <TableHead>{t('columnChange')}</TableHead>
            <TableHead>{t('columnVolume')}</TableHead>
            <TableHead>{t('columnSector')}</TableHead>
            <TableHead>{t('columnDividend')}</TableHead>
            <TableHead className="text-right">{t('columnLot')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.symbol}>
              <TableCell>
                <Link href={`/market/${asset.symbol}`} className="hover:text-primary font-medium">
                  {asset.name}
                </Link>
                <p className="text-muted-foreground font-mono text-xs tabular-nums">
                  {asset.symbol}
                </p>
              </TableCell>
              <TableCell className="font-mono tabular-nums">
                {formatPrice(asset.lastPrice, asset.currency ?? 'RUB')}
              </TableCell>
              <TableCell>
                <ChangeBadge value={asset.changePercent} />
              </TableCell>
              <TableCell className="font-mono tabular-nums">
                {asset.valueToday > 0 ? formatCompactNumber(asset.valueToday) : '—'}
              </TableCell>
              <TableCell className="text-sm">{getSectorLabel(asset.sector) ?? '—'}</TableCell>
              <TableCell className="font-mono tabular-nums">
                {asset.dividendYieldPercent != null
                  ? formatPercent(asset.dividendYieldPercent, { signed: false })
                  : '—'}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">{asset.lotSize}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AssetCatalog() {
  const t = useTranslations('catalog');
  const { isSimple } = useCatalogViewMode();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['assets', 50],
    queryFn: () => fetchAssets(50),
  });

  return (
    <section className="space-y-6">
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
            <AdvancedTable assets={data} />
          )}
        </>
      ) : null}
    </section>
  );
}
