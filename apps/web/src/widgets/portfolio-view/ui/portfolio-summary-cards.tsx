'use client';

import { useTranslations } from 'next-intl';

import type { PortfolioSummaryFieldsFragment } from '@/shared/api/graphql/generated/graphql';

import { ChangeBadge } from '@/entities/asset';
import { formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface PortfolioSummaryCardsProps {
  summary: PortfolioSummaryFieldsFragment;
}

export function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
  const t = useTranslations('portfolio');

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {t('summaryMarketValue')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {formatPrice(summary.totalMarketValue)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {t('summaryCostBasis')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">
            {formatPrice(summary.totalCostBasis)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {t('summaryUnrealizedPl')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-2xl font-semibold tabular-nums">
            {formatPrice(summary.totalUnrealizedPl)}
          </p>
          {summary.totalUnrealizedPlPercent !== null &&
          summary.totalUnrealizedPlPercent !== undefined ? (
            <ChangeBadge value={summary.totalUnrealizedPlPercent} />
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {t('summaryPositions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">{summary.positionsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
