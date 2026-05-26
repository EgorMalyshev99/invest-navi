export const MARKET_ASSETS_MIN_LIMIT = 1;
export const MARKET_ASSETS_MAX_LIMIT = 100;
export const MARKET_ASSETS_DEFAULT_LIMIT = 20;

export function clampMarketAssetsLimit(limit: number): number {
  if (!Number.isFinite(limit)) {
    return MARKET_ASSETS_DEFAULT_LIMIT;
  }
  const rounded = Math.trunc(limit);
  return Math.min(MARKET_ASSETS_MAX_LIMIT, Math.max(MARKET_ASSETS_MIN_LIMIT, rounded));
}
