import { createFileRoute } from '@tanstack/react-router';

import { RegisterForm } from '@/features/auth';
import { useTranslations } from '@/i18n/react-i18n';
import { AuthPageShell } from '@/widgets/auth-page-shell';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const t = useTranslations('auth');

  return (
    <AuthPageShell title={t('registerTitle')}>
      <RegisterForm />
    </AuthPageShell>
  );
}
