import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchPortfolioPositions } from './portfolio-api';
import { portfolioKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function portfolioPositionsQueryOptions() {
  return queryOptions({
    queryKey: portfolioKeys.positions(),
    queryFn: fetchPortfolioPositions,
  });
}

export function usePortfolioPositionsQuery(options?: QueryHookOverrides) {
  return useQuery({ ...portfolioPositionsQueryOptions(), ...options });
}
