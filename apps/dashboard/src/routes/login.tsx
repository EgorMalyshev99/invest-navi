import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginForm } from '@/features/auth';
import { getStoredPostAuthFrom } from '@/features/auth/lib/post-auth-from';
import { resolvePostAuthRedirect } from '@/features/auth/lib/resolve-post-auth-redirect';
import { useTranslations } from '@/i18n/react-i18n';
import { AuthPageShell } from '@/widgets/auth-page-shell';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth.isReady && context.auth.isAuthenticated) {
      throw redirect({ to: resolvePostAuthRedirect(getStoredPostAuthFrom()) });
    }
  },
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
