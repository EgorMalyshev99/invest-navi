'use client';

import { ArrowRightIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import {
  ChangeBadge,
  type Asset,
  MarketQuoteCard,
  useAssetsQuery,
  useFxRatesQuery,
  useIndicesQuery,
  useSectorsQuery,
} from '@/entities/asset';
import { pickSectorHighlights, pickTopMovers, resolveMarketMood } from '@/entities/learn';
import { useMeQuery } from '@/features/auth/api/use-me-query';
import { fromGraphqlKnowledgeLevel } from '@/features/auth/lib/graphql-enums';
import { GlossaryTerm } from '@/features/glossary-tip';
import { Link } from '@/i18n/navigation';
import { formatCompactNumber, formatFxRate, formatPrice } from '@/shared/lib/format';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

function MoverRow({ asset }: { asset: Asset }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <Link href={`/market/${asset.symbol}`} className="hover:text-primary min-w-0 flex-1">
        <p className="truncate font-medium">{asset.name}</p>
        <p className="text-muted-foreground font-mono text-xs tabular-nums">{asset.symbol}</p>
      </Link>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="font-mono text-sm tabular-nums">
          {formatPrice(asset.lastPrice, asset.currency ?? 'RUB')}
        </span>
        <ChangeBadge value={asset.changePercent} />
      </div>
    </div>
  );
}

export function MarketOverviewView() {
  const t = useTranslations('overview');
  const { data: meData } = useMeQuery();
  const knowledgeLevel = meData?.me.knowledgeLevel
    ? fromGraphqlKnowledgeLevel(meData.me.knowledgeLevel)
    : undefined;
  const isBeginner = knowledgeLevel === 'beginner' || knowledgeLevel === undefined;

  const { data: indices, isLoading: indicesLoading, isError: indicesError } = useIndicesQuery();
  const { data: sectors, isLoading: sectorsLoading, isError: sectorsError } = useSectorsQuery();
  const { data: assets, isLoading: assetsLoading, isError: assetsError } = useAssetsQuery(40);
  const { data: fxRates, isLoading: fxLoading, isError: fxError } = useFxRatesQuery();

  const isLoading = indicesLoading || sectorsLoading || assetsLoading || fxLoading;
  const isError = indicesError || sectorsError || assetsError || fxError;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !indices?.length) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('errorTitle')}</AlertTitle>
        <AlertDescription>{t('errorDescription')}</AlertDescription>
      </Alert>
    );
  }

  const mood = resolveMarketMood(indices);
  const movers = assets ? pickTopMovers(assets) : { gainers: [], losers: [] };
  const sectorHighlights = sectors ? pickSectorHighlights(sectors) : { leaders: [], laggards: [] };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{t('subtitle')}</p>
      </header>

      <Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
        <CardHeader>
          <CardTitle className="text-lg">{t(`mood.${mood}.title`)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">{t(`mood.${mood}.body`)}</p>
        </CardContent>
      </Card>

      {isBeginner ? (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">{t('beginnerCardTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm leading-relaxed">{t('beginnerCardBody')}</p>
            <Button variant="outline" asChild className="w-fit">
              <Link href="/learn/getting-started">
                {t('beginnerCardCta')}
                <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('newPathTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-muted-foreground flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                1
              </span>
              {t('newPathStep1')}
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                2
              </span>
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/learn">{t('newPathStep2')}</Link>
              </Button>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                3
              </span>
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/diary">{t('newPathStep3')}</Link>
              </Button>
            </li>
          </ol>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">{t('indicesTitle')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {indices.map((index) => (
            <MarketQuoteCard
              key={index.code}
              title={index.name}
              value={index.currentValue > 0 ? formatCompactNumber(index.currentValue) : '—'}
              changePercent={index.changePercent}
            />
          ))}
        </div>
      </section>

      {fxRates && fxRates.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium">{t('fxTitle')}</h2>
            <p className="text-muted-foreground text-xs">{t('fxSubtitle')}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fxRates.map((rate) => (
              <MarketQuoteCard
                key={rate.code}
                title={t(`fx.${rate.code}` as 'fx.USD')}
                value={formatFxRate(rate.currentValue, rate.code)}
                changePercent={rate.changePercent}
              />
            ))}
          </div>
        </section>
      ) : null}

      {movers.gainers.length > 0 || movers.losers.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('gainersTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="divide-border divide-y pt-0">
              {movers.gainers.map((asset) => (
                <MoverRow key={asset.symbol} asset={asset} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('losersTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="divide-border divide-y pt-0">
              {movers.losers.map((asset) => (
                <MoverRow key={asset.symbol} asset={asset} />
              ))}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {sectorHighlights.leaders.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">{t('sectorsTitle')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('sectorsLeaders')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {sectorHighlights.leaders.map((sector) => (
                  <div key={sector.code} className="flex items-center justify-between gap-2">
                    <span className="text-sm">{sector.name}</span>
                    <ChangeBadge value={sector.changePercent} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('sectorsLaggards')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {sectorHighlights.laggards.map((sector) => (
                  <div key={sector.code} className="flex items-center justify-between gap-2">
                    <span className="text-sm">{sector.name}</span>
                    <ChangeBadge value={sector.changePercent} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('plainLanguageTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-col gap-3 text-sm leading-relaxed">
          <p>{t('plainLanguageBody')}</p>
          <p>
            {t.rich('plainLanguageIndexHint', {
              index: () => (
                <GlossaryTerm termId="index">{t('plainLanguageIndexLabel')}</GlossaryTerm>
              ),
              sector: () => (
                <GlossaryTerm termId="sector">{t('plainLanguageSectorLabel')}</GlossaryTerm>
              ),
            })}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/market">
            {t('goCatalog')}
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/learn">{t('goLearn')}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/risks">{t('goRisks')}</Link>
        </Button>
      </div>

      <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>
    </div>
  );
}
