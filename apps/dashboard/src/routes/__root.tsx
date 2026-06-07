import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import type { AuthContextValue } from '@/shared/auth/auth-context';
import type { QueryClient } from '@tanstack/react-query';


export interface RouterContext {
  auth: AuthContextValue;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});
