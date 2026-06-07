import type { Asset } from '@/entities/asset';

export interface TopMovers {
  gainers: Asset[];
  losers: Asset[];
}

export function pickTopMovers(assets: Asset[], count = 3): TopMovers {
  const withChange = assets.filter((asset) => Number.isFinite(asset.changePercent));
  const sorted = [...withChange].sort((a, b) => b.changePercent - a.changePercent);

  return {
    gainers: sorted.slice(0, count),
    losers: sorted.slice(-count).reverse(),
  };
}
