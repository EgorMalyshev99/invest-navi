import { mutationOptions, useMutation } from '@tanstack/react-query';

import { requestEducationalAnswer } from './educational-answer-api';

import type { EducationalAnswerInput } from '@/shared/api/graphql/generated/graphql';

export function educationalAnswerMutationOptions() {
  return mutationOptions({
    mutationFn: (input: EducationalAnswerInput) => requestEducationalAnswer(input),
  });
}

export function useEducationalAnswerMutation() {
  return useMutation(educationalAnswerMutationOptions());
}
