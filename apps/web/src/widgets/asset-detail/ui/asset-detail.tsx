'use client';

import { ArrowLeft, Info } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChangeBadge,
  RiskBadge,
  TypeBadge,
  fetchAssetDetail,
  fetchAssetInsight,
} from '@/entities/asset';
import { AiInsightBlock, insightToBlocks } from '@/features/ai-insight';
import { buildAssetEducation, toEducationBlocks } from '@/features/asset-education';
import { AddToWatchlistButton } from '@/features/watchlist';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/shared/lib/format';

interface AssetDetailProps {
  symbol: string;
}

export function AssetDetail({ symbol }: AssetDetailProps) {
  const locale = useLocale();
  const t = useTranslations('asset');
  const tCatalog = useTranslations('catalog');
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['asset', symbol],
    queryFn: () => fetchAssetDetail(symbol),
  });

  const insightQuery = useQuery({
    queryKey: ['asset-insight', symbol, locale],
    queryFn: () => fetchAssetInsight(symbol, locale),
    enabled: Boolean(data?.asset),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/market" className="gap-2">
            <ArrowLeft className="size-4" aria-hidden />
            {t('back')}
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertTitle>{t('notFound')}</AlertTitle>
          <AlertDescription>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              {tCatalog('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { asset, indices } = data;
  const education = buildAssetEducation(asset, indices);
  const blockTitles = {
    whatIs: t('whatIs'),
    whatChanged: t('whatChanged'),
    whyMatters: t('whyMatters'),
    risks: t('risks'),
    forInvestor: t('forInvestor'),
  };

  const insight = insightQuery.isError ? undefined : insightQuery.data;
  const isAi = insight?.source === 'AI';
  const blocks = insight
    ? insightToBlocks(insight, blockTitles)
    : toEducationBlocks(education, blockTitles);
  const vsIndexText = insight?.vsIndex ?? education.vsIndexText;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/market" className="gap-2">
            <ArrowLeft className="size-4" aria-hidden />
            {t('back')}
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={asset.instrumentType} />
              <RiskBadge level={education.riskLevel} />
              {education.sectorLabel ? (
                <span className="text-muted-foreground text-sm">{education.sectorLabel}</span>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
            <p className="text-muted-foreground font-mono text-sm tabular-nums">{asset.symbol}</p>
          </div>
          <div className="space-y-2 text-left sm:text-right">
            <p className="font-mono text-3xl font-semibold tabular-nums">
              {formatPrice(asset.lastPrice, asset.currency ?? 'RUB')}
            </p>
            <ChangeBadge value={asset.changePercent} className="text-base" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <AddToWatchlistButton asset={asset} />
          <Button type="button" variant="secondary" disabled title={t('comingSoon')}>
            {t('createHypothesis')}
          </Button>
        </div>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <Info className="text-primary size-4" aria-hidden />
        <AlertTitle>{t('educationTitle')}</AlertTitle>
        <AlertDescription>{isAi ? t('aiDisclaimerGenerated') : t('aiDisclaimer')}</AlertDescription>
      </Alert>

      {insightQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {(['what-is', 'what-changed', 'why-matters', 'risks'] as const).map((id) => (
            <Skeleton key={id} className="h-36 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {blocks.map((block) => (
            <AiInsightBlock
              key={block.id}
              title={block.title}
              body={block.body}
              isAi={isAi}
              aiBadgeLabel={t('aiBadge')}
              templateBadgeLabel={t('templateBadge')}
              className={block.id === 'risks' ? 'lg:col-span-2' : undefined}
            />
          ))}
        </div>
      )}

      {vsIndexText ? (
        <Card className={isAi ? 'border-primary/20 bg-primary/5' : undefined}>
          <CardHeader>
            <CardTitle className="text-base">{t('vsIndex')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">{vsIndexText}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
