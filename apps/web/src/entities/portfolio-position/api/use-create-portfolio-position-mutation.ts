import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { createPortfolioPosition } from './portfolio-api';
import { portfolioKeys } from '../model/query-keys';

import type { CreatePortfolioPositionInput } from '@/shared/api/graphql/generated/graphql';

export function createPortfolioPositionMutationOptions() {
  return mutationOptions({
    mutationFn: (input: CreatePortfolioPositionInput) => createPortfolioPosition(input),
  });
}

export function useCreatePortfolioPositionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...createPortfolioPositionMutationOptions(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: portfolioKeys.positions() }),
        queryClient.invalidateQueries({ queryKey: portfolioKeys.summary() }),
      ]);
    },
  });
}
