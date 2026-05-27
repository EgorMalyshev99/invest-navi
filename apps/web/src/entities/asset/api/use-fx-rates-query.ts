'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchFxRates } from './asset-api';
import { assetKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function fxRatesQueryOptions() {
  return queryOptions({
    queryKey: assetKeys.fxRates,
    queryFn: fetchFxRates,
  });
}

export function useFxRatesQuery(options?: QueryHookOverrides) {
  return useQuery({ ...fxRatesQueryOptions(), ...options });
}
