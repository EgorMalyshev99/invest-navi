import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchDiaryRetrospective } from './diary-api';
import { diaryKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function diaryRetrospectiveQueryOptions(entryId: string, locale: string) {
  return queryOptions({
    queryKey: diaryKeys.retrospective(entryId, locale),
    queryFn: () => fetchDiaryRetrospective(entryId, locale),
    enabled: Boolean(entryId),
    staleTime: 60_000,
  });
}

export function useDiaryRetrospectiveQuery(
  entryId: string,
  locale: string,
  options?: QueryHookOverrides,
) {
  return useQuery({ ...diaryRetrospectiveQueryOptions(entryId, locale), ...options });
}
