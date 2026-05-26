export const assetKeys = {
  all: ['assets'] as const,
  list: (limit: number) => [...assetKeys.all, limit] as const,
  detail: (symbol: string) => ['asset', symbol] as const,
  insight: (symbol: string, locale: string) => ['asset-insight', symbol, locale] as const,
  indices: ['indices'] as const,
};
