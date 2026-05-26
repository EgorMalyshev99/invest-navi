'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchAssetDetail } from './asset-api';
import { assetKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function assetDetailQueryOptions(symbol: string) {
  return queryOptions({
    queryKey: assetKeys.detail(symbol),
    queryFn: () => fetchAssetDetail(symbol),
  });
}

export function useAssetDetailQuery(symbol: string, options?: QueryHookOverrides) {
  return useQuery({ ...assetDetailQueryOptions(symbol), ...options });
}
