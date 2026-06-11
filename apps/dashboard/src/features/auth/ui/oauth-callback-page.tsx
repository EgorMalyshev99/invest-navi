'use client';

import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import type { OAuthProvider } from '@/features/auth/lib/oauth-providers';

import { handleOAuthCallback } from '@/features/auth/lib/handle-oauth-callback';
import { OAuthCallbackLoading } from '@/features/auth/ui/oauth-callback-loading';

type OAuthCallbackPageProps = {
  provider: OAuthProvider;
};

export function OAuthCallbackPage({ provider }: OAuthCallbackPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    void handleOAuthCallback(new URLSearchParams(window.location.search), provider).then((to) =>
      navigate({ to, replace: true }),
    );
  }, [navigate, provider]);

  return <OAuthCallbackLoading />;
}
