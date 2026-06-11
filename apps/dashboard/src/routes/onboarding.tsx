import { createFileRoute, redirect } from '@tanstack/react-router';

import { KnowledgeLevelOnboarding } from '@/features/auth/ui/knowledge-level-onboarding';
import { useTranslations } from '@/i18n/react-i18n';
import { AuthPageShell } from '@/widgets/auth-page-shell';

export const Route = createFileRoute('/onboarding')({
  beforeLoad: ({ context }) => {
    if (context.auth.isReady && !context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const t = useTranslations('auth');

  return (
    <AuthPageShell title={t('onboardingTitle')}>
      <KnowledgeLevelOnboarding />
    </AuthPageShell>
  );
}
