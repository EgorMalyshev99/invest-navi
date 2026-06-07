'use client';

import { ArrowLeftIcon, InfoIcon } from '@phosphor-icons/react';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { Skeleton } from '@repo/ui/skeleton';

import {
  ChangeBadge,
  RiskBadge,
  TypeBadge,
  useAssetDetailQuery,
  useAssetInsightQuery,
} from '@/entities/asset';
import { AiInsightBlock, InsightBlocksSections, insightToBlocks } from '@/features/ai-insight';
import { buildAssetEducation, toEducationBlocks } from '@/features/asset-education';
import { GlossaryTerm } from '@/features/glossary-tip';
import { AddToWatchlistButton } from '@/features/watchlist';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from '@/i18n/react-i18n';
import { formatPrice } from '@/shared/lib/format';
import { AiDisclaimer } from '@/shared/ui/ai-disclaimer';


interface AssetDetailProps {
  symbol: string;
}

export function AssetDetail({ symbol }: AssetDetailProps) {
  const locale = useLocale();
  const t = useTranslations('asset');
  const tCatalog = useTranslations('catalog');
  const { data, isLoading, isError, refetch } = useAssetDetailQuery(symbol);

  const insightQuery = useAssetInsightQuery(symbol, locale, {
    enabled: Boolean(data?.asset),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/market" className="gap-2">
            <ArrowLeftIcon data-icon="inline-start" aria-hidden />
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/market" className="gap-2">
            <ArrowLeftIcon data-icon="inline-start" aria-hidden />
            {t('back')}
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={asset.instrumentType} />
              <RiskBadge level={education.riskLevel} />
              {education.sectorLabel ? (
                <span className="text-muted-foreground text-sm">{education.sectorLabel}</span>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
            <p className="text-muted-foreground font-mono text-sm tabular-nums">{asset.symbol}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.rich('glossaryHint', {
                volatility: () => (
                  <GlossaryTerm termId="volatility">{t('glossaryVolatilityLabel')}</GlossaryTerm>
                ),
                dividend: () => (
                  <GlossaryTerm termId="dividend">{t('glossaryDividendLabel')}</GlossaryTerm>
                ),
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-left sm:text-right">
            <p className="font-mono text-3xl font-semibold tabular-nums">
              {formatPrice(asset.lastPrice, asset.currency ?? 'RUB')}
            </p>
            <ChangeBadge value={asset.changePercent} className="text-base" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <AddToWatchlistButton asset={asset} />
          <Button type="button" variant="secondary" asChild>
            <Link href={`/diary?symbol=${encodeURIComponent(symbol)}`}>
              {t('createHypothesis')}
            </Link>
          </Button>
        </div>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <InfoIcon className="text-primary size-4" aria-hidden />
        <AlertTitle>{t('educationTitle')}</AlertTitle>
        <AlertDescription>
          <AiDisclaimer variant={isAi ? 'generated' : 'template'} className="text-sm" />
        </AlertDescription>
      </Alert>

      {insightQuery.isLoading ? (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-7 w-36" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(['what-is', 'what-changed', 'why-matters'] as const).map((id) => (
                <Skeleton key={id} className="h-36 w-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-7 w-44" />
            <div className="grid gap-4 md:grid-cols-2">
              {(['risks', 'for-investor'] as const).map((id) => (
                <Skeleton key={id} className="h-36 w-full" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <InsightBlocksSections
            blocks={blocks}
            sectionTitles={{
              overview: t('insightSectionOverview'),
              fit: t('insightSectionFit'),
            }}
            isAi={isAi}
            aiBadgeLabel={t('aiBadge')}
            templateBadgeLabel={t('templateBadge')}
          />
          {vsIndexText ? (
            <AiInsightBlock
              title={t('vsIndex')}
              body={vsIndexText}
              isAi={isAi}
              aiBadgeLabel={t('aiBadge')}
              templateBadgeLabel={t('templateBadge')}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
