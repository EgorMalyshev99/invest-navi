import { DashboardShell } from '@/widgets/dashboard-shell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
