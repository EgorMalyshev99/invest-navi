import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePortfolioPosition } from './portfolio-api';
import { portfolioKeys } from '../model/query-keys';

import type { UpdatePortfolioPositionInput } from '@/shared/api/graphql/generated/graphql';

export function updatePortfolioPositionMutationOptions() {
  return mutationOptions({
    mutationFn: ({ id, input }: { id: string; input: UpdatePortfolioPositionInput }) =>
      updatePortfolioPosition(id, input),
  });
}

export function useUpdatePortfolioPositionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...updatePortfolioPositionMutationOptions(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: portfolioKeys.positions() }),
        queryClient.invalidateQueries({ queryKey: portfolioKeys.summary() }),
      ]);
    },
  });
}
