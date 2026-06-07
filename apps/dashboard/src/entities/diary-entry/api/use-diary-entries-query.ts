import { queryOptions, useQuery } from '@tanstack/react-query';

import { fetchDiaryEntries } from './diary-api';
import { diaryKeys } from '../model/query-keys';

import type { DiaryStatus } from '@/shared/api/graphql/generated/graphql';
import type { QueryHookOverrides } from '@/shared/api/query-hook-overrides';

export function diaryEntriesQueryOptions(status?: DiaryStatus) {
  return queryOptions({
    queryKey: diaryKeys.list(status),
    queryFn: () => fetchDiaryEntries(status),
  });
}

export function useDiaryEntriesQuery(status?: DiaryStatus, options?: QueryHookOverrides) {
  return useQuery({ ...diaryEntriesQueryOptions(status), ...options });
}
