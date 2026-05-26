import { InstrumentType } from '@repo/api';

import { PortfolioRiskSeverity } from '../dto/portfolio-risk-severity.enum';
import { PortfolioAllocationSlice } from '../entities/portfolio-allocation-slice.type';
import { PortfolioRiskHint } from '../entities/portfolio-risk-hint.type';
import { PortfolioSummary } from '../entities/portfolio-summary.type';

import type { PortfolioPosition } from '../entities/portfolio-position.type';

const INSTRUMENT_LABELS: Record<string, string> = {
  [InstrumentType.Share]: 'Shares',
  [InstrumentType.Bond]: 'Bonds',
  [InstrumentType.Etf]: 'ETFs',
  [InstrumentType.Currency]: 'Currency',
  [InstrumentType.Index]: 'Indices',
};

const SYMBOL_CONCENTRATION_THRESHOLD = 40;
const EQUITY_WEIGHT_THRESHOLD = 70;
const CURRENCY_CONCENTRATION_THRESHOLD = 80;
const MIN_POSITIONS_FOR_DIVERSIFICATION = 3;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildSlices(
  buckets: Map<string, { label?: string; value: number }>,
  totalValue: number,
): PortfolioAllocationSlice[] {
  if (totalValue <= 0) {
    return [];
  }

  return [...buckets.entries()]
    .map(([key, bucket]) => ({
      key,
      label: bucket.label,
      value: round2(bucket.value),
      weightPercent: round2((bucket.value / totalValue) * 100),
    }))
    .sort((a, b) => b.value - a.value);
}

function computeRiskHints(
  positions: PortfolioPosition[],
  totalValue: number,
  bySymbol: PortfolioAllocationSlice[],
  byInstrumentType: PortfolioAllocationSlice[],
  byCurrency: PortfolioAllocationSlice[],
): PortfolioRiskHint[] {
  const hints: PortfolioRiskHint[] = [];

  if (positions.length > 0 && positions.length < MIN_POSITIONS_FOR_DIVERSIFICATION) {
    hints.push({
      code: 'LOW_DIVERSIFICATION',
      severity: PortfolioRiskSeverity.Info,
    });
  }

  const topSymbol = bySymbol[0];
  if (topSymbol && topSymbol.weightPercent >= SYMBOL_CONCENTRATION_THRESHOLD) {
    hints.push({
      code: 'HIGH_SYMBOL_CONCENTRATION',
      severity: PortfolioRiskSeverity.Warning,
      symbol: topSymbol.key,
      weightPercent: topSymbol.weightPercent,
    });
  }

  const shareSlice = byInstrumentType.find((slice) => slice.key === InstrumentType.Share);
  if (shareSlice && shareSlice.weightPercent >= EQUITY_WEIGHT_THRESHOLD) {
    hints.push({
      code: 'HIGH_EQUITY_WEIGHT',
      severity: PortfolioRiskSeverity.Warning,
      weightPercent: shareSlice.weightPercent,
    });
  }

  const topCurrency = byCurrency[0];
  if (topCurrency && topCurrency.weightPercent >= CURRENCY_CONCENTRATION_THRESHOLD) {
    hints.push({
      code: 'HIGH_CURRENCY_CONCENTRATION',
      severity: PortfolioRiskSeverity.Warning,
      weightPercent: topCurrency.weightPercent,
    });
  }

  const missingPrices = positions.filter((position) => position.currentPrice === undefined);
  if (missingPrices.length > 0 && totalValue > 0) {
    hints.push({
      code: 'PARTIAL_PRICE_DATA',
      severity: PortfolioRiskSeverity.Info,
    });
  }

  return hints;
}

export function computePortfolioSummary(positions: PortfolioPosition[]): PortfolioSummary {
  const totalCostBasis = round2(positions.reduce((sum, position) => sum + position.costBasis, 0));
  const totalMarketValue = round2(
    positions.reduce((sum, position) => sum + (position.marketValue ?? position.costBasis), 0),
  );
  const totalUnrealizedPl = round2(totalMarketValue - totalCostBasis);
  const totalUnrealizedPlPercent =
    totalCostBasis > 0 ? round2((totalUnrealizedPl / totalCostBasis) * 100) : undefined;

  const byTypeBuckets = new Map<string, { label?: string; value: number }>();
  const bySymbolBuckets = new Map<string, { label?: string; value: number }>();
  const byCurrencyBuckets = new Map<string, { label?: string; value: number }>();

  for (const position of positions) {
    const value = position.marketValue ?? position.costBasis;
    const typeKey = position.instrumentType ?? 'UNKNOWN';
    const typeBucket = byTypeBuckets.get(typeKey) ?? {
      label: INSTRUMENT_LABELS[typeKey] ?? typeKey,
      value: 0,
    };
    typeBucket.value += value;
    byTypeBuckets.set(typeKey, typeBucket);

    const symbolBucket = bySymbolBuckets.get(position.assetSymbol) ?? {
      label: position.assetName ?? position.assetSymbol,
      value: 0,
    };
    symbolBucket.value += value;
    bySymbolBuckets.set(position.assetSymbol, symbolBucket);

    const currencyKey = position.currency ?? 'UNKNOWN';
    const currencyBucket = byCurrencyBuckets.get(currencyKey) ?? {
      label: currencyKey,
      value: 0,
    };
    currencyBucket.value += value;
    byCurrencyBuckets.set(currencyKey, currencyBucket);
  }

  const byInstrumentType = buildSlices(byTypeBuckets, totalMarketValue);
  const bySymbol = buildSlices(bySymbolBuckets, totalMarketValue);
  const byCurrency = buildSlices(byCurrencyBuckets, totalMarketValue);

  return {
    positionsCount: positions.length,
    totalCostBasis,
    totalMarketValue,
    totalUnrealizedPl,
    totalUnrealizedPlPercent,
    byInstrumentType,
    bySymbol,
    byCurrency,
    riskHints: computeRiskHints(
      positions,
      totalMarketValue,
      bySymbol,
      byInstrumentType,
      byCurrency,
    ),
  };
}
