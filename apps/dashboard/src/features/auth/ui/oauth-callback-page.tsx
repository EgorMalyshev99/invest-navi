'use client';

import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import type { OAuthProvider } from '@/features/auth/lib/oauth-providers';

import { handleOAuthCallback } from '@/features/auth/lib/handle-oauth-callback';
import { parseAuthNavigateTarget } from '@/features/auth/lib/parse-auth-navigate-target';
import { OAuthCallbackLoading } from '@/features/auth/ui/oauth-callback-loading';

type OAuthCallbackPageProps = {
  provider: OAuthProvider;
};

export function OAuthCallbackPage({ provider }: OAuthCallbackPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    void handleOAuthCallback(new URLSearchParams(window.location.search), provider).then((href) => {
      const target = parseAuthNavigateTarget(href);
      navigate({ ...target, replace: true });
    });
  }, [navigate, provider]);

  return <OAuthCallbackLoading />;
}
