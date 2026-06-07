import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchPortfolioSummary } from './portfolio-api';
import { portfolioKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function portfolioSummaryQueryOptions() {
  return queryOptions({
    queryKey: portfolioKeys.summary(),
    queryFn: fetchPortfolioSummary,
  });
}

export function usePortfolioSummaryQuery(options?: QueryHookOverrides) {
  return useQuery({ ...portfolioSummaryQueryOptions(), ...options });
}
