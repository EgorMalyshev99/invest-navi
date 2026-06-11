import { Navigate, Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { Suspense } from 'react';

import { DashboardShell, DashboardShellSkeleton } from '@/widgets/dashboard-shell';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isReady) {
      return;
    }

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { from: location.pathname },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { auth } = Route.useRouteContext();

  if (!auth.isReady) {
    return <DashboardShellSkeleton />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" search={{ from: window.location.pathname }} />;
  }

  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <DashboardShell>
        <Outlet />
      </DashboardShell>
    </Suspense>
  );
}
