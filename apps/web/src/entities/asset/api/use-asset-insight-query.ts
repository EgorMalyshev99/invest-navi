'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchAssetInsight } from './asset-insight-api';
import { assetKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function assetInsightQueryOptions(symbol: string, locale: string) {
  return queryOptions({
    queryKey: assetKeys.insight(symbol, locale),
    queryFn: () => fetchAssetInsight(symbol, locale),
    staleTime: 60_000,
  });
}

export function useAssetInsightQuery(symbol: string, locale: string, options?: QueryHookOverrides) {
  return useQuery({ ...assetInsightQueryOptions(symbol, locale), ...options });
}
