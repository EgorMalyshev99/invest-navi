import { createFileRoute } from '@tanstack/react-router';

import { OAuthCallbackPage } from '@/features/auth/ui/oauth-callback-page';

export const Route = createFileRoute('/auth/google/callback')({
  component: () => <OAuthCallbackPage provider="google" />,
});
