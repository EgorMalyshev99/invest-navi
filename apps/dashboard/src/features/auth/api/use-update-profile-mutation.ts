'use client';

import {
  mutationOptions,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { updateProfile } from './auth-api';
import { authKeys } from '../model/query-keys';

import type {
  UpdateProfileInput,
  UpdateProfileMutation,
} from '@/shared/api/graphql/generated/graphql';

type UpdateProfileData = UpdateProfileMutation['updateProfile'];

export function updateProfileMutationOptions() {
  return mutationOptions({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
  });
}

export function useUpdateProfileMutation(
  options?: UseMutationOptions<UpdateProfileData, Error, UpdateProfileInput>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    ...updateProfileMutationOptions(),
    ...restOptions,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
