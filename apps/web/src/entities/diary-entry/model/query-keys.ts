import type { DiaryStatus } from '@/shared/api/graphql/generated/graphql';

export const diaryKeys = {
  all: ['diary'] as const,
  list: (status?: DiaryStatus) => [...diaryKeys.all, 'list', status ?? 'all'] as const,
  detail: (id: string) => [...diaryKeys.all, 'detail', id] as const,
  retrospective: (entryId: string, locale: string) =>
    [...diaryKeys.all, 'retrospective', entryId, locale] as const,
};
