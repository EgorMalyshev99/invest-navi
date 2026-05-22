import { PublicShell } from '@/widgets/public-shell';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell variant="minimal">{children}</PublicShell>;
}
