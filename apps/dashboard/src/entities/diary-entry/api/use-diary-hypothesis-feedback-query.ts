import { mutationOptions, useMutation } from '@tanstack/react-query';

import { fetchDiaryHypothesisFeedback } from './diary-api';

import type { DiaryHypothesisFeedbackInput } from '@/shared/api/graphql/generated/graphql';

/** GraphQL field is a query; exposed as on-demand request hook for form UX. */
export function diaryHypothesisFeedbackQueryOptions() {
  return mutationOptions({
    mutationFn: (input: DiaryHypothesisFeedbackInput) => fetchDiaryHypothesisFeedback(input),
  });
}

export function useDiaryHypothesisFeedbackQuery() {
  return useMutation(diaryHypothesisFeedbackQueryOptions());
}
