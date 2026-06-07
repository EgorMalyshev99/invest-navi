import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchDiaryEntry } from './diary-api';
import { diaryKeys } from '../model/query-keys';

import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function diaryEntryQueryOptions(id: string) {
  return queryOptions({
    queryKey: diaryKeys.detail(id),
    queryFn: () => fetchDiaryEntry(id),
    enabled: Boolean(id),
  });
}

export function useDiaryEntryQuery(id: string, options?: QueryHookOverrides) {
  return useQuery({ ...diaryEntryQueryOptions(id), ...options });
}
