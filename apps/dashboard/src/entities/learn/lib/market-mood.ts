import type { MarketMood } from '../model/types';
import type { MarketIndex, SectorIndex } from '@/shared/types/market';

const FLAT_THRESHOLD = 0.15;

export function resolveMarketMood(indices: MarketIndex[]): MarketMood {
  const imoex = indices.find((index) => index.code === 'IMOEX');
  if (!imoex) {
    return 'flat';
  }
  if (imoex.changePercent > FLAT_THRESHOLD) {
    return 'up';
  }
  if (imoex.changePercent < -FLAT_THRESHOLD) {
    return 'down';
  }
  return 'flat';
}

export function pickSectorHighlights(sectors: SectorIndex[], count = 2) {
  const sorted = [...sectors].sort((a, b) => b.changePercent - a.changePercent);
  return {
    leaders: sorted.slice(0, count),
    laggards: sorted.slice(-count).reverse(),
  };
}
