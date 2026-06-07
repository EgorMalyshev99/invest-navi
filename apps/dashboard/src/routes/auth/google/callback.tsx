import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { handleOAuthCallback } from '@/features/auth/lib/handle-oauth-callback';

export const Route = createFileRoute('/auth/google/callback')({
  component: GoogleCallbackPage,
});

function GoogleCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void handleOAuthCallback(new URLSearchParams(window.location.search), 'google').then((to) =>
      navigate({ to, replace: true }),
    );
  }, [navigate]);

  return <p className="text-muted-foreground p-6 text-sm">Завершаем вход...</p>;
}
