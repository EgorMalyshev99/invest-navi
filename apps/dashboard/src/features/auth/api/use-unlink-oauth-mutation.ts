'use client';

import {
  mutationOptions,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { unlinkOAuthProvider } from './unlink-oauth-api';
import { authKeys } from '../model/query-keys';

import type {
  OAuthProvider,
  UnlinkOAuthProviderMutation,
} from '@/shared/api/graphql/generated/graphql';

type UnlinkOAuthProviderData = UnlinkOAuthProviderMutation['unlinkOAuthProvider'];

export function unlinkOAuthProviderMutationOptions() {
  return mutationOptions({
    mutationFn: (provider: OAuthProvider) => unlinkOAuthProvider(provider),
  });
}

export function useUnlinkOAuthProviderMutation(
  options?: UseMutationOptions<UnlinkOAuthProviderData, Error, OAuthProvider>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    ...unlinkOAuthProviderMutationOptions(),
    ...restOptions,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
