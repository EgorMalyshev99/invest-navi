import { Suspense } from 'react';

import { DashboardShell } from '@/widgets/dashboard-shell';
import { DashboardShellSkeleton } from '@/widgets/dashboard-shell/ui/dashboard-shell-skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
