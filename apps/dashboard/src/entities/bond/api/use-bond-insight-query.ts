import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchBondInsight } from './bond-insight-api';
import { bondKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function bondInsightQueryOptions(symbol: string, locale: string) {
  return queryOptions({
    queryKey: bondKeys.insight(symbol, locale),
    queryFn: () => fetchBondInsight(symbol, locale),
  });
}

export function useBondInsightQuery(symbol: string, locale: string, options?: QueryHookOverrides) {
  return useQuery({ ...bondInsightQueryOptions(symbol, locale), ...options });
}
