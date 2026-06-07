import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { updateDiaryEntry } from './diary-api';
import { diaryKeys } from '../model/query-keys';

import type { UpdateDiaryEntryInput } from '@/shared/api/graphql/generated/graphql';

export function updateDiaryEntryMutationOptions() {
  return mutationOptions({
    mutationFn: ({ id, input }: { id: string; input: UpdateDiaryEntryInput }) =>
      updateDiaryEntry(id, input),
  });
}

export function useUpdateDiaryEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateDiaryEntryMutationOptions(),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: diaryKeys.all });
      await queryClient.invalidateQueries({ queryKey: diaryKeys.detail(variables.id) });
    },
  });
}
