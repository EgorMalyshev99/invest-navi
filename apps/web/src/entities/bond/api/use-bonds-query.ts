import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchBonds } from './bond-api';
import { bondKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function bondsQueryOptions(limit = 30) {
  return queryOptions({
    queryKey: bondKeys.list(limit),
    queryFn: () => fetchBonds(limit),
  });
}

export function useBondsQuery(limit = 30, options?: QueryHookOverrides) {
  return useQuery({ ...bondsQueryOptions(limit), ...options });
}
