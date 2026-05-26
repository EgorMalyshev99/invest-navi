/** Safe TanStack Query overrides for thin entity/feature hooks (avoids queryKey generic conflicts). */
export type QueryHookOverrides = {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
};
