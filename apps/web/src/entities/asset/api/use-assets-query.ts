'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchAssets } from './asset-api';
import { assetKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function assetsQueryOptions(limit: number) {
  return queryOptions({
    queryKey: assetKeys.list(limit),
    queryFn: () => fetchAssets(limit),
  });
}

export function useAssetsQuery(limit: number, options?: QueryHookOverrides) {
  return useQuery({ ...assetsQueryOptions(limit), ...options });
}
