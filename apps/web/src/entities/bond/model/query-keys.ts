export const bondKeys = {
  all: ['bonds'] as const,
  list: (limit?: number) => [...bondKeys.all, 'list', limit ?? 20] as const,
  detail: (symbol: string) => [...bondKeys.all, 'detail', symbol] as const,
  insight: (symbol: string, locale: string) =>
    [...bondKeys.all, 'insight', symbol, locale] as const,
};
