import { queryOptions, useQuery } from '@tanstack/react-query';

import { weeklyReviewKeys } from '@/entities/weekly-review/model/query-keys';

import { fetchWeeklyMarketReview } from './weekly-review-api';

export function weeklyReviewQueryOptions(locale: string) {
  return queryOptions({
    queryKey: weeklyReviewKeys.detail(locale),
    queryFn: () => fetchWeeklyMarketReview(locale),
    staleTime: 60 * 60 * 1000,
  });
}

export function useWeeklyReviewQuery(locale: string) {
  return useQuery(weeklyReviewQueryOptions(locale));
}
