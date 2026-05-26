'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchMe } from './auth-api';
import { authKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function meQueryOptions() {
  return queryOptions({
    queryKey: authKeys.me,
    queryFn: fetchMe,
  });
}

export function useMeQuery(options?: QueryHookOverrides) {
  return useQuery({ ...meQueryOptions(), ...options });
}
