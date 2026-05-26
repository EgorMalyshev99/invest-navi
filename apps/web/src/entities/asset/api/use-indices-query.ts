'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchIndices } from './asset-api';
import { assetKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function indicesQueryOptions() {
  return queryOptions({
    queryKey: assetKeys.indices,
    queryFn: fetchIndices,
  });
}

export function useIndicesQuery(options?: QueryHookOverrides) {
  return useQuery({ ...indicesQueryOptions(), ...options });
}
