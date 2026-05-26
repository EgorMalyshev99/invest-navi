import { mutationOptions, useMutation } from '@tanstack/react-query';

import { fetchDiaryHypothesisFeedback } from './diary-api';

import type { DiaryHypothesisFeedbackInput } from '@/shared/api/graphql/generated/graphql';

export function diaryHypothesisFeedbackMutationOptions() {
  return mutationOptions({
    mutationFn: (input: DiaryHypothesisFeedbackInput) => fetchDiaryHypothesisFeedback(input),
  });
}

export function useDiaryHypothesisFeedbackMutation() {
  return useMutation(diaryHypothesisFeedbackMutationOptions());
}
