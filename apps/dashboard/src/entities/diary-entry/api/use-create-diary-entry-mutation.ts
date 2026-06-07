import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { createDiaryEntry } from './diary-api';
import { diaryKeys } from '../model/query-keys';

import type { CreateDiaryEntryInput } from '@/shared/api/graphql/generated/graphql';

export function createDiaryEntryMutationOptions() {
  return mutationOptions({
    mutationFn: (input: CreateDiaryEntryInput) => createDiaryEntry(input),
  });
}

export function useCreateDiaryEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...createDiaryEntryMutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: diaryKeys.all });
    },
  });
}
