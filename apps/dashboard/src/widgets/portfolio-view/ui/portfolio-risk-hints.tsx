'use client';

import { InfoIcon, WarningIcon } from '@phosphor-icons/react';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';

import type { PortfolioSummaryFieldsFragment } from '@/shared/api/graphql/generated/graphql';

import { GlossaryTerm } from '@/features/glossary-tip';
import { useTranslations } from '@/i18n/react-i18n';

interface PortfolioRiskHintsProps {
  hints: PortfolioRiskHint[];
}

type PortfolioRiskHint = PortfolioSummaryFieldsFragment['riskHints'][number];

function HintDescription({
  hint,
}: {
  hint: PortfolioRiskHint;
}) {
  const t = useTranslations('portfolio');
  const params = {
    symbol: hint.symbol ?? '',
    weight: hint.weightPercent?.toFixed(1) ?? '',
  };

  switch (hint.code) {
    case 'LOW_DIVERSIFICATION':
      return t('hint.lowDiversification');
    case 'HIGH_SYMBOL_CONCENTRATION':
      return t('hint.highSymbolConcentration', params);
    case 'HIGH_EQUITY_WEIGHT':
      return t('hint.highEquityWeight', params);
    case 'HIGH_CURRENCY_CONCENTRATION':
      return t.rich('hint.highCurrencyConcentrationGlossary', {
        weight: params.weight,
        volatility: () => (
          <GlossaryTerm termId="volatility">{t('hintVolatilityLabel')}</GlossaryTerm>
        ),
      });
    case 'PARTIAL_PRICE_DATA':
      return t('hint.partialPriceData');
    default:
      return hint.code;
  }
}

export function PortfolioRiskHints({ hints }: PortfolioRiskHintsProps) {
  const t = useTranslations('portfolio');

  if (!hints.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('riskHintsTitle')}</CardTitle>
        <p className="text-muted-foreground text-sm">{t('riskHintsSubtitle')}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {hints.map((hint) => {
          const isWarning = hint.severity === 'Warning';
          const Icon = isWarning ? WarningIcon : InfoIcon;

          return (
            <Alert
              key={`${hint.code}-${hint.symbol ?? ''}`}
              variant={isWarning ? 'default' : 'default'}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <AlertTitle className="text-sm font-medium">
                {isWarning ? t('hintSeverityWarning') : t('hintSeverityInfo')}
              </AlertTitle>
              <AlertDescription>
                <HintDescription hint={hint} />
              </AlertDescription>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
}
