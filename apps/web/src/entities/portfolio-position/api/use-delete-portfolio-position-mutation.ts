import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePortfolioPosition } from './portfolio-api';
import { portfolioKeys } from '../model/query-keys';

export function deletePortfolioPositionMutationOptions() {
  return mutationOptions({
    mutationFn: (id: string) => deletePortfolioPosition(id),
  });
}

export function useDeletePortfolioPositionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...deletePortfolioPositionMutationOptions(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: portfolioKeys.positions() }),
        queryClient.invalidateQueries({ queryKey: portfolioKeys.summary() }),
      ]);
    },
  });
}
