import { PortfolioPosition } from '../entities/portfolio-position.type';

import type { portfolioPositions } from '../../database/schema/portfolio-positions';
import type { InstrumentType } from '@repo/api';

type PortfolioRow = typeof portfolioPositions.$inferSelect;

export interface PortfolioMarketSnapshot {
  assetName?: string;
  instrumentType?: InstrumentType;
  currency?: string;
  currentPrice?: number;
}

function parseNumeric(value: string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function mapPortfolioPosition(
  row: PortfolioRow,
  market?: PortfolioMarketSnapshot,
): PortfolioPosition {
  const quantity = parseNumeric(row.quantity);
  const entryPrice = parseNumeric(row.entryPrice);
  const costBasis = round2(quantity * entryPrice);
  const currentPrice = market?.currentPrice;
  const marketValue = currentPrice !== undefined ? round2(quantity * currentPrice) : undefined;
  const unrealizedPl = marketValue !== undefined ? round2(marketValue - costBasis) : undefined;
  const unrealizedPlPercent =
    unrealizedPl !== undefined && costBasis > 0
      ? round2((unrealizedPl / costBasis) * 100)
      : undefined;

  return {
    id: row.id,
    assetSymbol: row.assetSymbol,
    assetName: market?.assetName,
    instrumentType: market?.instrumentType,
    currency: market?.currency,
    quantity,
    entryPrice,
    entryDate: row.entryDate,
    goal: row.goal ?? undefined,
    currentPrice,
    marketValue,
    costBasis,
    unrealizedPl,
    unrealizedPlPercent,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
