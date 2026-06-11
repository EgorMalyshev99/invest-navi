import { createFileRoute } from '@tanstack/react-router';

import { LoginForm } from '@/features/auth';
import { useTranslations } from '@/i18n/react-i18n';
import { AuthPageShell } from '@/widgets/auth-page-shell';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const t = useTranslations('auth');

  return (
    <AuthPageShell title={t('loginTitle')}>
      <LoginForm />
    </AuthPageShell>
  );
}
