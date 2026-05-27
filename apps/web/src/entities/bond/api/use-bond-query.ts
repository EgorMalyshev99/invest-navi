import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchBond } from './bond-api';
import { bondKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function bondQueryOptions(symbol: string) {
  return queryOptions({
    queryKey: bondKeys.detail(symbol),
    queryFn: () => fetchBond(symbol),
  });
}

export function useBondQuery(symbol: string, options?: QueryHookOverrides) {
  return useQuery({ ...bondQueryOptions(symbol), ...options });
}
