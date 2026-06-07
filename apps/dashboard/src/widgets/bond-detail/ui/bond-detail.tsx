'use client';

import { ArrowLeftIcon, InfoIcon } from '@phosphor-icons/react';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';

import { ChangeBadge } from '@/entities/asset';
import { useBondInsightQuery, useBondQuery } from '@/entities/bond';
import { AiInsightBlock } from '@/features/ai-insight';
import { GlossaryTerm } from '@/features/glossary-tip';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from '@/i18n/react-i18n';
import { formatPrice } from '@/shared/lib/format';
import { AiDisclaimer } from '@/shared/ui/ai-disclaimer';


interface BondDetailProps {
  symbol: string;
}

export function BondDetail({ symbol }: BondDetailProps) {
  const locale = useLocale();
  const t = useTranslations('bonds');
  const { data: bond, isLoading, isError, refetch } = useBondQuery(symbol);

  const insightQuery = useBondInsightQuery(symbol, locale, {
    enabled: Boolean(bond),
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

  if (isError || !bond) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/bonds" className="gap-2">
            <ArrowLeftIcon data-icon="inline-start" aria-hidden />
            {t('back')}
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertTitle>{t('notFound')}</AlertTitle>
          <AlertDescription>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              {t('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const insight = insightQuery.isError ? undefined : insightQuery.data;
  const isAi = insight?.source === 'AI';

  return (
    <section className="flex flex-col gap-6">
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/bonds" className="gap-2">
          <ArrowLeftIcon data-icon="inline-start" aria-hidden />
          {t('back')}
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{bond.name}</h1>
          <p className="text-muted-foreground font-mono text-sm tabular-nums">{bond.symbol}</p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {t.rich('glossaryHint', {
              coupon: () => <GlossaryTerm termId="coupon">{t('glossaryCouponLabel')}</GlossaryTerm>,
              yield: () => <GlossaryTerm termId="yield">{t('glossaryYieldLabel')}</GlossaryTerm>,
              issuer: () => <GlossaryTerm termId="issuer">{t('glossaryIssuerLabel')}</GlossaryTerm>,
              faceValue: () => (
                <GlossaryTerm termId="face-value">{t('glossaryFaceValueLabel')}</GlossaryTerm>
              ),
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="font-mono text-xl font-semibold tabular-nums">
            {formatPrice(bond.lastPrice, bond.currency ?? 'RUB')}
          </p>
          <ChangeBadge value={bond.changePercent} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t('metricCoupon')}
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-lg tabular-nums">
            {bond.couponPercent !== null && bond.couponPercent !== undefined
              ? `${bond.couponPercent.toFixed(2)}%`
              : '—'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t('metricYield')}
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-lg tabular-nums">
            {bond.yieldAtPrice !== null && bond.yieldAtPrice !== undefined
              ? `${bond.yieldAtPrice.toFixed(2)}%`
              : '—'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {t('metricMaturity')}
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-lg tabular-nums">
            {bond.maturityDate ?? '—'}
          </CardContent>
        </Card>
      </div>

      {insightQuery.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : insight ? (
        <div className="flex flex-col gap-4">
          <AiInsightBlock
            title={t('insightOverview')}
            body={insight.overview}
            isAi={isAi}
            aiBadgeLabel={t('aiBadge')}
            templateBadgeLabel={t('templateBadge')}
          />
          <AiInsightBlock
            title={t('insightCoupon')}
            body={insight.couponAndMaturity}
            isAi={isAi}
            aiBadgeLabel={t('aiBadge')}
            templateBadgeLabel={t('templateBadge')}
          />
          <AiInsightBlock
            title={t('insightYield')}
            body={insight.yieldContext}
            isAi={isAi}
            aiBadgeLabel={t('aiBadge')}
            templateBadgeLabel={t('templateBadge')}
          />
          <AiInsightBlock
            title={t('insightRate')}
            body={insight.rateSensitivity}
            isAi={isAi}
            aiBadgeLabel={t('aiBadge')}
            templateBadgeLabel={t('templateBadge')}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('insightRisks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
                {insight.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('insightQuestions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-muted-foreground flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed">
                {insight.questionsBeforeBuy.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
          {insight.liquidityNote ? (
            <Alert>
              <InfoIcon className="size-4" aria-hidden />
              <AlertTitle>{t('insightLiquidity')}</AlertTitle>
              <AlertDescription>{insight.liquidityNote}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      ) : null}

      <Alert>
        <InfoIcon className="size-4" aria-hidden />
        <AlertDescription>
          <AiDisclaimer variant={isAi ? 'generated' : 'template'} className="text-sm" />
        </AlertDescription>
      </Alert>
    </section>
  );
}
