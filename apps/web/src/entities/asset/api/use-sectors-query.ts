'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchSectors } from './asset-api';
import { assetKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function sectorsQueryOptions() {
  return queryOptions({
    queryKey: assetKeys.sectors,
    queryFn: fetchSectors,
  });
}

export function useSectorsQuery(options?: QueryHookOverrides) {
  return useQuery({ ...sectorsQueryOptions(), ...options });
}
