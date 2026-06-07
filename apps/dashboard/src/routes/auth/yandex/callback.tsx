import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { handleOAuthCallback } from '@/features/auth/lib/handle-oauth-callback';

export const Route = createFileRoute('/auth/yandex/callback')({
  component: YandexCallbackPage,
});

function YandexCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void handleOAuthCallback(new URLSearchParams(window.location.search), 'yandex').then((to) =>
      navigate({ to, replace: true }),
    );
  }, [navigate]);

  return <p className="text-muted-foreground p-6 text-sm">Завершаем вход...</p>;
}
